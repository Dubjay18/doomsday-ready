# 03 · Data Model

## ERD

```
users ─┬─< user_progress >── titles ──< title_providers
       │                       │  │
       │                       │  └──< track_items >── tracks
       │                       │
       │                       └──< questions ──< question_options
       │                                 │
       ├─< quiz_sessions ──< quiz_answers┘
       │
       ├─< question_exposures (user_id, question_id, last_seen_at)
       ├─< xp_events            (append-only ledger)
       ├── user_stats           (1:1 rollup: total_xp, rank, ready_at, streak)
       ├─< user_achievements >── achievements
       └─< squad_members >── squads
   question_reports >── questions
```

## Drizzle schema (`src/server/db/schema.ts`)

```ts
import { sql } from 'drizzle-orm'
import { pgTable, pgEnum, text, integer, smallint, boolean, timestamp, jsonb,
         primaryKey, uniqueIndex, index, uuid, real } from 'drizzle-orm/pg-core'

// ── enums ──────────────────────────────────────────────
export const titleKind   = pgEnum('title_kind', ['film', 'series', 'special'])
export const universe    = pgEnum('universe', ['mcu', 'fox_xmen', 'sony_spider'])
export const priority    = pgEnum('priority', ['essential', 'recommended', 'optional'])
export const qType       = pgEnum('q_type', ['mcq', 'true_false', 'order', 'poster_crop'])
export const difficulty  = pgEnum('difficulty', ['easy', 'medium', 'hard'])
export const quizMode    = pgEnum('quiz_mode', ['exam', 'title', 'daily', 'placement', 'versus'])
export const xpReason    = pgEnum('xp_reason', ['WATCH_TITLE', 'QUIZ', 'STREAK', 'ACHIEVEMENT', 'READY', 'DAILY'])

// ── users (Better Auth owns user/session/account tables; we extend) ──
export const profiles = pgTable('profiles', {
  userId:      text('user_id').primaryKey(),               // = auth user.id
  handle:      text('handle').notNull(),
  avatar:      jsonb('avatar').$type<{ color: string; emblem: string; pattern: string }>(),
  country:     text('country').notNull().default('US'),    // ISO-3166 alpha-2
  spoilerSafe: boolean('spoiler_safe').notNull().default(true),
  soundOn:     boolean('sound_on').notNull().default(false),
  activeTrack: text('active_track'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('profiles_handle_lower').on(sql`lower(${t.handle})`)])

// ── catalogue ───────────────────────────────────────────
export const titles = pgTable('titles', {
  id:            text('id').primaryKey(),                  // slug: 'avengers-endgame'
  tmdbId:        integer('tmdb_id').notNull(),
  tmdbType:      text('tmdb_type').$type<'movie' | 'tv'>().notNull(),
  name:          text('name').notNull(),
  kind:          titleKind('kind').notNull(),
  universe:      universe('universe').notNull().default('mcu'),
  phase:         smallint('phase'),                        // 1..6, null for non-MCU
  releaseDate:   text('release_date').notNull(),           // ISO date
  chronoOrder:   integer('chrono_order'),                  // in-universe order
  runtimeMin:    integer('runtime_min').notNull(),          // total (series = all eps)
  episodeCount:  smallint('episode_count'),
  posterPath:    text('poster_path'),
  backdropPath:  text('backdrop_path'),
  whyItMatters:  text('why_it_matters').notNull(),
  recap:         text('recap'),
  doomsdayWeight: real('doomsday_weight').notNull().default(0.5), // 0..1, drives sampling
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
})

export const tracks = pgTable('tracks', {
  id:        text('id').primaryKey(),                      // 'speedrun' | 'essentials' | 'deep-dive' | 'multiverse'
  name:      text('name').notNull(),
  level:     text('level').notNull(),
  blurb:     text('blurb').notNull(),
  color:     text('color').notNull(),
  sortOrder: smallint('sort_order').notNull(),
})

export const trackItems = pgTable('track_items', {
  trackId:  text('track_id').references(() => tracks.id).notNull(),
  titleId:  text('title_id').references(() => titles.id).notNull(),
  position: smallint('position').notNull(),
  priority: priority('priority').notNull(),
}, (t) => [primaryKey({ columns: [t.trackId, t.titleId] })])

export const titleProviders = pgTable('title_providers', {
  titleId:    text('title_id').references(() => titles.id).notNull(),
  region:     text('region').notNull(),                    // 'NG', 'US', 'GB'…
  providerId: integer('provider_id').notNull(),
  name:       text('name').notNull(),
  logoPath:   text('logo_path'),
  type:       text('type').$type<'flatrate' | 'rent' | 'buy' | 'ads' | 'free'>().notNull(),
  link:       text('link').notNull(),                      // TMDB/JustWatch deep link
  fetchedAt:  timestamp('fetched_at').notNull(),
}, (t) => [primaryKey({ columns: [t.titleId, t.region, t.providerId, t.type] })])

// ── progress ────────────────────────────────────────────
export const userProgress = pgTable('user_progress', {
  userId:    text('user_id').notNull(),
  titleId:   text('title_id').references(() => titles.id).notNull(),
  episodesWatched: smallint('episodes_watched'),            // null for films
  watchedAt: timestamp('watched_at').defaultNow().notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.titleId] })])

// ── questions ───────────────────────────────────────────
export const questions = pgTable('questions', {
  id:         uuid('id').primaryKey().defaultRandom(),
  titleId:    text('title_id').references(() => titles.id).notNull(),
  type:       qType('type').notNull(),
  difficulty: difficulty('difficulty').notNull(),
  prompt:     text('prompt').notNull(),
  explanation: text('explanation').notNull(),
  mediaPath:  text('media_path'),                          // poster_crop: TMDB backdrop path + crop box in meta
  meta:       jsonb('meta'),
  spoilerLevel: smallint('spoiler_level').notNull().default(1), // 0 none … 3 ending
  reviewed:   boolean('reviewed').notNull().default(false),
  active:     boolean('active').notNull().default(true),
  timesShown: integer('times_shown').notNull().default(0),
  timesCorrect: integer('times_correct').notNull().default(0), // → empirical difficulty
  createdAt:  timestamp('created_at').defaultNow().notNull(),
}, (t) => [index('q_title_active').on(t.titleId, t.active, t.reviewed)])

export const questionOptions = pgTable('question_options', {
  id:         uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  label:      text('label').notNull(),
  isCorrect:  boolean('is_correct').notNull(),             // for 'order': correctPosition in meta
  position:   smallint('position').notNull(),
})

// ── quiz sessions ───────────────────────────────────────
export const quizSessions = pgTable('quiz_sessions', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      text('user_id'),                            // null = guest (guest id in guestId)
  guestId:     text('guest_id'),
  mode:        quizMode('mode').notNull(),
  titleId:     text('title_id'),
  seed:        integer('seed').notNull(),
  questionIds: uuid('question_ids').array().notNull(),
  optionOrder: jsonb('option_order').$type<string[][]>().notNull(), // shuffled option ids per question
  cursor:      smallint('cursor').notNull().default(0),
  servedAt:    timestamp('served_at').notNull(),           // when current question was served
  correct:     smallint('correct').notNull().default(0),
  score:       integer('score').notNull().default(0),
  combo:       smallint('combo').notNull().default(1),
  bestCombo:   smallint('best_combo').notNull().default(1),
  lifelines:   jsonb('lifelines').$type<{ fifty: boolean; hint: boolean }>().notNull(),
  status:      text('status').$type<'active' | 'finished' | 'expired' | 'abandoned'>().notNull(),
  startedAt:   timestamp('started_at').defaultNow().notNull(),
  finishedAt:  timestamp('finished_at'),
  dailyKey:    text('daily_key'),                          // '2026-11-03' for daily mode
}, (t) => [
  index('qs_user_mode').on(t.userId, t.mode, t.startedAt),
  uniqueIndex('qs_daily_once').on(t.userId, t.dailyKey),  // one daily attempt per user
])

export const quizAnswers = pgTable('quiz_answers', {
  sessionId:  uuid('session_id').references(() => quizSessions.id, { onDelete: 'cascade' }).notNull(),
  index:      smallint('index').notNull(),
  questionId: uuid('question_id').notNull(),
  choice:     jsonb('choice'),                             // option id | ordered ids | null (timeout)
  correct:    boolean('correct').notNull(),
  elapsedMs:  integer('elapsed_ms').notNull(),
  points:     integer('points').notNull(),
}, (t) => [primaryKey({ columns: [t.sessionId, t.index] })])   // makes double-submit impossible

export const questionExposures = pgTable('question_exposures', {
  userId:     text('user_id').notNull(),
  questionId: uuid('question_id').notNull(),
  lastSeenAt: timestamp('last_seen_at').notNull(),
  seenCount:  smallint('seen_count').notNull().default(1),
}, (t) => [primaryKey({ columns: [t.userId, t.questionId] })])

// ── XP & ranks ──────────────────────────────────────────
export const xpEvents = pgTable('xp_events', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    text('user_id').notNull(),
  reason:    xpReason('reason').notNull(),
  refKey:    text('ref_key').notNull(),                    // 'title:avengers-endgame' | 'session:<uuid>' | 'streak:2026-11-03'
  amount:    integer('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('xp_once').on(t.userId, t.reason, t.refKey)])  // idempotency

export const userStats = pgTable('user_stats', {
  userId:      text('user_id').primaryKey(),
  totalXp:     integer('total_xp').notNull().default(0),
  weekXp:      integer('week_xp').notNull().default(0),
  rank:        text('rank').notNull().default('civilian'),
  readyAt:     timestamp('ready_at'),
  bestExamPct: smallint('best_exam_pct'),
  streakDays:  smallint('streak_days').notNull().default(0),
  streakFreezes: smallint('streak_freezes').notNull().default(1),
  lastActiveDay: text('last_active_day'),
  titlesWatched: smallint('titles_watched').notNull().default(0),
}, (t) => [index('stats_xp').on(t.totalXp.desc()), index('stats_week').on(t.weekXp.desc())])

export const achievements = pgTable('achievements', {
  id: text('id').primaryKey(), name: text('name').notNull(), description: text('description').notNull(),
  icon: text('icon').notNull(), xp: integer('xp').notNull(), secret: boolean('secret').default(false),
})
export const userAchievements = pgTable('user_achievements', {
  userId: text('user_id').notNull(), achievementId: text('achievement_id').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.achievementId] })])

// ── squads ──────────────────────────────────────────────
export const squads = pgTable('squads', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),                   // 8-char base32, unguessable
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
export const squadMembers = pgTable('squad_members', {
  squadId: uuid('squad_id').references(() => squads.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (t) => [primaryKey({ columns: [t.squadId, t.userId] }), index('sm_user').on(t.userId)])

export const questionReports = pgTable('question_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').notNull(), userId: text('user_id'),
  reason: text('reason').$type<'wrong_answer' | 'spoiler' | 'typo' | 'other'>().notNull(),
  note: text('note'), resolved: boolean('resolved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

## Invariants the schema enforces

| Invariant | How |
|---|---|
| A title tick gives XP once | `xp_events` unique `(user_id, reason, ref_key)` + `ON CONFLICT DO NOTHING` |
| An answer can't be submitted twice | `quiz_answers` PK `(session_id, index)` |
| One daily challenge per user | `quiz_sessions` unique `(user_id, daily_key)` |
| Handles are unique, case-insensitive | unique index on `lower(handle)` |
| Leaderboard is rebuildable | Redis is a projection; `user_stats` is rebuilt from `xp_events` by `scripts/rebuild-stats.ts` |

## Redis keys

```
lb:global               ZSET userId → total_xp
lb:week:{isoWeek}       ZSET userId → week_xp       (EXPIRE 14d)
lb:country:{CC}         ZSET userId → total_xp
lb:daily:{yyyy-mm-dd}   ZSET userId → daily score   (EXPIRE 3d)
rl:{fn}:{id}            ratelimit buckets (managed by @upstash/ratelimit)
```
