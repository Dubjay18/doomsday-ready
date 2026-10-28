# 10 · Roadmap: 52 days to opening night

Today is **Tue Oct 27, 2026**. Doomsday opens **Fri Dec 18**. Every day of delay is a day of lost value, so the plan front-loads the core loop.

```
Oct 27 ─────── Nov 10 ─────── Nov 20 ──────────── Dec 8 ──────── Dec 18
 │  Sprint 1      │  Sprint 2    │   Sprint 3         │  Polish +   │  🎬
 │  Core loop     │  Social      │   Fun layer        │  content    │
 │                ▲ MVP LIVE     ▲ squads + daily     ▲ FEATURE FREEZE
```

## Sprint 0 · Oct 27–28 (2 days): foundation
- [ ] `pnpm create @tanstack/start`, Tailwind v4 tokens, fonts, comic component kit (Panel, InkButton, Burst, Stamp, Meter)
- [ ] Neon + Drizzle schema + migrations; Upstash; Better Auth (Google + magic link)
- [ ] CI: typecheck, lint, vitest, content validation; Vercel preview deploys

## Sprint 1 · Oct 29 – Nov 10: MVP (core loop)
- [ ] `content/catalog.ts` with all titles + 4 tracks; TMDB seed (runtimes, posters, providers)
- [ ] Landing (countdown, hero animation), track picker, track watchlist with ticks (guest + user)
- [ ] Where-to-watch per region with JustWatch attribution
- [ ] QuizEngine (sampler/grader/scorer) + title quiz + **Readiness Exam** + verdict page + weak spots
- [ ] 300+ reviewed questions (Speedrun + Essentials titles first)
- [ ] XP ledger, ranks, global leaderboard
- [ ] Ready Card OG image + share buttons (X, WhatsApp, copy link)
- [ ] PostHog funnel, Sentry
- **Launch Nov 10.** Post the build on X / LinkedIn (build-in-public thread with the design canvas).

## Sprint 2 · Nov 11 – Nov 20: social
- [ ] Squads (create, join via link, squad board)
- [ ] Daily Challenge + daily board
- [ ] Weekly board
- [ ] Streaks + first 15 achievements
- [ ] Question report flow + admin review queue
- [ ] 600+ reviewed questions

## Sprint 3 · Nov 21 – Dec 8: fun layer
- [ ] Build-my-track placement quiz
- [ ] Release vs chronological order toggle
- [ ] Order-the-events and poster-crop question types
- [ ] Page-turn route transitions, GSAP landing scroll set piece, confetti, rank-up reveal
- [ ] Sound effects (opt-in)
- [ ] Country board (if > 1k users)
- [ ] 800+ reviewed questions; calibrate difficulty from live stats

## Dec 9 – Dec 17: freeze, polish, push
- Only bug fixes, content and performance.
- Load test `answerQuestion` and `getLeaderboard` at 5× expected peak.
- "Final week cram" campaign: Speedrun-in-7-days challenge, squad invites.

## Dec 18 → after
- Countdown flips to **IN CINEMAS NOW**. Post-film spoiler-locked "Doomsday debrief" quiz unlocks Dec 22 (opt-in).
- Swap `EventConfig` to **Secret Wars Ready** (Dec 2027). Same engine, new tracks.
