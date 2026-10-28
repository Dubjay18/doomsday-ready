# 08 · gstack Reviews

The plan was run through three gstack roles (adapted from garrytan/gstack): **/plan-ceo**, **/plan-eng** and **/qa**. Findings are already folded into the other docs. This file records the reasoning.

---

## /plan-ceo: CEO / Founder review

**Mode: Selective Expansion → Reduction on timeline.** The core (tracks + quiz + READY badge + share card) is right. The surface area is too wide for **52 days**, and the product's value peaks in the two weeks before Dec 18.

| # | Section | Finding |
|---|---|---|
| 1 | Problem clarity | Clear and time-boxed: "what do I watch, and am I ready?" The deadline is the marketing. |
| 2 | User specificity | The Crammer is the volume user. The True Believer is the leaderboard user. Optimise onboarding for the first and depth for the second. |
| 3 | Scope | Too wide for one engineer in 52 days. Versus, PWA, watch-plan scheduler, collectible covers and poster-crop questions move to P2. |
| 4 | 10-star vision | Your whole group chat gets a READY card the week of release. Squads compare. After the film, the same engine runs "Secret Wars Ready" (Dec 2027) and any future event film. **Build the event as config, not code.** |
| 5 | Risks | (a) Shipping late = zero value. (b) Question quality: one wrong answer screenshot kills trust. (c) IP: Marvel branding or character art invites takedowns. (d) Linking to piracy sites gets the domain and ad accounts killed. |
| 6 | Success metrics | North star: **# READY cards shared**. It captures both the "ready" outcome and virality. |
| 7 | Cut | Country board (until > 1k users), per-episode ticks (title-level is enough for MVP), sound, Versus. |
| 8 | Missing | A spoiler policy for *Brand New Day* (July 2026), a public "report question" path, a post-Dec-18 plan, and a reason to return daily (**Daily Challenge** → promoted to P1). |
| 9 | Differentiation | Watch-order sites are static lists. This one makes you prove it and ranks you against friends. Keep the voice playful, not encyclopaedic. |
| 10 | Recommendation | Ship MVP (tracks, ticks, title quiz, Readiness Exam, global board, Ready Card, guest mode) by **day 14**. Squads + Daily Challenge by **day 24**. Freeze features on **Dec 8**, after that only content and polish. |

**Verdict: ✅ Approve with changes.** Change: hard-date the MVP, and make the event itself a config object (`EventConfig { slug, filmTitle, releaseDates, tracks, passMark }`) so the platform outlives Dec 18.

---

## /plan-eng: Eng Manager review

### Data flow

```
 UI ──(server fn RPC)──▶ middleware[auth → rateLimit → log] ──▶ service ──▶ repo ──▶ Postgres
                                                                   │
                                                                   ├──▶ Redis (ZINCRBY, ratelimit)
                                                                   └──▶ TMDB (cron only, never in the request path)
```

### API boundary

```
 PUBLIC (cacheable)          AUTH OPTIONAL             AUTH REQUIRED            ADMIN
 listTracks getTrack         startQuiz                 markWatched              upsertQuestion
 getTitle getProviders       answerQuestion            mergeGuestProgress       reviewQuestion
 getLeaderboard getProfile   finishQuiz                createSquad joinSquad    resolveReport
 /api/og/$handle                                       updateMe
```

### Quiz session state machine
See 04-QUIZ-ENGINE §6. ACTIVE → FINISHED | EXPIRED | ABANDONED. Transitions only via server fns, guarded with `SELECT … FOR UPDATE`.

### Assumptions made explicit

| # | Assumption | If wrong… |
|---|---|---|
| A1 | TMDB has providers for most target regions (NG, US, GB, IN…) | Show region fallback + rent/buy; never block the page |
| A2 | Doomsday stays on Dec 18 | `RELEASE_DATES` is config; countdown reads it at runtime |
| A3 | ~800 reviewed questions are enough to keep exams fresh | Exposure exclusion relaxes; add Daily Challenge to spread load |
| A4 | Users accept an honour system for watch ticks | Tick XP is capped; READY depends only on the quiz |
| A5 | Neon serverless + Upstash REST are fast enough from Vercel's default region | Pin Vercel functions to the Neon region (e.g. `iad1` ↔ `us-east-1`) |
| A6 | Peak load ≈ 50 req/s around release week | Catalogue is cached; the hot path is answerQuestion (1 row write + 1 update) |

### Edge cases

| Case | Behaviour |
|---|---|
| Double-click "Mark as watched" | Idempotent insert; second call returns current state, no extra XP |
| Two tabs answering the same question | PK `(session_id,index)` → one wins, the other gets `CONFLICT` and refetches session |
| Network drops mid-quiz | `getQuizResult`/session resume on reload; timer is server-side so no free time is gained |
| Timer expires with no answer | Graded as timeout when the next call arrives, or by the expire cron |
| User changes country | Board membership moves: `ZREM` old country key, `ZADD` new |
| Redis outage | Writes to Postgres still succeed; leaderboard falls back to SQL; a backfill job re-projects ZSETs |
| TMDB down during cron | Keep previous providers; `fetchedAt` shows staleness |
| Handle squatting / offensive handles | Profanity filter + reserved list (admin, marvel, disney, official…) |
| Guest blob tampered | Zod-validate, cap merged XP, ignore unknown title ids |
| Release date passes | Countdown flips to "IN CINEMAS NOW"; exams keep working; banner promotes the next event |
| Clock skew on client | All timing uses server timestamps |

