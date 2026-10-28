/**
 * Integration tests: services against a real (in-memory) Postgres via PGlite.
 * They prove the guarantees the docs promise: idempotent XP, no double submits,
 * owner-only sessions, server-side timeouts, READY once, guest → account merge.
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { and, eq, sql } from 'drizzle-orm'

process.env.PGLITE_DIR = 'memory://'

const { getDb } = await import('../src/server/db/client')
const schema = await import('../src/server/db/schema')
const { setWatched } = await import('../src/server/services/progress')
const quiz = await import('../src/server/services/quiz/sessions')
const { mergeUserData } = await import('../src/server/services/merge')
const { getLeaderboard } = await import('../src/server/services/leaderboard')
const { QUESTION_BY_ID } = await import('../src/content/questions')

async function makeUser(id: string, anon = false) {
  const db = await getDb()
  await db.insert(schema.user).values({ id, name: id, email: `${id}@test.dev`, isAnonymous: anon }).onConflictDoNothing()
}

async function totalXp(userId: string) {
  const db = await getDb()
  const [row] = await db.select().from(schema.userStats).where(eq(schema.userStats.userId, userId))
  return row?.totalXp ?? 0
}

/** Answer the current question correctly (peeking at the server-side key, as only a test can). */
async function answerCurrent(userId: string, sessionId: string, correct = true) {
  const db = await getDb()
  const state = await quiz.getQuizState(userId, sessionId)
  const [row] = await db.select().from(schema.quizSessions).where(eq(schema.quizSessions.id, sessionId))
  const q = QUESTION_BY_ID.get(row.questionIds[state.cursor])!
  const choice = correct ? q.answer : (q.answer + 1) % 4
  return quiz.answerQuestion(userId, sessionId, state.cursor, choice)
}

beforeAll(async () => {
  await getDb()
  await makeUser('alice')
  await makeUser('bob')
  await makeUser('guest-1', true)
})

describe('progress & XP ledger', () => {
  it('ticking the same title twice awards XP once', async () => {
    await setWatched('alice', 'thunderbolts', true)
    await setWatched('alice', 'thunderbolts', true)
    expect(await totalXp('alice')).toBe(150)
  })

  it('10 concurrent ticks still produce exactly one ledger row', async () => {
    await Promise.all(Array.from({ length: 10 }, () => setWatched('bob', 'loki-s1', true)))
    const db = await getDb()
    const rows = await db.select().from(schema.xpEvents).where(and(eq(schema.xpEvents.userId, 'bob'), eq(schema.xpEvents.refKey, 'title:loki-s1')))
    expect(rows).toHaveLength(1)
    expect(await totalXp('bob')).toBe(250) // series
  })

  it('unticking keeps XP (append-only ledger) and re-ticking does not double it', async () => {
    await setWatched('alice', 'thunderbolts', false)
    await setWatched('alice', 'thunderbolts', true)
    expect(await totalXp('alice')).toBe(150)
  })
})

describe('quiz sessions', () => {
  it('never exposes the answer in the client payload', async () => {
    const { sessionId } = await quiz.startQuiz('alice', 'exam')
    const s = await quiz.getQuizState('alice', sessionId)
    expect(JSON.stringify(s)).not.toMatch(/"answer"|isCorrect|explanation/)
    expect(s.question?.options).toHaveLength(4)
  })

  it('rejects a double submit for the same question', async () => {
    const { sessionId } = await quiz.startQuiz('alice', 'title', 'avengers-endgame')
    const s = await quiz.getQuizState('alice', sessionId)
    await quiz.answerQuestion('alice', sessionId, s.cursor, 0)
    await expect(quiz.answerQuestion('alice', sessionId, s.cursor, 1)).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it("won't let one user read or answer another user's session", async () => {
    const { sessionId } = await quiz.startQuiz('alice', 'title', 'black-panther')
    await expect(quiz.getQuizState('bob', sessionId)).rejects.toMatchObject({ code: 'NOT_FOUND' })
    await expect(quiz.answerQuestion('bob', sessionId, 0, 0)).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('grades a question as a timeout when the server clock ran out', async () => {
    const { sessionId } = await quiz.startQuiz('bob', 'title', 'thor')
    await quiz.getQuizState('bob', sessionId) // serves Q1
    const db = await getDb()
    await db.update(schema.quizSessions).set({ servedAt: sql`now() - interval '60 seconds'` }).where(eq(schema.quizSessions.id, sessionId))
    const s = await quiz.getQuizState('bob', sessionId) // expired Q1 is graded, Q2 served
    expect(s.cursor).toBe(1)
    const [a] = await db.select().from(schema.quizAnswers).where(eq(schema.quizAnswers.sessionId, sessionId))
    expect(a.correct).toBe(false)
    expect(a.choice).toBeNull()
  })

  it('a perfect exam makes you READY and awards the READY bonus only once', async () => {
    for (let round = 0; round < 2; round++) {
      const { sessionId } = await quiz.startQuiz('bob', 'exam')
      for (let i = 0; i < 20; i++) await answerCurrent('bob', sessionId, true)
      const r = await quiz.getQuizResult('bob', sessionId)
      expect(r.ready).toBe(true)
      expect(r.pct).toBe(100)
    }
    const db = await getDb()
    const readyRows = await db.select().from(schema.xpEvents).where(and(eq(schema.xpEvents.userId, 'bob'), eq(schema.xpEvents.reason, 'READY')))
    expect(readyRows).toHaveLength(1)
  })

  it('15/20 is not READY; 16/20 is', async () => {
    await makeUser('carol')
    for (const [right, ready] of [
      [15, false],
      [16, true],
    ] as const) {
      const { sessionId } = await quiz.startQuiz('carol', 'exam')
      for (let i = 0; i < 20; i++) await answerCurrent('carol', sessionId, i < right)
      expect((await quiz.getQuizResult('carol', sessionId)).ready).toBe(ready)
    }
  })

  it('daily challenge: same questions for everyone, one attempt each', async () => {
    const a = await quiz.startQuiz('alice', 'daily')
    const b = await quiz.startQuiz('bob', 'daily')
    const again = await quiz.startQuiz('alice', 'daily')
    expect(again.sessionId).toBe(a.sessionId)
    const db = await getDb()
    const [sa] = await db.select().from(schema.quizSessions).where(eq(schema.quizSessions.id, a.sessionId))
    const [sb] = await db.select().from(schema.quizSessions).where(eq(schema.quizSessions.id, b.sessionId))
    expect(sa.questionIds).toEqual(sb.questionIds)
  })
})

describe('guest → account', () => {
  it('moves ticks and XP to the new account and hides guests from boards', async () => {
    await setWatched('guest-1', 'x-men', true)
    await setWatched('guest-1', 'x2', true)
    let lb = await getLeaderboard('global', null)
    expect(lb.rows.some((r) => r.userId === 'guest-1')).toBe(false)

    await makeUser('dave')
    await mergeUserData('guest-1', 'dave')
    expect(await totalXp('dave')).toBe(300)
    expect(await totalXp('guest-1')).toBe(0)
    lb = await getLeaderboard('global', 'dave')
    expect(lb.rows.find((r) => r.userId === 'dave')?.value).toBe(300)
  })
})
