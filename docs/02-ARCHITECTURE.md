# 02 · Architecture

## 1. Shape of the system

One TanStack Start app, deployed once. No separate backend service: server functions and server routes run in the same Nitro server bundle as SSR.

```
                         ┌──────────────────────────────────────────────┐
  Browser (React 19)     │            TanStack Start app (Nitro)          │
 ┌───────────────────┐   │                                                │
 │ Routes (SSR+hydr) │──▶│  SSR / streaming  ──▶ route loaders            │
 │ TanStack Query    │   │                         │                      │
 │ Motion / GSAP     │◀──│  Server functions (createServerFn, RPC)        │
 │ localStorage      │   │     │  middleware: auth · rateLimit · log      │
 │ (guest progress)  │   │     ▼                                          │
 └───────────────────┘   │  Domain services (pure TS)                     │
          │              │   catalog · progress · quiz · xp · leaderboard │
          │              │     │            │             │               │
          │              │  Server routes: /api/auth/$  /api/og/$handle   │
          │              │                 /api/cron/*  /api/health       │
          │              └─────┼────────────┼─────────────┼───────────────┘
          │                    ▼            ▼             ▼
          │            ┌────────────┐ ┌───────────┐ ┌──────────────┐
          │            │ Postgres   │ │ Upstash   │ │ TMDB API     │
          │            │ (Neon) via │ │ Redis     │ │ metadata,    │
          │            │ Drizzle    │ │ ZSET + RL │ │ posters,     │
          │            └────────────┘ └───────────┘ │ providers    │
          │                                         └──────────────┘
          └──────────▶ image.tmdb.org (posters, direct from CDN)
```

**Why this shape:** you get a single deploy, a single language, and type safety from DB row → server function → component props. Server functions are plain RPC, so there's no REST layer to hand-maintain.

## 2. Layering rules

```
routes/ (UI + loaders)  →  server/fns/ (createServerFn wrappers: auth, validation)
                              →  server/services/ (pure domain logic, no framework imports)
                                    →  server/repos/ (Drizzle queries)  +  server/integrations/ (TMDB, Redis)
```

- `services/` never imports `@tanstack/*`. That keeps quiz grading and XP rules unit-testable in plain Vitest.
- `fns/` is the only place that reads the session. It hands `userId` down explicitly.
- Shared Zod schemas live in `src/shared/schemas/` and are imported by both the client forms and `.validator()`.
- Anything that must never reach the browser (answer keys, DB client, secrets) lives under `src/server/**`. Add a lint rule (`no-restricted-imports`) that bans importing `src/server/**` from `src/components/**`.

## 3. Folder structure

```
doomsday-ready/
├─ src/
│  ├─ routes/
│  │  ├─ __root.tsx                 # shell, fonts, <HalftoneDefs/>, nav, toasts, motion config
│  │  ├─ index.tsx                  # landing + countdown
│  │  ├─ tracks/
│  │  │  ├─ index.tsx               # pick your track
│  │  │  └─ $trackSlug.tsx          # watchlist for a track  (?filter=todo&order=release)
│  │  ├─ titles/$titleSlug.tsx      # title detail, where-to-watch, recap, title quiz CTA
│  │  ├─ quiz/
│  │  │  ├─ index.tsx               # quiz hub: exam, daily, title quizzes
│  │  │  ├─ $sessionId.tsx          # live quiz
│  │  │  └─ $sessionId.result.tsx   # verdict + weak spots
│  │  ├─ leaderboard.tsx            # ?scope=global|week|country|squad
│  │  ├─ squads/$code.tsx           # join / view squad
│  │  ├─ u/$handle.tsx              # public profile
│  │  ├─ me.tsx                     # settings, spoiler mode, country, sound
│  │  ├─ admin/…                    # questions, review queue, catalogue (role-gated)
│  │  └─ api/
│  │     ├─ auth/$.ts               # Better Auth handler
│  │     ├─ og/$handle.ts           # Ready Card PNG (satori + resvg)
│  │     ├─ cron/providers.ts       # nightly TMDB provider refresh
│  │     ├─ cron/weekly-reset.ts    # archive weekly board
│  │     └─ health.ts
│  ├─ components/
│  │  ├─ comic/                     # Panel, Burst, SpeechBubble, Halftone, Stamp, SfxText, InkButton
│  │  ├─ track/  title/  quiz/  leaderboard/  profile/
│  │  └─ motion/                    # presets.ts, useReducedMotionSafe, PageTransition
│  ├─ server/
│  │  ├─ fns/                       # catalog.fn.ts, progress.fn.ts, quiz.fn.ts, leaderboard.fn.ts, squad.fn.ts, me.fn.ts
│  │  ├─ middleware/                # auth.ts, rateLimit.ts, logging.ts
│  │  ├─ services/                  # quiz/ (sampler, grader, scorer), xp.ts, ranks.ts, readiness.ts, tracks.ts
│  │  ├─ repos/                     # *.repo.ts (Drizzle)
│  │  ├─ integrations/              # tmdb.ts, redis.ts, og.ts
│  │  ├─ db/                        # schema.ts, client.ts, migrations/
│  │  └─ auth.ts                    # Better Auth config
│  ├─ shared/
│  │  ├─ schemas/                   # zod: quiz.ts, progress.ts, profile.ts
│  │  ├─ constants.ts               # PASS_MARK=0.8, RELEASE_DATES, RANKS
│  │  └─ types.ts
│  ├─ lib/                          # queryKeys.ts, guestStore.ts, prng.ts, format.ts
│  ├─ styles/                       # app.css (tailwind v4 @theme tokens), halftone.css
│  └─ router.tsx
├─ content/
│  ├─ catalog.ts                    # titles, tracks, why-it-matters notes (typed)
│  └─ questions/*.ts                # question bank, one file per title
├─ scripts/
│  ├─ seed.ts                       # catalog + questions → DB, TMDB enrichment
│  ├─ validate-content.ts           # zod-check content, duplicate detection
│  └─ gen-questions.ts              # optional AI drafting → unreviewed queue
├─ tests/  (unit/, integration/, e2e/)
├─ drizzle.config.ts  vite.config.ts  .env.example
```

