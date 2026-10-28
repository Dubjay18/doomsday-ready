# 07 · API Surface

Everything is a **server function** (`createServerFn`), called like a typed async function from loaders and components, except the few things that need a raw URL (auth callbacks, OG images, cron), which are **server routes**.

Conventions:
- Inputs validated with Zod via `.validator(schema)`. Schemas live in `src/shared/schemas`.
- Errors thrown as `AppError(code)` → mapped to `{ code, message }`. Codes: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `EXPIRED`, `VALIDATION`.
- `GET` for reads (cacheable), `POST` for writes.

## Example

```ts
// src/server/fns/progress.fn.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '../middleware/auth'
import { rateLimit } from '../middleware/rateLimit'
import { progressService } from '../services/progress'

export const markWatched = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, rateLimit('tick', 30, '1 m')])
  .validator(z.object({ titleId: z.string().min(1), watched: z.boolean() }))
  .handler(async ({ data, context }) =>
    progressService.setWatched(context.userId, data.titleId, data.watched))

// usage in a component
const tick = useMutation({ mutationFn: (v: Vars) => markWatched({ data: v }), onMutate: optimisticTick })
```

## Server functions

### Catalogue (public, cached)
| Fn | Method | Input | Output |
|---|---|---|---|
| `listTracks` | GET | — | `Track[]` with `titleCount`, `totalMinutes` |
| `getTrack` | GET | `{ slug }` | `{ track, items: TitleCard[] }` |
| `getTitle` | GET | `{ slug }` | `TitleDetail` (incl. recap, connections) |
| `getProviders` | GET | `{ titleId, region }` | `{ region, stream[], rent[], buy[], fetchedAt, attribution: 'JustWatch' }` |
| `getReleaseInfo` | GET | `{ region? }` | `{ releaseAt: ISO, region }` |

### Progress (auth)
| Fn | Input | Output |
|---|---|---|
| `getMyProgress` | `{ trackSlug? }` | `{ watched: string[], episodes: Record<string, number>, pct }` |
| `markWatched` | `{ titleId, watched }` | `{ xpDelta, totalXp, rank, newAchievements[] }` |
| `setEpisodes` | `{ titleId, episodesWatched }` | same as above (title completes at 100%) |
| `mergeGuestProgress` | `{ guestBlob }` (versioned schema) | `{ mergedTitles, xpAwarded }` |
| `buildCustomTrack` | `{ seenTitleIds[], placementSessionId? }` | `{ items: TitleCard[] }` |

### Quiz (optionalAuth; guests allowed except exam leaderboard credit)
| Fn | Input | Output |
|---|---|---|
| `startQuiz` | `{ mode, titleId? }` | `{ sessionId, total, timeLimitMs, question: ClientQuestion }` |
| `answerQuestion` | `{ sessionId, index, choice }` | `{ correct, correctChoice, explanation, points, combo, score, next?: ClientQuestion }` |
| `useLifeline` | `{ sessionId, index, kind: 'fifty'|'hint' }` | `{ removeOptionIds?: string[], hint?: string }` |
| `finishQuiz` | `{ sessionId }` | `QuizResult { correct, total, pct, ready, xpAwarded, weakSpots[], rank }` |
| `getQuizResult` | `{ sessionId }` | `QuizResult` (owner-only) |
| `reportQuestion` | `{ questionId, reason, note? }` | `{ ok }` |

```ts
type ClientQuestion = {
  index: number
  type: 'mcq' | 'true_false' | 'order' | 'poster_crop'
  prompt: string
  source: string                 // title name shown as "FROM: LOKI"
  media?: { src: string; crop: [x: number, y: number, w: number, h: number] }
  options: { id: string; label: string }[]   // already shuffled; NO isCorrect
}
```

### Leaderboard and social
| Fn | Input | Output |
|---|---|---|
| `getLeaderboard` | `{ scope: 'global'|'week'|'country'|'daily', country?, limit≤100 }` | `{ rows: LbRow[], me?: LbRow }` |
| `createSquad` | `{ name }` | `{ code, url }` |
| `joinSquad` | `{ code }` | `{ squadId }` |
| `getSquad` | `{ code }` | `{ name, members: LbRow[] }` (members only) |
| `leaveSquad` | `{ squadId }` | `{ ok }` |
| `getProfile` | `{ handle }` | public profile + achievements + ready status |

### Me
| Fn | Input | Output |
|---|---|---|
| `getMe` | — | profile + stats |
| `updateMe` | `{ handle?, avatar?, country?, spoilerSafe?, soundOn? }` | profile |

### Admin (`adminOnly`)
`listQuestions`, `upsertQuestion`, `reviewQuestion({id, action})`, `resolveReport`, `upsertTitle`, `setFlag`.

## Server routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/$` | GET/POST | Better Auth handler (`auth.handler(request)`) |
| `/api/og/$handle` | GET | Ready Card PNG 1200×630 (satori → resvg). Query `?v=` for cache busting |
| `/api/cron/providers` | POST | refresh TMDB watch providers (Bearer `CRON_SECRET`) |
| `/api/cron/weekly-reset` | POST | snapshot week board → `weekly_winners`, zero `week_xp` |
| `/api/cron/expire-sessions` | POST | mark stale `active` sessions `expired` |
| `/api/health` | GET | db + redis ping |

```ts
// src/routes/api/og/$handle.ts
export const Route = createFileRoute('/api/og/$handle')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const card = await readyCardService.forHandle(params.handle)
        if (!card) return new Response('Not found', { status: 404 })
        const png = await renderReadyCard(card)      // satori JSX → SVG → resvg PNG
        return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300' } })
      },
    },
  },
})
```

## Query keys (`src/lib/queryKeys.ts`)

```ts
export const qk = {
  tracks: ['tracks'] as const,
  track: (slug: string) => ['track', slug] as const,
  title: (slug: string) => ['title', slug] as const,
  providers: (id: string, region: string) => ['providers', id, region] as const,
  progress: (track?: string) => ['progress', track ?? 'all'] as const,
  me: ['me'] as const,
  lb: (scope: string, extra?: string) => ['lb', scope, extra] as const,
}
```
