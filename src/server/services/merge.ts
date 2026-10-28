import { eq, sql } from 'drizzle-orm'
import { getDb } from '../db/client'
import { questionExposures, quizSessions, userProgress, userStats, xpEvents } from '../db/schema'

/**
 * Move everything a guest (anonymous user) earned onto their new account.
 * Idempotent: unique keys on progress and the XP ledger stop double counting
 * if the new account already had some of the same ticks.
 */
export async function mergeUserData(fromUserId: string, toUserId: string) {
  if (fromUserId === toUserId) return
  const db = await getDb()
  await db.transaction(async (tx) => {
    await tx.execute(sql`
      insert into user_progress (user_id, title_id, watched_at)
      select ${toUserId}, title_id, watched_at from user_progress where user_id = ${fromUserId}
      on conflict do nothing`)
    await tx.delete(userProgress).where(eq(userProgress.userId, fromUserId))

    await tx.execute(sql`
      insert into xp_events (user_id, reason, ref_key, amount, created_at)
      select ${toUserId}, reason, ref_key, amount, created_at from xp_events where user_id = ${fromUserId}
      on conflict do nothing`)
    await tx.delete(xpEvents).where(eq(xpEvents.userId, fromUserId))

    await tx.execute(sql`
      insert into question_exposures (user_id, question_id, last_seen_at)
      select ${toUserId}, question_id, last_seen_at from question_exposures where user_id = ${fromUserId}
      on conflict do nothing`)
    await tx.delete(questionExposures).where(eq(questionExposures.userId, fromUserId))

    // Daily sessions are unique per (user, day). Drop the guest's duplicate day if the account already played it.
    await tx.execute(sql`
      delete from quiz_sessions g where g.user_id = ${fromUserId} and g.daily_key is not null
        and exists (select 1 from quiz_sessions a where a.user_id = ${toUserId} and a.daily_key = g.daily_key)`)
    await tx.update(quizSessions).set({ userId: toUserId }).where(eq(quizSessions.userId, fromUserId))

    const from = await tx.select().from(userStats).where(eq(userStats.userId, fromUserId))
    await tx.delete(userStats).where(eq(userStats.userId, fromUserId))
    await recomputeStats(tx, toUserId, from[0])
  })
}

type Tx = Parameters<Parameters<Awaited<ReturnType<typeof getDb>>['transaction']>[0]>[0]

export async function recomputeStats(
  tx: Tx,
  userId: string,
  carry?: { readyAt: Date | null; bestExamPct: number | null; activeTrack: string | null; country: string | null },
) {
  const [{ total }] = (await tx
    .select({ total: sql<number>`coalesce(sum(${xpEvents.amount}), 0)::int` })
    .from(xpEvents)
    .where(eq(xpEvents.userId, userId))) as { total: number }[]
  const [{ watched }] = (await tx
    .select({ watched: sql<number>`count(*)::int` })
    .from(userProgress)
    .where(eq(userProgress.userId, userId))) as { watched: number }[]

  await tx
    .insert(userStats)
    .values({
      userId,
      totalXp: total,
      titlesWatched: watched,
      readyAt: carry?.readyAt ?? null,
      bestExamPct: carry?.bestExamPct ?? null,
      activeTrack: carry?.activeTrack ?? null,
      country: carry?.country ?? null,
    })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: {
        totalXp: total,
        titlesWatched: watched,
        readyAt: sql`coalesce(${userStats.readyAt}, ${carry?.readyAt ?? null})`,
        bestExamPct: sql`greatest(${userStats.bestExamPct}, ${carry?.bestExamPct ?? null})`,
        activeTrack: sql`coalesce(${userStats.activeTrack}, ${carry?.activeTrack ?? null})`,
        country: sql`coalesce(${userStats.country}, ${carry?.country ?? null})`,
      },
    })
}