## 4. Routing and data loading

TanStack Router gives typed params and **typed search params**. Use them for filters so URLs are shareable:

```ts
// src/routes/tracks/$trackSlug.tsx
const search = z.object({
  filter: z.enum(['all', 'todo', 'done', 'series', 'films']).default('all'),
  order: z.enum(['release', 'chrono']).default('release'),
})

export const Route = createFileRoute('/tracks/$trackSlug')({
  validateSearch: search,
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(trackQuery(params.trackSlug)),
  component: TrackPage,
})
```

- Loaders call `queryClient.ensureQueryData` so SSR prefetches and the client hydrates without a second fetch.
- **Catalogue data** (titles, tracks) is near-static: `staleTime: Infinity` plus CDN caching on the server function (`Cache-Control: s-maxage=3600, stale-while-revalidate`).
- **User data** (ticks, XP) is fetched after hydration for guests, during SSR for signed-in users.

## 5. Key flows

### 5.1 Tick a title (optimistic)

```
Click "Mark as watched"
  │ useMutation.onMutate → update ['progress', track] cache, play stamp animation
  ▼
markWatched({ titleId, watched: true })      ← server fn (POST), authMiddleware, rateLimit 30/min
  │ progressService.setWatched(userId, titleId)
  │   INSERT … ON CONFLICT DO NOTHING (user_id, title_id)   ← idempotent
  │   if inserted → xpService.award(userId, 'WATCH_TITLE', titleId)   (ledger row, unique key)
  │   leaderboard.bump(userId, delta)   (Redis ZINCRBY global/week/country)
  ▼
returns { xpDelta, totalXp, rank, newAchievements[] }
  │ onSuccess → toast "+150 XP", achievement burst if any
  │ onError   → roll back cache, shake + "KRAK! couldn't save"
```

Guest: same UI, writes to `guestStore` (localStorage, versioned). On sign-in, `mergeGuestProgress()` replays ticks through the same service (XP is capped for merged ticks to stop farming via guest resets).

### 5.2 Quiz session (server is the source of truth)

```
startQuiz({ mode: 'exam' | 'title' | 'daily', titleId? })
  → sampler picks N question ids (seeded PRNG, stratified, exposure-aware)
  → INSERT quiz_session(id, user_id, mode, seed, question_ids[], option_orders, started_at, expires_at)
  → return first question WITHOUT answer key

answerQuestion({ sessionId, index, choice, clientElapsedMs })
  → load session FOR UPDATE; check owner, index === session.cursor, not expired
  → serverElapsed = now - question_served_at; reject if > limit + 3 s grace
  → grade, compute points (base + time bonus) × combo
  → INSERT quiz_answer; UPDATE session cursor/combo/score
  → return { correct, correctChoice, explanation, points, next question | null }

finishQuiz({ sessionId })   (also auto-called when cursor == N)
  → pct = correct / N; if mode = exam and pct ≥ 0.80 → set users.ready_at, award badge
  → xpService.award(...) once per session (unique key)
  → leaderboard bump; generate weak-spot report
```

