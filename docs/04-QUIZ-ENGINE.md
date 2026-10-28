# 04 · Quiz Engine

The quiz is the heart of the product. It has to feel random and fair, and it has to be impossible to cheat from DevTools.

## 1. Modes

| Mode | Questions | Pool | Timer | Counts for READY? | XP |
|---|---|---|---|---|---|
| **Title quiz** | 5 | one title (must be ticked) | 20 s | no | yes, first clear per title |
| **Readiness Exam** | 20 | whole MCU (+ Fox X-Men tagged titles), weighted | 20 s | **yes: ≥ 80% → READY** | yes, best-of per day |
| **Daily Challenge** | 5 | same seed for everyone that UTC day | 15 s | no | yes, once per day |
| **Placement** | 10 | easy/medium across eras | none | no | no; builds custom track |
| **Versus** (P2) | 10 | shared seed between two players | 15 s | no | winner bonus |

**Readiness rule:** `correct / total ≥ 0.80` on a Readiness Exam, i.e. at least 16/20. Points, time bonus and combo **do not** affect the percentage. They only affect XP and leaderboard. Users can retake. Each attempt draws fresh questions (see exposure).

**Spoiler-safe mode:** when on, the exam excludes questions with `spoiler_level ≥ 2` from titles the user hasn't ticked. The verdict says "READY (spoiler-safe)" so it's honest.

## 2. Question bank

Authored as typed TS in `content/questions/<titleId>.ts`, validated by Zod, seeded to Postgres.

```ts
// content/questions/loki.ts
import { q } from '../dsl'
export default [
  q.mcq({
    difficulty: 'easy', spoiler: 1,
    prompt: 'What organisation polices the Sacred Timeline?',
    options: ['S.H.I.E.L.D.', '*The Time Variance Authority', 'S.W.O.R.D.', 'The Ten Rings'], // * = correct
    explanation: 'The TVA prunes branch timelines. Its collapse is how the multiverse opened up.',
  }),
  q.order({
    difficulty: 'hard', spoiler: 2,
    prompt: 'Put these Loki moments in order',
    items: ['Arrested by the TVA', 'Meets Sylvie', 'Reaches the Citadel at the End of Time', 'Takes the throne at the Temporal Loom'],
  }),
]
```

**Targets:** ~15 reviewed questions per essential title, ~8 per recommended, ~5 per optional. That works out to roughly **700–900 questions**, enough that a 20-question exam rarely repeats.

**Authoring pipeline:**
1. `scripts/gen-questions.ts` (optional) drafts questions per title with the Anthropic TypeScript SDK from a title's synopsis and your notes. They land with `reviewed=false`.
2. Admin review queue (`/admin/review`): approve, edit or reject. **Only `reviewed=true` questions are ever served.**
3. `validate-content.ts` checks: exactly one correct MCQ option, 3 distractors, no duplicate prompts (normalised Levenshtein < 0.15 flagged), explanation present, spoiler level set.
4. Live calibration: `times_correct / times_shown` recomputes empirical difficulty weekly. Questions with < 15% or > 97% correct after 200 shows get flagged.

Write questions about **facts in the films** (who, what, where, order of events). Don't paste long dialogue quotes; keep any line to a few words.

## 3. Sampling algorithm (Readiness Exam)

```
input: userId, seed, N=20, spoilerSafe, watchedSet
1. candidate pool  = questions WHERE reviewed AND active
                     [AND spoiler filter]
2. exclude         = questions this user saw in the last 3 exams (question_exposures.last_seen_at)
                     (if pool too small after exclusion, relax oldest-first)
3. weight(q)       = title.doomsday_weight            (0.2 … 1.0)
                   × (watchedSet.has(q.title) ? 1.0 : 0.6)
                   × difficultyFactor
4. stratify        = 6 easy / 9 medium / 5 hard
5. per-title cap   = max 2 questions per title, max 4 per phase
6. draw            = weighted sampling without replacement using mulberry32(seed)
                     (Efraimidis–Spirakis: key = rand^(1/weight), take top-k per stratum)
7. shuffle         = order of questions + options per question, also from seed
8. persist         = question_ids[], option_order[][] on the session
```

