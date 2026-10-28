import { and, desc, eq, inArray, sql } from 'drizzle-orm'
import { TITLE_BY_ID } from '../../../content/catalog'
import { QUESTIONS, QUESTION_BY_ID, questionsForTitle } from '../../../content/questions'
import type { Question } from '../../../content/questions'
import { DAILY_SIZE, EXAM_SIZE, GRACE_MS, TIME_LIMIT_MS, TITLE_QUIZ_SIZE, XP, rankFor, verdictFor } from '../../../shared/game'
import type { ClientQuestion, QuizMode, QuizResult, QuizState } from '../../../shared/quiz-types'
import { getDb } from '../../db/client'
import { questionExposures, quizAnswers, quizSessions, userStats, xpEvents } from '../../db/schema'
import type { QuizSessionRow } from '../../db/schema'
import { awardXp, ensureStats, getStats } from '../xp'
import type { DbOrTx } from '../xp'
import { fiftyFifty, grade, hashSeed, hintFor, sampleQuestions } from './engine'

export class QuizError extends Error {
  constructor(public code: 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST' | 'FINISHED', message: string) {
    super(message)
  }
}

const todayKey = () => new Date().toISOString().slice(0, 10)
const weightOf = (q: Question) => TITLE_BY_ID.get(q.titleId)?.weight ?? 0.5

function randomSeed() {
  const a = new Uint32Array(1)
  crypto.getRandomValues(a)
  return a[0] & 0x7fffffff
}

/* ─────────────────────────── start ─────────────────────────── */

export async function startQuiz(userId: string, mode: QuizMode, titleId?: string): Promise<{ sessionId: string }> {
  const db = await getDb()

  if (mode === 'daily') {
    const key = todayKey()
    const [existing] = await db
      .select({ id: quizSessions.id })
      .from(quizSessions)
      .where(and(eq(quizSessions.userId, userId), eq(quizSessions.dailyKey, key)))
    if (existing) return { sessionId: existing.id }
    const seed = hashSeed(`daily:${key}`) & 0x7fffffff
    const pool = QUESTIONS.filter((q) => q.spoiler < 2)
    const s = sampleQuestions(pool, { seed, n: DAILY_SIZE, mix: { easy: 2, medium: 2, hard: 1 }, perTitleCap: 1, weightOf })
    const [row] = await db
      .insert(quizSessions)
      .values({ userId, mode, seed, questionIds: s.questionIds, optionOrder: s.optionOrder, dailyKey: key })
      .onConflictDoNothing()
      .returning({ id: quizSessions.id })
    if (row) return { sessionId: row.id }
    const [again] = await db.select({ id: quizSessions.id }).from(quizSessions).where(and(eq(quizSessions.userId, userId), eq(quizSessions.dailyKey, key)))
    return { sessionId: again.id }
  }

  let pool: Question[]
  let n: number
  if (mode === 'title') {
    if (!titleId || !TITLE_BY_ID.has(titleId)) throw new QuizError('BAD_REQUEST', 'Unknown title')
    pool = questionsForTitle(titleId)
    if (pool.length === 0) throw new QuizError('BAD_REQUEST', 'No questions for this title yet')
    n = Math.min(TITLE_QUIZ_SIZE, pool.length)
  } else {
    pool = QUESTIONS
    n = EXAM_SIZE
  }

  const recent = await db
    .select({ id: questionExposures.questionId })
    .from(questionExposures)
    .where(eq(questionExposures.userId, userId))
    .orderBy(desc(questionExposures.lastSeenAt))
    .limit(60)

  const seed = randomSeed()
  const s = sampleQuestions(pool, {
    seed,
    n,
    mix: mode === 'exam' ? { easy: 6, medium: 9, hard: 5 } : undefined,
    perTitleCap: mode === 'exam' ? 2 : Infinity,
    weightOf,
    avoid: new Set(recent.map((r) => r.id)),
  })

  return db.transaction(async (tx) => {
    // One active session per mode (and per title for title quizzes): starting again abandons the old one.
    await tx
      .update(quizSessions)
      .set({ status: 'abandoned' })
      .where(and(eq(quizSessions.userId, userId), eq(quizSessions.mode, mode), eq(quizSessions.status, 'active')))
    const [row] = await tx
      .insert(quizSessions)
      .values({ userId, mode, titleId: titleId ?? null, seed, questionIds: s.questionIds, optionOrder: s.optionOrder })
      .returning({ id: quizSessions.id })
    return { sessionId: row.id }
  })
}

/* ─────────────────────────── state ─────────────────────────── */

async function loadOwned(db: DbOrTx, userId: string, sessionId: string, lock = false): Promise<QuizSessionRow> {
  const q = db.select().from(quizSessions).where(and(eq(quizSessions.id, sessionId), eq(quizSessions.userId, userId)))
  const [row] = lock ? await q.for('update') : await q
  if (!row) throw new QuizError('NOT_FOUND', 'Quiz not found')
  return row
}

