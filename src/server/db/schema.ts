import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

/* ──────────────────────────────────────────────────────────────
 * Better Auth tables (user, session, account, verification)
 * Field names follow Better Auth's core schema + anonymous plugin.
 * ────────────────────────────────────────────────────────────── */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/* ──────────────────────────────────────────────────────────────
 * App tables. Catalogue + question bank live in code (src/content),
 * so the DB only holds user state.
 * ────────────────────────────────────────────────────────────── */

export const userProgress = pgTable(
  'user_progress',
  {
    userId: text('user_id').notNull(),
    titleId: text('title_id').notNull(),
    watchedAt: timestamp('watched_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.titleId] })],
)

export const quizSessions = pgTable(
  'quiz_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    mode: text('mode').$type<'exam' | 'title' | 'daily'>().notNull(),
    titleId: text('title_id'),
    seed: integer('seed').notNull(),
    questionIds: jsonb('question_ids').$type<string[]>().notNull(),
    optionOrder: jsonb('option_order').$type<number[][]>().notNull(),
    cursor: smallint('cursor').notNull().default(0),
    /** When the current question was revealed. null = answered, next not yet served. */
    servedAt: timestamp('served_at'),
    correct: smallint('correct').notNull().default(0),
    score: integer('score').notNull().default(0),
    combo: smallint('combo').notNull().default(1),
    bestCombo: smallint('best_combo').notNull().default(1),
    lifelines: jsonb('lifelines')
      .$type<{ fifty: boolean; hint: boolean }>()
      .notNull()
      .default({ fifty: true, hint: true }),
    fiftyOn: smallint('fifty_on'), // index of question where 50/50 was used
    hintOn: smallint('hint_on'),
    status: text('status')
      .$type<'active' | 'finished' | 'abandoned'>()
      .notNull()
      .default('active'),
    dailyKey: text('daily_key'),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    finishedAt: timestamp('finished_at'),
  },
  (t) => [
    index('qs_user_mode').on(t.userId, t.mode),
    uniqueIndex('qs_daily_once').on(t.userId, t.dailyKey),
  ],
)

export const quizAnswers = pgTable(
  'quiz_answers',
  {
    sessionId: uuid('session_id')
      .notNull()
      .references(() => quizSessions.id, { onDelete: 'cascade' }),
    index: smallint('index').notNull(),
    questionId: text('question_id').notNull(),
    choice: smallint('choice'), // original option index; null = timeout
    correct: boolean('correct').notNull(),
    elapsedMs: integer('elapsed_ms').notNull(),
    points: integer('points').notNull(),
  },
  (t) => [primaryKey({ columns: [t.sessionId, t.index] })],
)

export const questionExposures = pgTable(
  'question_exposures',
  {
    userId: text('user_id').notNull(),
    questionId: text('question_id').notNull(),
    lastSeenAt: timestamp('last_seen_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] })],
)

export const xpEvents = pgTable(
  'xp_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    reason: text('reason')
      .$type<'WATCH_TITLE' | 'QUIZ' | 'READY' | 'FLAWLESS' | 'DAILY'>()
      .notNull(),
    refKey: text('ref_key').notNull(),
    amount: integer('amount').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('xp_once').on(t.userId, t.reason, t.refKey),
    index('xp_created').on(t.createdAt),
  ],
)

export const userStats = pgTable(
  'user_stats',
  {
    userId: text('user_id').primaryKey(),
    totalXp: integer('total_xp').notNull().default(0),
    readyAt: timestamp('ready_at'),
    bestExamPct: smallint('best_exam_pct'),
    titlesWatched: smallint('titles_watched').notNull().default(0),
    activeTrack: text('active_track'),
    country: text('country'),
  },
  (t) => [index('stats_xp').on(sql`${t.totalXp} desc`)],
)

export type QuizSessionRow = typeof quizSessions.$inferSelect