Full detail in [04-QUIZ-ENGINE.md](04-QUIZ-ENGINE.md).

### 5.3 Leaderboard read

```
getLeaderboard({ scope, squadCode? })
  global/week/country → Redis ZREVRANGE lb:{scope} 0 99 WITHSCORES  + ZREVRANK for "you"
                        → hydrate handles/avatars from Postgres (single IN query, cached 60 s)
  squad               → Postgres: SELECT … FROM squad_members JOIN user_stats ORDER BY total_xp DESC
  Redis down          → fallback SQL on user_stats (indexed total_xp DESC), cached 30 s
```

## 6. Middleware

```ts
// src/server/middleware/auth.ts
export const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) throw new AppError('UNAUTHENTICATED')
  return next({ context: { userId: session.user.id, role: session.user.role } })
})

export const optionalAuth = …   // guests allowed, userId may be null
export const adminOnly = …      // role === 'admin'
```

`rateLimit` uses `@upstash/ratelimit` (sliding window) keyed by userId or IP. Limits: answer 2/s, tick 30/min, startQuiz 10/min, squad create 5/day.

## 7. Caching map

| Data | Where | TTL / invalidation |
|---|---|---|
| Catalogue (titles, tracks) | server fn response cache + Query `staleTime: ∞` | redeploy / admin edit busts tag |
| TMDB metadata | `titles` table columns (copied at seed) | nightly cron refresh |
| Watch providers | `title_providers` table (per region) | nightly cron; show "updated X ago" |
| Posters | image.tmdb.org CDN (`w342`, `w780`) | n/a |
| Leaderboard top 100 | Redis ZSET (live) + 15 s memo | live |
| Profile hydrate for boards | in-memory LRU 60 s | n/a |
| Ready Card PNG | `Cache-Control: public, max-age=300` keyed by `?v={readyVersion}` | new version on new score |

## 8. Auth

Better Auth with Drizzle adapter, mounted at `src/routes/api/auth/$.ts`. Providers: Google, Discord, email magic link (Resend). Session cookie is httpOnly, SameSite=Lax. Roles: `user | admin`. Guests get a signed anonymous id cookie (`dr_gid`) so daily-challenge attempts can still be one-per-person-ish.

## 9. Region awareness

- Country comes from the `x-vercel-ip-country` header (or `cf-ipcountry` on Cloudflare). The user can override it in `/me`.
- `RELEASE_DATES` in `shared/constants.ts` maps country → date (default `2026-12-18`). Some markets open a day or two earlier. Confirm closer to the date and update the constant.
- Watch providers are looked up per region. If the user's region has no data, fall back to `US` and label it.

## 10. Environment

```
DATABASE_URL=                 # Neon pooled connection string
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://doomsdayready.app
GOOGLE_CLIENT_ID= / GOOGLE_CLIENT_SECRET=
DISCORD_CLIENT_ID= / DISCORD_CLIENT_SECRET=
RESEND_API_KEY=
TMDB_READ_TOKEN=              # v4 read access token
CRON_SECRET=                  # checked by /api/cron/*
SENTRY_DSN=
VITE_POSTHOG_KEY=
```

## 11. Deployment

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact(), tailwindcss()],
})
```

- **Vercel** (recommended): push to GitHub → auto deploy. `vercel.json` crons: `0 3 * * *` → `/api/cron/providers`, `0 0 * * 1` → `/api/cron/weekly-reset`.
- **Neon** branch per preview deploy (Neon–Vercel integration). Drizzle migrations run in CI before promote.
- **Cloudflare Workers** alternative: swap `nitro()` for `@cloudflare/vite-plugin`, Neon over HTTP driver, Upstash REST (both already edge-safe). See ADR-001.

CI (GitHub Actions): `typecheck → lint → vitest → validate-content → drizzle migrate (preview) → playwright vs preview URL`.

## 12. Performance budget

- JS for landing ≤ 170 KB gz. Lazy-load GSAP and ScrollTrigger only on the landing route. Motion's `LazyMotion` + `domAnimation`.
- Fonts: Bangers + Archivo, `font-display: swap`, preload Bangers only.
- Halftone uses CSS `radial-gradient`, no images. Bursts are inline SVG.
- Posters: `loading="lazy"`, explicit width/height, TMDB `w342` on grids.
- Animate only `transform` and `opacity`. No layout thrash.

## 13. Observability

Sentry (server fns + client), PostHog events: `track_selected`, `title_ticked`, `quiz_started`, `quiz_finished{pct,mode}`, `ready_achieved`, `ready_card_shared{channel}`, `squad_created`, `squad_joined`. Structured logs from `loggingMiddleware` with request id.