function toClient(row: QuizSessionRow, index: number, servedAt: Date): ClientQuestion {
  const q = QUESTION_BY_ID.get(row.questionIds[index])!
  const title = TITLE_BY_ID.get(q.titleId)!
  const remainingMs = Math.max(0, TIME_LIMIT_MS - (Date.now() - servedAt.getTime()))
  const hidden = row.fiftyOn === index ? fiftyFifty(q, row.seed) : []
  return {
    index,
    prompt: q.prompt,
    source: title.name,
    difficulty: q.difficulty,
    options: row.optionOrder[index].map((orig) => ({ id: orig, label: q.options[orig], hidden: hidden.includes(orig) })),
    remainingMs,
    hint: row.hintOn === index ? hintFor(q) : null,
  }
}

/** Grade a question as a timeout if its clock ran out while the user was away. */
async function expireIfNeeded(tx: DbOrTx, row: QuizSessionRow): Promise<QuizSessionRow> {
  let cur = row
  while (cur.status === 'active' && cur.servedAt && Date.now() - cur.servedAt.getTime() > TIME_LIMIT_MS + GRACE_MS) {
    cur = await recordAnswer(tx, cur, null, Date.now() - cur.servedAt.getTime())
  }
  return cur
}

export async function getQuizState(userId: string, sessionId: string): Promise<QuizState> {
  const db = await getDb()
  return db.transaction(async (tx) => {
    let row = await loadOwned(tx, userId, sessionId, true)
    row = await expireIfNeeded(tx, row)
    const base = {
      sessionId: row.id,
      mode: row.mode,
      titleName: row.titleId ? (TITLE_BY_ID.get(row.titleId)?.name ?? null) : null,
      total: row.questionIds.length,
      cursor: row.cursor,
      score: row.score,
      combo: row.combo,
      correct: row.correct,
      lifelines: row.lifelines,
      status: row.status,
      timeLimitMs: TIME_LIMIT_MS,
    }
    if (row.status !== 'active') return { ...base, question: null }
    // Serve the current question (starts its clock) unless it's already being shown.
    let servedAt = row.servedAt
    if (!servedAt) {
      servedAt = new Date()
      await tx.update(quizSessions).set({ servedAt }).where(eq(quizSessions.id, row.id))
    }
    return { ...base, question: toClient(row, row.cursor, servedAt) }
  })
}

/* ─────────────────────────── answer ─────────────────────────── */

async function recordAnswer(tx: DbOrTx, row: QuizSessionRow, choice: number | null, elapsedMs: number): Promise<QuizSessionRow> {
  const q = QUESTION_BY_ID.get(row.questionIds[row.cursor])!
  const g = grade({
    question: q,
    choice,
    elapsedMs,
    combo: row.combo,
    usedFifty: row.fiftyOn === row.cursor,
    usedHint: row.hintOn === row.cursor,
  })
  // PK (session_id, index) makes a double submit impossible.
  const ins = await tx
    .insert(quizAnswers)
    .values({ sessionId: row.id, index: row.cursor, questionId: q.id, choice, correct: g.correct, elapsedMs, points: g.points })
    .onConflictDoNothing()
    .returning()
  if (!ins.length) throw new QuizError('CONFLICT', 'Already answered')

  await tx
    .insert(questionExposures)
    .values({ userId: row.userId, questionId: q.id })
    .onConflictDoUpdate({ target: [questionExposures.userId, questionExposures.questionId], set: { lastSeenAt: new Date() } })

  const nextCursor = row.cursor + 1
  const done = nextCursor >= row.questionIds.length
  const [updated] = await tx
    .update(quizSessions)
    .set({
      cursor: nextCursor,
      servedAt: null,
      correct: row.correct + (g.correct ? 1 : 0),
      score: row.score + g.points,
      combo: g.nextCombo,
      bestCombo: Math.max(row.bestCombo, g.nextCombo),
      status: done ? 'finished' : 'active',
      finishedAt: done ? new Date() : null,
    })
    .where(eq(quizSessions.id, row.id))
    .returning()
  if (done) await finalize(tx, updated)
  return updated
}

export async function answerQuestion(userId: string, sessionId: string, index: number, choice: number | null) {
  const db = await getDb()
  return db.transaction(async (tx) => {
    let row = await loadOwned(tx, userId, sessionId, true)
    row = await expireIfNeeded(tx, row)
    if (row.status !== 'active') throw new QuizError('FINISHED', 'This quiz is over')
    if (index !== row.cursor) throw new QuizError('CONFLICT', 'That question was already answered or timed out')
    if (!row.servedAt) throw new QuizError('CONFLICT', 'Question not served yet')
    if (choice !== null && (choice < 0 || choice > 3)) throw new QuizError('BAD_REQUEST', 'Invalid option')

    const q = QUESTION_BY_ID.get(row.questionIds[row.cursor])!
    const elapsed = Date.now() - row.servedAt.getTime()
    const before = row
    const after = await recordAnswer(tx, row, choice, elapsed)
    const correct = after.correct > before.correct
    return {
      correct,
      timedOut: !correct && (choice === null || elapsed > TIME_LIMIT_MS + GRACE_MS),
      correctOption: q.answer,
      explanation: q.explanation,
      points: after.score - before.score,
      score: after.score,
      combo: after.combo,
      finished: after.status === 'finished',
    }
  })
}

