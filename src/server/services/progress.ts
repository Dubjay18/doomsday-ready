import { and, eq, sql } from 'drizzle-orm'
import { TITLE_BY_ID } from '../../content/catalog'
import { DAILY_WATCH_XP_CAP, XP, rankFor } from '../../shared/game'
import { getDb } from '../db/client'
import { userProgress, userStats } from '../db/schema'
import { awardXp, ensureStats, getStats, watchAwardsToday } from './xp'

export async function getWatchedIds(userId: string): Promise<string[]> {
  const db = await getDb()
  const rows = await db.select({ id: userProgress.titleId }).from(userProgress).where(eq(userProgress.userId, userId))
  return rows.map((r) => r.id)
}

export async function setWatched(userId: string, titleId: string, watched: boolean) {
  const title = TITLE_BY_ID.get(titleId)
  if (!title) throw new Error('Unknown title')
  const db = await getDb()

  const result = await db.transaction(async (tx) => {
    await ensureStats(tx, userId)
    let xpDelta = 0
    let capped = false
    if (watched) {
      const ins = await tx.insert(userProgress).values({ userId, titleId }).onConflictDoNothing().returning()
      if (ins.length) {
        await tx.update(userStats).set({ titlesWatched: sql`${userStats.titlesWatched} + 1` }).where(eq(userStats.userId, userId))
        if ((await watchAwardsToday(tx, userId)) < DAILY_WATCH_XP_CAP) {
          const amount = title.kind === 'film' ? XP.watchFilm : title.kind === 'series' ? XP.watchSeries : XP.watchSpecial
          xpDelta = (await awardXp(tx, userId, 'WATCH_TITLE', `title:${titleId}`, amount)).amount
        } else capped = true
      }
    } else {
      // Unticking never removes XP: the ledger is append-only (ADR-003).
      const del = await tx.delete(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.titleId, titleId))).returning()
      if (del.length)
        await tx.update(userStats).set({ titlesWatched: sql`greatest(${userStats.titlesWatched} - 1, 0)` }).where(eq(userStats.userId, userId))
    }
    const stats = await getStats(tx, userId)
    return { xpDelta, capped, totalXp: stats?.totalXp ?? 0 }
  })

  return { ...result, rank: rankFor(result.totalXp).name, watchedIds: await getWatchedIds(userId) }
}

export async function setActiveTrack(userId: string, trackId: string) {
  const db = await getDb()
  await ensureStats(db, userId)
  await db.update(userStats).set({ activeTrack: trackId }).where(eq(userStats.userId, userId))
}
