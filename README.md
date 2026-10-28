# DOOMSDAY READY

> Pick a track. Binge what matters. Prove you're ready.
> A gamified, comic-book-styled prep platform for **Avengers: Doomsday** (in cinemas **December 18, 2026**).

Unofficial fan project. Not affiliated with or endorsed by Marvel Studios or Disney.

**Stack:** TanStack Start (React 19, server functions, Vite + Nitro) · TypeScript everywhere · Tailwind v4 · Motion · Drizzle + Postgres (PGlite locally) · Better Auth · Zod · Vitest + Playwright. One app, one deploy.

Design canvas: https://claude.ai/artifact/FzQMxAsCmMNnTGCw8gaa6a · Architecture docs: [`docs/`](docs)

---

## Quick start

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

That's it. No database to install: without `DATABASE_URL` the app runs an embedded Postgres (PGlite) in `./.data/` and migrates it on boot. Delete `.data/` to reset.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` / `pnpm start` | Production build (Nitro) / run it locally |
| `pnpm test` | Unit + integration tests (in-memory Postgres) |
| `pnpm typecheck` | Regenerate the route tree + `tsc --noEmit` |
| `pnpm smoke` | Browser end-to-end run against a running server (`BASE=…`) |
| `pnpm db:generate` | New SQL migration from `src/server/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations to `DATABASE_URL` |

## What's in v1

- **Landing:** live countdown, animated hero, ticker, toolkit, track teasers, top-3 board.
- **Tracks:** Speedrun, Essentials, Deep Dive, Multiverse, with hours and hrs/day until release.
- **Watchlist:**
  - Comic-panel cards with a WATCHED! stamp, optimistic ticks and +XP toasts.
  - Filters (in the URL) and release vs. story order.
  - Readiness meter.
- **Title pages:** why it matters, Doomsday relevance, **where to watch** (TMDB/JustWatch per country, licensed providers only), title quiz.
- **Quiz engine** (all server-side):
  - **Readiness Exam:** 20 questions; 80%+ = READY.
  - **Daily Challenge:** same 5 for everyone, one attempt.
  - **Title quizzes:** 5 questions on one title.
  - Seeded weighted sampling, a 20s timer kept by the server, ×5 combos, 50/50 and hint lifelines.
  - Answers never reach the browser.
- **Verdict:** a stamp per score band, confetti, XP, rank, weak-spot report, full debrief, share to X/WhatsApp, retake.
- **Gamification:** append-only XP ledger, 6 ranks, all-time, weekly and daily leaderboards.
- **Accounts:**
  - Everyone starts as a **guest** automatically, with progress saved server-side.
  - Signing up keeps all of it (Better Auth anonymous → email/password, plus Google/Discord when configured).
- **Content:** 52 titles (MCU films, Disney+ series, Fox X-Men) and a 162-question bank (43 easy, 99 medium, 20 hard) in [`src/content`](src/content).

## Project layout

```
src/
  content/        catalog.ts (titles, tracks), questions.ts (bank, server-only)
  server/
    fns.ts        every server function (the API surface)
    services/     pure domain logic: quiz/engine.ts, quiz/sessions.ts, progress, xp, leaderboard, watch, merge
    db/           Drizzle schema + client (PGlite or postgres-js)
    auth.ts       Better Auth config     session.ts  user/guest/country helpers
  shared/         game rules (ranks, pass mark, XP) + quiz types, safe for the client
  components/     Icon set, comic kit (Burst, Meter, PosterPanel…), Header/Footer
  routes/         file-based routes (TanStack Router)
  lib/            query options, auth client, toasts, useTick
drizzle/          SQL migrations
tests/            engine.test.ts (unit), integration.test.ts (PGlite in-memory)
scripts/          migrate.ts, smoke.mjs
docs/             architecture, PRD, data model, quiz engine, design system, ADRs, roadmap
```

## Environment

Copy `.env.example` → `.env`. Everything is optional locally. In production you need `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`. Add `TMDB_READ_TOKEN` for real posters and per-country providers.

## Deploy (Vercel + Neon)

1. Create a Neon Postgres database and copy its connection string.
2. `DATABASE_URL=… pnpm db:migrate`
3. Import the repo on Vercel (framework is detected from `vercel.json`) and set the env vars above.
4. Push. That's the whole backend and frontend in one deploy.

Other targets (Netlify, Cloudflare, Node/Docker) work through Nitro presets; see `docs/02-ARCHITECTURE.md`.

## Adding questions

Edit `src/content/questions.ts`: one `*`-prefixed correct option, three distractors, an explanation and a spoiler level. `pnpm test` checks every question has 4 unique options and exactly one answer. Never renumber existing questions; IDs are positional and stored in sessions. Append instead.
