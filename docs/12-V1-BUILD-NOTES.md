# 12 · v1 Build Notes

v1 covers the **Sprint 1 MVP** from [10-ROADMAP.md](10-ROADMAP.md) plus the Daily Challenge from Sprint 2. This page records what was built, where the implementation intentionally differs from the earlier docs, and what's next.

## Verified

| Check | Result |
|---|---|
| `pnpm test`: engine + content unit tests | 19 passing |
| `pnpm test`: integration tests (in-memory Postgres) | 11 passing: idempotent XP, 10 concurrent ticks → 1 ledger row, no double submit, owner-only sessions, server-side timeout, READY bonus once, 15/20 vs 16/20, identical daily questions, guest → account merge |
| `pnpm typecheck` | clean |
| `pnpm build` + `pnpm start` | production server boots; all routes 200 |
| `pnpm smoke` (dev **and** production build) | guest ticks → 20-question exam → sign-up keeps XP → leaderboard → daily → mobile: **0 console errors, 0px horizontal overflow at 390px** |
| Answer leak check | no question answers or explanations in `.output/public` (client bundle) |

## Deliberate differences from the architecture docs

| Doc said | v1 does | Why |
|---|---|---|
| Questions + catalogue seeded into Postgres tables | Kept as typed TS in `src/content`, loaded in memory; the DB holds only user state | Smallest thing that works (pstack "Laziness Protocol"). Git review/diffs for content, zero seeding, and the question module is server-only so answers never ship to the client. Move to tables when an admin editor is needed. |
| Guest progress in `localStorage`, merged on sign-in | Every visitor gets a server-side **anonymous user** (Better Auth `anonymous` plugin); sign-up links it via `onLinkAccount` → `mergeUserData` | One code path for guests and users, nothing to sync, tamper-proof. |
| Upstash Redis sorted sets for boards | SQL boards only (`SqlLeaderboard` path from ADR-003) | ADR-003 already treats Redis as an optimisation. Indexed SQL is fine at launch scale. Add Redis behind the same `getLeaderboard` call if `/leaderboard` p95 grows. |
| `.inputValidator(schema)` (07-API.md) | `.validator(schema)` | That's the method name in the installed `@tanstack/react-start` 1.169. |
| Neon serverless driver | `postgres` (postgres-js) for any `DATABASE_URL`; **PGlite** when unset | Works with Neon, Supabase or local Postgres alike; PGlite means zero-setup local dev. |
| Watch providers refreshed nightly by cron into a table | Fetched live from TMDB per (title, region) with a 12h in-memory cache; JustWatch search link when no token | No cron needed for v1. Promote to a table + cron when traffic warrants. |
| Hero handles unique | Not unique yet | Add a unique index on `lower(name)` + a handle picker (P1). |

## Not in v1 (next up)

1. **Squads** (private boards via invite code): Sprint 2.
2. **Ready Card OG image** (`/api/og/$handle` with satori): v1 shares text + link to X/WhatsApp.
3. Streaks + achievements, question report button + admin review queue.
4. Placement quiz / "build my track", order-the-events & poster-crop question types.
5. Rate limiting (`@upstash/ratelimit` middleware) before public launch.
6. More questions: the bank is 162 (43 easy / 99 medium / 20 hard). Target 800 per 04-QUIZ-ENGINE.md, prioritising **hard** questions, which the exam mix wants 5 of.
7. Content to verify before launch: *Spider-Man: Brand New Day* and *VisionQuest* have no questions yet (released after the question author's knowledge). Runtimes are approximate until TMDB sync.

## Pre-launch checklist

- [ ] `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL` set on Vercel; `pnpm db:migrate` run against Neon
- [ ] `TMDB_READ_TOKEN` set (real posters + providers) and TMDB attribution visible (footer has it)
- [ ] Rate limiting added to `answerFn`, `markWatched`, `startQuizFn`
- [ ] Unique handles
- [ ] Have a second person proofread all questions
