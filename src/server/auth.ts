import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { anonymous } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { getDb } from './db/client'
import * as schema from './db/schema'
import { mergeUserData } from './services/merge'

const HERO_PREFIX = ['Agent', 'Recruit', 'Variant', 'Rookie', 'Cadet']

function buildAuth(db: Awaited<ReturnType<typeof getDb>>) {
  const google =
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }
      : undefined
  const discord =
    process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? { clientId: process.env.DISCORD_CLIENT_ID, clientSecret: process.env.DISCORD_CLIENT_SECRET }
      : undefined

  return betterAuth({
    // Unset = inferred from the request (works on localhost and preview URLs). Set it in production.
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET ?? 'dev-only-secret-change-me-dev-only-secret',
    database: drizzleAdapter(db, { provider: 'pg', schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    socialProviders: { ...(google && { google }), ...(discord && { discord }) },
    session: { expiresIn: 60 * 60 * 24 * 60 }, // 60 days, the campaign runs ~8 weeks
    plugins: [
      anonymous({
        generateName: () =>
          `${HERO_PREFIX[Math.floor(Math.random() * HERO_PREFIX.length)]}-${Math.floor(1000 + Math.random() * 9000)}`,
        // Guest progress (ticks, XP, quiz history) follows the user when they sign up.
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          await mergeUserData(anonymousUser.user.id, newUser.user.id)
        },
      }),
      tanstackStartCookies(), // must stay last
    ],
  })
}

type Auth = ReturnType<typeof buildAuth>
let authPromise: Promise<Auth> | undefined

export function getAuth(): Promise<Auth> {
  authPromise ??= getDb().then(buildAuth)
  return authPromise
}

export function enabledProviders() {
  return {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    discord: Boolean(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET),
  }
}
