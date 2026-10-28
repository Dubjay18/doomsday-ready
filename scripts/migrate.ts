/**
 * Apply SQL migrations in ./drizzle to the database in DATABASE_URL.
 * Usage: DATABASE_URL=postgres://… pnpm db:migrate
 * (Local dev without DATABASE_URL migrates the embedded PGlite automatically.)
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Nothing to migrate (PGlite migrates itself).')
  process.exit(1)
}
const client = postgres(url, { max: 1 })
await migrate(drizzle(client), { migrationsFolder: './drizzle' })
await client.end()
console.log('✓ migrations applied')