```ts
// src/server/services/quiz/sampler.ts  (pure, unit-tested)
export function sampleExam(pool: PoolQuestion[], opts: SampleOpts): Sampled {
  const rand = mulberry32(opts.seed)
  const byStratum = groupBy(pool, (q) => q.difficulty)
  const picked: PoolQuestion[] = []
  for (const [diff, k] of Object.entries(opts.mix)) {
    const keyed = byStratum[diff]
      .map((q) => ({ q, key: Math.pow(rand(), 1 / weight(q, opts)) }))
      .sort((a, b) => b.key - a.key)
    for (const { q } of keyed) {
      if (picked.length >= opts.n || countOf(picked, diff) >= k) break
      if (respectsCaps(picked, q, opts)) picked.push(q)
    }
  }
  return { questions: shuffle(picked, rand), optionOrder: picked.map((q) => shuffle(q.optionIds, rand)) }
}
```

Same seed + same pool always gives the same exam. That makes the Daily Challenge (seed = hash(date)) and Versus (shared seed) trivial, and makes bugs reproducible.

## 4. Grading and scoring

```
correct      = server compares choice to answer key (never sent before lock-in)
base         = { easy: 100, medium: 150, hard: 200 }[difficulty]
timeBonus    = round(50 × max(0, 1 − elapsed/limit))        (elapsed = SERVER time)
combo        = 1 → 5 cap; +1 per consecutive correct; reset to 1 on miss
points       = correct ? (base + timeBonus) × combo : 0
lifeline use = 50/50 halves base for that question; hint −25 points
```

**XP from a quiz session** = `floor(score / 10)` + `READY` bonus 500 (first time only) + `Flawless` 250 (20/20, once).

## 5. Anti-cheat

| Threat | Mitigation |
|---|---|
| Read answers from network/JS | Client gets `{prompt, options[{id,label}]}` only. Correct id is returned **after** the answer is stored. |
| Replay/double-submit | PK `(session_id, index)`. Server checks `index === cursor`. |
| Pause to google | **Server-measured** elapsed from `served_at`. Over limit + 3 s grace → graded as timeout. |
| Open many sessions and keep the best | One `active` exam per user; starting a new one abandons the old (counts as attempt). Leaderboard uses XP, not best %. |
| Script spam | `@upstash/ratelimit`: answer 2/s, startQuiz 10/min. Bot-like answer times (< 400 ms consistently) → session flagged, XP withheld pending review. |
| Farm XP via guest resets | Guest merge caps XP; daily XP cap on ticks (10 titles/day). |
| Tamper with option order | Option order is stored server-side; client sends option **ids**, not indexes. |

## 6. State machine (session)

```
           startQuiz
              │
              ▼
   ┌──────► ACTIVE ──answer(i<N-1)──┐
   │          │  ▲                  │
   │          │  └──────────────────┘
   │   answer(i=N-1) / finish        expires_at passed (cron / lazy check)
   │          ▼                              ▼
   │      FINISHED                        EXPIRED   (graded on answered questions,
   │                                                  unanswered = wrong)
   └── startQuiz (same mode) ──► previous ACTIVE → ABANDONED
```

## 7. Weak-spot report

Group wrong answers by `title_id`, sort by `doomsday_weight desc`. For each: title, count missed, the topic tag (from `meta.topic`), and links to **recap** and **where to watch**. That turns a fail into a reason to come back.

## 8. Tests that must exist

- `sampler.test.ts`: deterministic for a fixed seed; respects mix, caps, exclusion; never returns unreviewed.
- `grader.test.ts`: MCQ/TF/order grading; timeout; lifeline maths; combo cap.
- `readiness.test.ts`: 16/20 = READY, 15/20 = not; spoiler-safe label.
- Integration: two concurrent `answerQuestion` calls for the same index → exactly one row, one 409.
- E2E: guest takes title quiz → signs in → XP merged once.
