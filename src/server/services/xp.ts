import { and, eq, gte, sql } from 'drizzle-orm'
import type { Db } from '../db/client'
import { userStats, xpEvents } from '../db/schema'

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]
export type DbOrTx = Db | Tx

export async function ensureStats(db: DbOrTx, userId: string) {
  await db.insert(userStats).values({ userId }).onConflictDoNothing()
}

/**
 * Append to the XP ledger. Idempotent per (user, reason, refKey):
 * returns awarded=false if this exact award already happened.
 */
export async function awardXp(
  db: DbOrTx,
  userId: string,
  reason: (typeof xpEvents.$inferInsert)['reason'],
  refKey: string,
  amount: number,
): Promise<{ awarded: boolean; amount: number }> {
  if (amount <= 0) return { awarded: false, amount: 0 }
  const inserted = await db
    .insert(xpEvents)
    .values({ userId, reason, refKey, amount })
    .onConflictDoNothing()
    .returning({ id: xpEvents.id })
  if (inserted.length === 0) return { awarded: false, amount: 0 }
  await ensureStats(db, userId)
  await db
    .update(userStats)
    .set({ totalXp: sql`${userStats.totalXp} + ${amount}` })
    .where(eq(userStats.userId, userId))
  return { awarded: true, amount }
}

export async function watchAwardsToday(db: DbOrTx, userId: string) {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(xpEvents)
    .where(and(eq(xpEvents.userId, userId), eq(xpEvents.reason, 'WATCH_TITLE'), gte(xpEvents.createdAt, start)))
  return row?.n ?? 0
}

export async function getStats(db: DbOrTx, userId: string) {
  const [row] = await db.select().from(userStats).where(eq(userStats.userId, userId))
  return row ?? null
}
