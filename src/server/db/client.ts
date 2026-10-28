import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import * as schema from './schema'

/**
 * One Drizzle handle for the whole server.
 *
 * - DATABASE_URL set  → real Postgres (Neon, Supabase, local) via postgres-js.
 *                       Run `pnpm db:migrate` before deploying.
 * - DATABASE_URL unset → embedded PGlite stored in ./.data/pglite, auto-migrated
 *                       on first use. Zero-setup local dev.
 */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>

let dbPromise: Promise<Db> | undefined

async function create(): Promise<Db> {
  const url = process.env.DATABASE_URL
  if (url) {
    const { drizzle } = await import('drizzle-orm/postgres-js')
    const postgres = (await import('postgres')).default
    const client = postgres(url, { max: 5, prepare: false })
    return drizzle(client, { schema }) as unknown as Db
  }

  const { PGlite } = await import('@electric-sql/pglite')
  const { drizzle } = await import('drizzle-orm/pglite')
  const { migrate } = await import('drizzle-orm/pglite/migrator')
  const { mkdirSync } = await import('node:fs')
  const path = await import('node:path')
  // PGLITE_DIR=memory:// gives a throwaway in-memory DB (used by the integration tests).
  const target = process.env.PGLITE_DIR ?? path.resolve(process.cwd(), '.data/pglite')
  if (!target.startsWith('memory://')) mkdirSync(target, { recursive: true })
  const client = new PGlite(target)
  const db = drizzle(client, { schema })
  await migrate(db, { migrationsFolder: path.resolve(process.cwd(), 'drizzle') })
  return db as unknown as Db
}

export function getDb(): Promise<Db> {
  dbPromise ??= create().catch((err) => {
    dbPromise = undefined
    throw err
  })
  return dbPromise
}