export async function useLifeline(userId: string, sessionId: string, index: number, kind: 'fifty' | 'hint'): Promise<{ hidden: number[]; hint: string | null }> {
  const db = await getDb()
  return db.transaction(async (tx) => {
    const row = await loadOwned(tx, userId, sessionId, true)
    if (row.status !== 'active' || index !== row.cursor || !row.servedAt) throw new QuizError('CONFLICT', 'Not the current question')
    if (!row.lifelines[kind]) throw new QuizError('CONFLICT', 'Lifeline already used')
    const q = QUESTION_BY_ID.get(row.questionIds[index])!
    await tx
      .update(quizSessions)
      .set({ lifelines: { ...row.lifelines, [kind]: false }, ...(kind === 'fifty' ? { fiftyOn: index } : { hintOn: index }) })
      .where(eq(quizSessions.id, row.id))
    return kind === 'fifty' ? { hidden: fiftyFifty(q, row.seed), hint: null } : { hidden: [], hint: hintFor(q) }
  })
}

/* ─────────────────────────── finish ─────────────────────────── */

async function finalize(tx: DbOrTx, row: QuizSessionRow) {
  const total = row.questionIds.length
  const v = verdictFor(row.correct, total)
  await ensureStats(tx, row.userId)
  await awardXp(tx, row.userId, 'QUIZ', `session:${row.id}`, Math.floor(row.score / 10))
  if (row.mode === 'exam') {
    await tx
      .update(userStats)
      .set({
        bestExamPct: sql`greatest(coalesce(${userStats.bestExamPct}, 0), ${v.pct})`,
        ...(v.ready ? { readyAt: sql`coalesce(${userStats.readyAt}, now())` } : {}),
      })
      .where(eq(userStats.userId, row.userId))
    if (v.ready) await awardXp(tx, row.userId, 'READY', 'ready', XP.ready)
    if (row.correct === total) await awardXp(tx, row.userId, 'FLAWLESS', 'flawless', XP.flawless)
  }
}

export async function getQuizResult(userId: string, sessionId: string): Promise<QuizResult> {
  const db = await getDb()
  const row = await loadOwned(db, userId, sessionId)
  if (row.status === 'active') throw new QuizError('CONFLICT', 'Quiz still in progress')
  const answers = await db.select().from(quizAnswers).where(eq(quizAnswers.sessionId, row.id)).orderBy(quizAnswers.index)
  const total = row.questionIds.length
  const v = verdictFor(row.correct, total)

  const review = row.questionIds.map((qid, i) => {
    const q = QUESTION_BY_ID.get(qid)!
    const a = answers.find((x) => x.index === i)
    return {
      prompt: q.prompt,
      source: TITLE_BY_ID.get(q.titleId)!.name,
      titleId: q.titleId,
      yourAnswer: a?.choice != null ? q.options[a.choice] : null,
      correctAnswer: q.options[q.answer],
      correct: a?.correct ?? false,
      explanation: q.explanation,
      points: a?.points ?? 0,
    }
  })

  const weak = new Map<string, number>()
  for (const r of review) if (!r.correct) weak.set(r.titleId, (weak.get(r.titleId) ?? 0) + 1)
  const weakSpots = [...weak.entries()]
    .map(([titleId, missed]) => ({ titleId, name: TITLE_BY_ID.get(titleId)!.name, missed, weight: TITLE_BY_ID.get(titleId)!.weight }))
    .sort((a, b) => b.weight - a.weight || b.missed - a.missed)
    .slice(0, 6)

  const stats = await getStats(db, userId)
  const [{ xp: sessionXp }] = await db
    .select({ xp: sql<number>`coalesce(sum(${xpEvents.amount}), 0)::int` })
    .from(xpEvents)
    .where(and(eq(xpEvents.userId, userId), eq(xpEvents.refKey, `session:${row.id}`)))
  const totalXp = stats?.totalXp ?? 0

  return {
    sessionId: row.id,
    mode: row.mode,
    titleName: row.titleId ? (TITLE_BY_ID.get(row.titleId)?.name ?? null) : null,
    total,
    correct: row.correct,
    score: row.score,
    bestCombo: row.bestCombo,
    ...v,
    countsForReady: row.mode === 'exam',
    sessionXp,
    totalXp,
    rank: rankFor(totalXp).name,
    readyAt: stats?.readyAt?.toISOString() ?? null,
    weakSpots,
    review,
  }
}

export async function recentSessions(userId: string) {
  const db = await getDb()
  return db
    .select({ id: quizSessions.id, mode: quizSessions.mode, titleId: quizSessions.titleId, correct: quizSessions.correct, status: quizSessions.status, total: sql<number>`jsonb_array_length(${quizSessions.questionIds})::int`, startedAt: quizSessions.startedAt, dailyKey: quizSessions.dailyKey })
    .from(quizSessions)
    .where(and(eq(quizSessions.userId, userId), inArray(quizSessions.status, ['active', 'finished'])))
    .orderBy(desc(quizSessions.startedAt))
    .limit(10)
}
