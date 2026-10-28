import { createFileRoute } from '@tanstack/react-router'
import { sql } from 'drizzle-orm'
import { getDb } from '../../server/db/client'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = await getDb()
          await db.execute(sql`select 1`)
          return Response.json({ status: 'ok', db: 'ok' })
        } catch (e) {
          return Response.json({ status: 'degraded', db: (e as Error).message }, { status: 503 })
        }
      },
    },
  },
})
