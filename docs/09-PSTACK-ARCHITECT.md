# 09 · pstack `architect` Pass

pstack (Lauren Tan's skill stack, ported to Claude Code as `pstack-claude`) has an `architect` skill with one rule: **design before implementing**. Start from how callers will use the code, derive the types and module boundaries, compare structurally different solutions, and only then write code. If the implementation keeps fighting the sketch, throw the sketch away rather than adding escape hatches. Two of its principles apply throughout:

- **Laziness Protocol:** the smallest change that solves the problem.
- **Prove It Works:** check the real artifact. Show failing and passing evidence, not "should work".

Install it if you want the agent to follow this while building: see https://github.com/michael-denyer/pstack-claude (Claude Code plugin marketplace) and run `poteto-mode` with the goal.

---

## Phase 1 · Caller usage first

The code we wish we could write in the components:

```tsx
// Track page
const { data: track } = useSuspenseQuery(trackQuery(slug))
const { data: progress } = useQuery(progressQuery(slug))
const tick = useTick()                       // optimistic, handles guest vs user
<TitleCard title={t} watched={progress.has(t.id)} onToggle={() => tick(t.id)} />

// Quiz page
const quiz = useQuizSession(sessionId)        // { question, answer(choiceId), lifeline(kind), status, result }
await quiz.answer(optionId)                   // resolves with { correct, correctChoice, points }

// Verdict
const { pct, ready, weakSpots } = quiz.result
<ReadyStamp ready={ready} /> <WeakSpots items={weakSpots} />
```

Two hooks, `useTick` and `useQuizSession`, carry the product. Everything else is presentation.

## Phase 2 · Types and boundaries

```ts
// src/shared/types.ts
export type TitleId = string & { __brand: 'TitleId' }
export type TrackSlug = 'speedrun' | 'essentials' | 'deep-dive' | 'multiverse' | 'custom'

export interface EventConfig {             // makes the platform reusable after Dec 18
  slug: 'doomsday' | (string & {})
  filmTitle: string
  releaseDates: Record<string, string>     // CC → ISO date, '*' default
  passMark: number                         // 0.8
  examSize: number                         // 20
  tracks: TrackSlug[]
}

export interface QuizEngine {              // pure; no DB, no framework
  sample(pool: PoolQuestion[], opts: SampleOpts): Sampled
  grade(q: AnswerKey, choice: Choice, elapsedMs: number, limitMs: number): Graded
  score(g: Graded, state: ComboState): { points: number; next: ComboState }
  verdict(correct: number, total: number, cfg: EventConfig): { pct: number; ready: boolean }
}

export interface XpLedger {
  award(userId: string, reason: XpReason, refKey: string, amount: number): Promise<{ awarded: boolean; total: number }>
}

export interface Leaderboard {             // implemented by RedisLeaderboard and SqlLeaderboard
  bump(userId: string, delta: number, scopes: Scope[]): Promise<void>
  top(scope: Scope, limit: number): Promise<LbRow[]>
  rankOf(userId: string, scope: Scope): Promise<number | null>
}
```

**Module boundaries**

```
shared/        types, zod schemas, constants        (imported by everyone)
server/services/quiz   implements QuizEngine         (pure; 100% unit tested)
server/services/xp     implements XpLedger           (Drizzle transaction)
server/integrations/   RedisLeaderboard, SqlLeaderboard, Tmdb
server/fns/            thin: auth + validate + call service
components/, routes/   never import server/services directly
```

## Phase 3 · Arena: competing designs

### Decision 1: where does the quiz live?

| | A. Server-authoritative session (**chosen**) | B. Client quiz + signed answer bundle | C. Realtime (WebSocket/Durable Object) |
|---|---|---|---|
| How | Server stores the exam; reveals one question at a time; grades each answer | Server sends the whole exam with HMAC-hashed answers; client grades; server re-verifies at end | Live room per session; server pushes questions |
| Cheat resistance | High (answers never on client; server timer) | Low: hashes of 4 options are brute-forceable in ms | High |
| Latency feel | 1 round-trip per answer (~80–150 ms) | Instant | Instant |
| Complexity | Low | Low | High (infra, reconnects) |
| Fits leaderboard integrity | Yes | No | Yes |

**Pick A.** Hide the round-trip with optimistic "locking in…" animation (the burst animates for 400 ms anyway). C is only worth it for Versus (P2), and even then a polling fallback on A works.

### Decision 2: leaderboard storage

| | A. Postgres only | B. Redis ZSET projection over Postgres ledger (**chosen**) |
|---|---|---|
| Top-N | `ORDER BY total_xp DESC LIMIT 100` on index, fast | `ZREVRANGE`, O(log n) |
| "Your rank" | `COUNT(*) WHERE total_xp > mine`: index scan, gets slower with users | `ZREVRANK`, O(log n) |
| Weekly/daily boards | extra columns + resets | key per period with TTL |
| Failure mode | none extra | Redis down → fall back to A |

**Pick B with A as fallback.** Laziness Protocol note: at < 5k users A alone is fine. B is chosen because weekly/daily/country boards are cheap with keys, and the fallback means Redis is an optimisation, not a dependency.

### Decision 3: content storage

Questions as **typed TS files in git → seeded to Postgres** (chosen) vs. admin-only CMS. Git gives review via PR, diffs and Zod validation in CI. The admin UI is for the review queue and quick fixes, and it writes back to the DB. A nightly export script keeps git in sync.

## Phase 4 · Implement against the sketch

Order of work (each step ends green before the next starts):

1. `shared/` types + `QuizEngine` pure implementation + unit tests
2. Drizzle schema + migrations + seed (catalogue + 100 starter questions)
3. `XpLedger` + `SqlLeaderboard` + integration tests on a Neon branch
4. Server fns + middleware
5. Routes and comic components
6. `RedisLeaderboard`, OG cards, squads

## Phase 5 · Prove it works

| Claim | Evidence to attach to the PR |
|---|---|
| Exams are deterministic per seed | Vitest output: same seed ⇒ identical ids (and a failing run before the fix if a regression happens) |
| Answers never leak | Playwright HAR of a full exam + `grep isCorrect` → 0 matches |
| XP is idempotent | Integration test: 10 parallel `markWatched` → 1 ledger row |
| READY at 80% | Unit test table 15/20 → false, 16/20 → true |
| Leaderboard fallback | Test with Redis client stubbed to throw → identical top-10 from SQL |
| Mobile + reduced motion | Playwright screenshots at 360 px; trace with `reducedMotion: 'reduce'` showing no running animations |
