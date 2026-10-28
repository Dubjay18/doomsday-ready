import { getRequestHeader, getRequestHeaders } from '@tanstack/react-start/server'
import { getAuth } from './auth'

export interface SessionUser {
  id: string
  name: string
  email: string
  isAnonymous: boolean
}

function toHeaders(): Headers {
  const h = new Headers()
  const raw = getRequestHeaders() as unknown as Headers | Record<string, string>
  if (raw instanceof Headers) return raw
  for (const [k, v] of Object.entries(raw)) if (typeof v === 'string') h.set(k, v)
  return h
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const auth = await getAuth()
  const s = await auth.api.getSession({ headers: toHeaders() })
  if (!s) return null
  const u = s.user as typeof s.user & { isAnonymous?: boolean | null }
  return { id: u.id, name: u.name, email: u.email, isAnonymous: Boolean(u.isAnonymous) }
}

/**
 * Every visitor gets an identity. If there's no session yet, create an anonymous
 * (guest) one so ticks and quizzes are saved server-side from the first click.
 * Signing up later links the guest's data to the real account (see auth.ts).
 */
export async function requireUser(): Promise<SessionUser> {
  const existing = await getSessionUser()
  if (existing) return existing
  const auth = await getAuth()
  const res = await auth.api.signInAnonymous({ headers: toHeaders() })
  if (!res?.user) throw new Error('Could not start a guest session')
  const u = res.user as typeof res.user & { isAnonymous?: boolean | null }
  return { id: u.id, name: u.name, email: u.email, isAnonymous: true }
}

/** Best-effort country for leaderboards and where-to-watch. */
export function detectCountry(): string {
  const override = getRequestHeader('cookie')?.match(/(?:^|;\s*)dr_region=([A-Z]{2})/)?.[1]
  if (override) return override
  const geo = getRequestHeader('x-vercel-ip-country') ?? getRequestHeader('cf-ipcountry')
  if (geo && /^[A-Z]{2}$/.test(geo)) return geo
  const lang = getRequestHeader('accept-language')?.match(/[a-z]{2}-([A-Z]{2})/)?.[1]
  return lang ?? 'US'
}
