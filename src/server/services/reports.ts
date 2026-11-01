import { and, eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { questionReports, quizSessions } from '../db/schema'
import { QuizError } from './quiz/sessions'

/** One report per user and question. The question id comes from the session, not the client. */
export async function reportQuestion(userId: string, sessionId: string, index: number, note?: string) {
  const db = await getDb()
  const [row] = await db
    .select()
    .from(quizSessions)
    .where(and(eq(quizSessions.id, sessionId), eq(quizSessions.userId, userId)))
  if (!row) throw new QuizError('NOT_FOUND', 'Quiz not found')
  const served = index < row.cursor || (index === row.cursor && row.servedAt != null)
  if (index < 0 || index >= row.questionIds.length || !served) {
    throw new QuizError('BAD_REQUEST', 'That question has not been served')
  }
  const clean = note?.trim() ?? ''
  if (clean.length > 280) throw new QuizError('BAD_REQUEST', 'Note is too long')
  await db
    .insert(questionReports)
    .values({
      userId,
      questionId: row.questionIds[index],
      sessionId: row.id,
      note: clean.length ? clean : null,
    })
    .onConflictDoNothing({ target: [questionReports.userId, questionReports.questionId] })
  return { ok: true as const }
}
