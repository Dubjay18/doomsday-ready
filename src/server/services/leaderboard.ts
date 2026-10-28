import { and, desc, eq, gte, isNotNull, sql } from 'drizzle-orm'
import { rankFor } from '../../shared/game'
import { getDb } from '../db/client'
import { quizSessions, user, userStats, xpEvents } from '../db/schema'

export type Scope = 'global' | 'week' | 'daily'

export interface LbRow {
  position: number
  userId: string
  name: string
  value: number
  unit: 'XP' | 'pts'
  rank: string
  ready: boolean
  titlesWatched: number
  bestExamPct: number | null
  isMe: boolean
}

function weekStart() {
  const d = new Date()
  const day = (d.getUTCDay() + 6) % 7 // Monday = 0
  d.setUTCDate(d.getUTCDate() - day)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

/**
 * SQL-backed leaderboard (ADR-003 fallback path, used as the primary path in v1).
 * Guests (anonymous users) are excluded from public boards.
 */
export async function getLeaderboard(scope: Scope, meId: string | null, limit = 50) {
  const db = await getDb()
  const notAnon = sql`coalesce(${user.isAnonymous}, false) = false`

  let rows: { userId: string; name: string; value: number; totalXp: number | null; readyAt: Date | null; titlesWatched: number | null; bestExamPct: number | null }[]

  if (scope === 'global') {
    rows = await db
      .select({ userId: userStats.userId, name: user.name, value: userStats.totalXp, totalXp: userStats.totalXp, readyAt: userStats.readyAt, titlesWatched: userStats.titlesWatched, bestExamPct: userStats.bestExamPct })
      .from(userStats)
      .innerJoin(user, eq(user.id, userStats.userId))
      .where(and(notAnon, sql`${userStats.totalXp} > 0`))
      .orderBy(desc(userStats.totalXp))
      .limit(limit)
  } else if (scope === 'week') {
    const sum = sql<number>`sum(${xpEvents.amount})::int`
    rows = await db
      .select({ userId: xpEvents.userId, name: user.name, value: sum, totalXp: userStats.totalXp, readyAt: userStats.readyAt, titlesWatched: userStats.titlesWatched, bestExamPct: userStats.bestExamPct })
      .from(xpEvents)
      .innerJoin(user, eq(user.id, xpEvents.userId))
      .leftJoin(userStats, eq(userStats.userId, xpEvents.userId))
      .where(and(notAnon, gte(xpEvents.createdAt, weekStart())))
      .groupBy(xpEvents.userId, user.name, userStats.totalXp, userStats.readyAt, userStats.titlesWatched, userStats.bestExamPct)
      .orderBy(desc(sum))
      .limit(limit)
  } else {
    const key = new Date().toISOString().slice(0, 10)
    rows = await db
      .select({ userId: quizSessions.userId, name: user.name, value: quizSessions.score, totalXp: userStats.totalXp, readyAt: userStats.readyAt, titlesWatched: userStats.titlesWatched, bestExamPct: userStats.bestExamPct })
      .from(quizSessions)
      .innerJoin(user, eq(user.id, quizSessions.userId))
      .leftJoin(userStats, eq(userStats.userId, quizSessions.userId))
      .where(and(notAnon, eq(quizSessions.dailyKey, key), eq(quizSessions.status, 'finished'), isNotNull(quizSessions.dailyKey)))
      .orderBy(desc(quizSessions.score), quizSessions.finishedAt)
      .limit(limit)
  }

  const out: LbRow[] = rows.map((r, i) => ({
    position: i + 1,
    userId: r.userId,
    name: r.name,
    value: Number(r.value),
    unit: scope === 'daily' ? 'pts' : 'XP',
    rank: rankFor(r.totalXp ?? 0).name,
    ready: Boolean(r.readyAt),
    titlesWatched: r.titlesWatched ?? 0,
    bestExamPct: r.bestExamPct,
    isMe: r.userId === meId,
  }))

  let me: (LbRow & { guest: boolean }) | null = null
  if (meId && !out.some((r) => r.isMe) && scope === 'global') {
    const [s] = await db
      .select({ totalXp: userStats.totalXp, readyAt: userStats.readyAt, titlesWatched: userStats.titlesWatched, bestExamPct: userStats.bestExamPct, name: user.name, isAnonymous: user.isAnonymous })
      .from(userStats)
      .innerJoin(user, eq(user.id, userStats.userId))
      .where(eq(userStats.userId, meId))
    if (s) {
      const [{ ahead }] = await db
        .select({ ahead: sql<number>`count(*)::int` })
        .from(userStats)
        .innerJoin(user, eq(user.id, userStats.userId))
        .where(and(notAnon, sql`${userStats.totalXp} > ${s.totalXp}`))
      me = {
        position: ahead + 1,
        userId: meId,
        name: s.name,
        value: s.totalXp,
        unit: 'XP',
        rank: rankFor(s.totalXp).name,
        ready: Boolean(s.readyAt),
        titlesWatched: s.titlesWatched,
        bestExamPct: s.bestExamPct,
        isMe: true,
        guest: Boolean(s.isAnonymous),
      }
    }
  }
  return { scope, rows: out, me }
}