### Test matrix

| What | Layer | Verifies |
|---|---|---|
| Sampler determinism, caps, mix, exclusion | unit | same seed ⇒ same exam; never unreviewed |
| Grader / scorer / combo / lifelines | unit | maths + edge values |
| Readiness threshold | unit | 16/20 READY, 15/20 not |
| XP idempotency | integration (test DB) | duplicate award ⇒ one ledger row |
| Concurrent answer submission | integration | exactly one stored answer |
| Auth guard on every POST fn | integration | 401 without session |
| Squad privacy | integration | non-member can't read members |
| Leaderboard fallback | integration (Redis mocked down) | SQL path returns same top-N |
| Guest → sign-in merge | e2e (Playwright) | XP merged once; ticks preserved |
| Full exam to READY + Ready Card | e2e | badge, OG image 200 + correct text |
| Reduced motion | e2e | no keyframes running with `reducedMotion` emulation |
| Mobile 360 px | e2e visual | no horizontal scroll on all routes |

### Security

- Answer keys never serialised in `ClientQuestion`. Add a unit test that fails if `isCorrect` appears in any client payload type (`expectTypeOf`).
- All POST fns: auth middleware + Zod + rate limit. CSRF: Better Auth cookie is SameSite=Lax and server fns are POST with a JSON content type.
- Admin routes: role check in middleware **and** in the service (defence in depth).
- Squad codes: 8 chars base32 from `crypto.getRandomValues` (40 bits), rate-limited joins.
- OG route: escape user handle; satori renders text, not HTML, so no injection.
- Secrets only under `src/server`; lint rule blocks client imports.

### Performance

- `getLeaderboard` hydration: one `WHERE user_id = ANY($1)` query for 100 ids. **Not** 100 lookups.
- `startQuiz` pool query: index `q_title_active (title_id, active, reviewed)`. Load the reviewed pool (~1k rows) once and cache it in memory for 5 min; sampling is in-process.
- `user_stats` updated in the same transaction as `xp_events` insert (`UPDATE … SET total_xp = total_xp + $1`). No `SUM()` on read.
- Weekly reset: `UPDATE user_stats SET week_xp = 0` once a week; fine at this scale.

**Verdict: ✅ Ready to build.** Conditions: (1) server-side timer from day one, (2) `xp_events` unique key in the first migration, (3) Redis treated as a rebuildable projection.

---

## /qa: QA Lead test plan

### Happy paths
1. Guest lands → picks Speedrun → ticks 2 titles → meter shows 25%.
2. Signed-in user takes Readiness Exam, scores 17/20 → READY verdict, +XP, rank shown, Ready Card loads.
3. User creates squad → friend joins via link → both on squad board.
4. Title page shows providers for NG; switching region to GB updates the list.
5. Daily Challenge: two different users get identical questions on the same UTC day.

### Edge cases
1. Exam with spoiler-safe on and zero ticks → only `spoiler_level ≤ 1` questions; verdict labelled "spoiler-safe".
2. Answer arrives at 22.9 s (limit 20 s + 3 s grace) → accepted; 23.1 s → timeout.
3. Retake exam immediately → no question from the last 3 exams repeats (when pool allows).
4. Unicode / emoji / 40-char handle → validated, rejected or trimmed with message.
5. User at exactly a rank threshold (6,000 XP) → shows Avenger, not Agent.
6. Unticking a title → XP **not** removed (ledger is append-only), meter drops. Document it.
7. Country with no TMDB provider data → fallback copy, no crash.
8. Squad at 50 members → 51st join rejected with clear copy.
9. Two simultaneous exams in two tabs → first becomes ABANDONED.
10. Countdown after Dec 18 in a region that released Dec 17 → "IN CINEMAS NOW".

### Error scenarios
- DB unavailable → 503 page in comic style ("KRAK! Our servers took a hit"), no stack trace.
- Server fn validation error → inline field error, not toast spam.
- OG render failure → fall back to static default card image.

### Security tests
- User A requests `getQuizResult` for user B's session → 404 (not 403, don't leak existence).
- Replay an `answerQuestion` payload → CONFLICT.
- Call `upsertQuestion` as a normal user → 403.
- Inspect every network response during a quiz: no correct-answer field before lock-in.
- 100 `markWatched` calls/minute → rate-limited after 30.

### Known P2s acceptable at launch
- Episode-level ticks missing (title-level only).
- Sound effects absent.
- Country leaderboard hidden until threshold.

**QA verdict: ⚠️ Ship with known P2s (above) once happy paths 1–5 and all security tests pass.**
