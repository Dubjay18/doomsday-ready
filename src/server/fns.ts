/**
 * Server functions: the app's whole API surface.
 * Thin wrappers: resolve the user, validate input with Zod, call a service.
 * Handler bodies (and their server-only imports) are stripped from the client bundle.
 */
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { z } from 'zod'
import { TRACK_BY_ID } from '../content/catalog'
import { nextRank, rankFor } from '../shared/game'
import { enabledProviders } from './auth'
import { getDb } from './db/client'
import { getLeaderboard } from './services/leaderboard'
import { getNews } from './services/news'
import { getWatchedIds, setActiveTrack, setWatched } from './services/progress'
import { answerQuestion, getQuizResult, getQuizState, recentSessions, startQuiz, useLifeline } from './services/quiz/sessions'
import { getPosters, getWatchOptions } from './services/watch'
import { getStats } from './services/xp'
import { detectCountry, getSessionUser, requireUser } from './session'

/** Public origin of the site, used for absolute og:image URLs (social scrapers need absolute links). */
export const siteOriginFn = createServerFn({ method: 'GET' }).handler(async () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL.replace(/\/$/, '')
  const host = getRequestHeader('x-forwarded-host') ?? getRequestHeader('host') ?? 'localhost'
  const proto = getRequestHeader('x-forwarded-proto')?.split(',')[0] ?? (/^(localhost|127\.)/.test(host) ? 'http' : 'https')
  return `${proto}://${host.split(',')[0]}`
})

/* ── me ─────────────────────────────────────────────── */

export const getMe = createServerFn({ method: 'GET' }).handler(async () => {
  const u = await getSessionUser()
  const country = detectCountry()
  const providers = enabledProviders()
  if (!u) return { user: null, stats: null, watchedIds: [] as string[], country, providers }
  const db = await getDb()
  const s = await getStats(db, u.id)
  const totalXp = s?.totalXp ?? 0
  const next = nextRank(totalXp)
  return {
    user: { id: u.id, name: u.name, isAnonymous: u.isAnonymous, email: u.isAnonymous ? null : u.email },
    stats: {
      totalXp,
      rank: rankFor(totalXp).name,
      nextRank: next ? { name: next.name, minXp: next.minXp } : null,
      rankFloor: rankFor(totalXp).minXp,
      readyAt: s?.readyAt?.toISOString() ?? null,
      bestExamPct: s?.bestExamPct ?? null,
      titlesWatched: s?.titlesWatched ?? 0,
      activeTrack: s?.activeTrack ?? null,
    },
    watchedIds: await getWatchedIds(u.id),
    country,
    providers,
  }
})

/** Ensure a (guest) session exists. Called once on first visit. */
export const ensureGuest = createServerFn({ method: 'POST' }).handler(async () => {
  const u = await requireUser()
  return { id: u.id, name: u.name, isAnonymous: u.isAnonymous }
})

/* ── progress ───────────────────────────────────────── */

export const markWatched = createServerFn({ method: 'POST' })
  .validator(z.object({ titleId: z.string().min(1).max(80), watched: z.boolean() }))
  .handler(async ({ data }) => {
    const u = await requireUser()
    return setWatched(u.id, data.titleId, data.watched)
  })

export const chooseTrack = createServerFn({ method: 'POST' })
  .validator(z.object({ trackId: z.string() }))
  .handler(async ({ data }) => {
    if (!TRACK_BY_ID.has(data.trackId as never)) throw new Error('Unknown track')
    const u = await requireUser()
    await setActiveTrack(u.id, data.trackId)
    return { ok: true }
  })

/* ── quiz ───────────────────────────────────────────── */

export const startQuizFn = createServerFn({ method: 'POST' })
  .validator(z.object({ mode: z.enum(['exam', 'title', 'daily']), titleId: z.string().optional() }))
  .handler(async ({ data }) => {
    const u = await requireUser()
    return startQuiz(u.id, data.mode, data.titleId)
  })

const sessionInput = z.object({ sessionId: z.uuid() })

export const getQuizStateFn = createServerFn({ method: 'POST' }) // POST: serving a question has side effects (starts its clock)
  .validator(sessionInput)
  .handler(async ({ data }) => {
    const u = await requireUser()
    return getQuizState(u.id, data.sessionId)
  })

export const answerFn = createServerFn({ method: 'POST' })
  .validator(z.object({ sessionId: z.uuid(), index: z.number().int().min(0).max(50), choice: z.number().int().min(0).max(3).nullable() }))
  .handler(async ({ data }) => {
    const u = await requireUser()
    return answerQuestion(u.id, data.sessionId, data.index, data.choice)
  })

export const lifelineFn = createServerFn({ method: 'POST' })
  .validator(z.object({ sessionId: z.uuid(), index: z.number().int().min(0), kind: z.enum(['fifty', 'hint']) }))
  .handler(async ({ data }) => {
    const u = await requireUser()
    return useLifeline(u.id, data.sessionId, data.index, data.kind)
  })

export const getQuizResultFn = createServerFn({ method: 'GET' })
  .validator(sessionInput)
  .handler(async ({ data }) => {
    const u = await getSessionUser()
    if (!u) throw new Error('Not found')
    return getQuizResult(u.id, data.sessionId)
  })

export const recentQuizzesFn = createServerFn({ method: 'GET' }).handler(async () => {
  const u = await getSessionUser()
  return u ? recentSessions(u.id) : []
})

/* ── leaderboard ────────────────────────────────────── */

export const leaderboardFn = createServerFn({ method: 'GET' })
  .validator(z.object({ scope: z.enum(['global', 'week', 'daily']), limit: z.number().int().min(1).max(100).optional() }))
  .handler(async ({ data }) => {
    const u = await getSessionUser()
    return getLeaderboard(data.scope, u?.id ?? null, data.limit ?? 50)
  })

/* ── where to watch ─────────────────────────────────── */

export const watchOptionsFn = createServerFn({ method: 'GET' })
  .validator(z.object({ titleId: z.string(), region: z.string().regex(/^[A-Z]{2}$/).optional() }))
  .handler(async ({ data }) => getWatchOptions(data.titleId, data.region ?? detectCountry()))

/** How many questions each title has (so the UI can offer title quizzes without shipping the bank). */
export const questionCountsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { QUESTIONS } = await import('../content/questions')
  const counts: Record<string, number> = {}
  for (const q of QUESTIONS) counts[q.titleId] = (counts[q.titleId] ?? 0) + 1
  return { counts, total: QUESTIONS.length }
})

export const postersFn = createServerFn({ method: 'GET' })
  .validator(z.object({ ids: z.array(z.string()).max(80) }))
  .handler(async ({ data }) => getPosters(data.ids))

/* ── news ───────────────────────────────────────────── */

export const newsFn = createServerFn({ method: 'GET' })
  .validator(z.object({ limit: z.number().int().min(1).max(60).optional() }))
  .handler(async ({ data }) => getNews(data.limit ?? 24))


/* ── profile ────────────────────────────────────────── */

export const updateProfile = createServerFn({ method: 'POST' })
  .validator(z.object({ name: z.string().min(2).max(32).trim() }))
  .handler(async ({ data }) => {
    const u = await requireUser()
    const db = await getDb()
    const { user } = await import('../server/db/schema')
    const { eq } = await import('drizzle-orm')
    await db.update(user).set({ name: data.name, updatedAt: new Date() }).where(eq(user.id, u.id))
    return { ok: true, name: data.name }
  })
