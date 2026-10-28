import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { z } from 'zod'
import { btnClass, cn } from '../components/comic'
import { Icon } from '../components/Icon'
import { authClient } from '../lib/auth-client'
import { meQuery } from '../lib/queries'
import { ensureGuest } from '../server/fns'

export const Route = createFileRoute('/auth')({
  validateSearch: z.object({ mode: z.enum(['signin', 'signup']).default('signup').catch('signup') }),
  head: () => ({ meta: [{ title: 'Join the team · Doomsday Ready' }] }),
  component: AuthPage,
})

function AuthPage() {
  const { mode } = Route.useSearch()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: me } = useQuery(meQuery)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const isGuest = me?.user?.isAnonymous

  const done = async () => {
    await qc.invalidateQueries()
    navigate({ to: '/me' })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      // Make sure guest progress exists as an anonymous user, so sign-up links it.
      if (!me?.user) await ensureGuest()
      const res =
        mode === 'signup'
          ? await authClient.signUp.email({ name: name.trim(), email, password })
          : await authClient.signIn.email({ email, password })
      if (res.error) throw new Error(res.error.message ?? 'Something went wrong')
      await done()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const social = async (provider: 'google' | 'discord') => {
    if (!me?.user) await ensureGuest()
    await authClient.signIn.social({ provider, callbackURL: '/me' })
  }

  return (
    <main className="halftone min-h-[80vh]">
      <div className="mx-auto max-w-xl px-4 py-14">
        <div className="panel bg-paper p-7 shadow-[10px_10px_0_#111]">
          <div className="mb-5 flex border-4 border-ink" role="tablist">
            {(['signup', 'signin'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => navigate({ to: '/auth', search: { mode: m }, replace: true })}
                className={cn('font-display flex-1 py-2.5 text-2xl', mode === m ? 'bg-ink text-pow' : 'bg-paper text-ink')}
              >
                {m === 'signup' ? 'JOIN THE TEAM' : 'SIGN IN'}
              </button>
            ))}
          </div>

          <h1 className="font-display m-0 flex items-center gap-3 text-5xl">
            <Icon name={mode === 'signup' ? 'shieldCheck' : 'user'} size={44} /> {mode === 'signup' ? 'SUIT UP' : 'WELCOME BACK'}
          </h1>
          {isGuest && mode === 'signup' && (
            <p className="mt-2 flex items-center gap-2 border-[3px] border-ink bg-pow px-3 py-2 font-bold">
              <Icon name="star" size={18} /> Your guest progress ({me?.stats?.totalXp ?? 0} XP) comes with you.
            </p>
          )}

          <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
            {mode === 'signup' && (
              <Field label="Hero handle" icon="user">
                <input required minLength={2} maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. wakanda.dev" autoComplete="nickname" className={inputCls} />
              </Field>
            )}
            <Field label="Email" icon="globe">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} />
            </Field>
            <Field label="Password" icon="shield">
              <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={inputCls} />
            </Field>
            {error && (
              <p className="m-0 flex items-center gap-2 border-[3px] border-ink bg-hero-red px-3 py-2 font-bold text-paper" role="alert">
                <Icon name="alert" size={18} /> {error}
              </p>
            )}
            <button type="submit" disabled={busy} className={cn(btnClass('yellow', 'lg'), 'mt-1 w-full')}>
              <Icon name="bolt" size={28} fill="#111" strokeWidth={2} /> {busy ? 'ONE SEC…' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </form>

          {(me?.providers.google || me?.providers.discord) && (
            <div className="mt-5 flex flex-col gap-3">
              <div className="text-center text-sm font-black tracking-wider">OR</div>
              {me?.providers.google && (
                <button type="button" onClick={() => social('google')} className={btnClass('paper')}>
                  Continue with Google
                </button>
              )}
              {me?.providers.discord && (
                <button type="button" onClick={() => social('discord')} className={btnClass('paper')}>
                  Continue with Discord
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

const inputCls = 'w-full border-[3px] border-ink bg-white px-3 py-2.5 text-lg font-semibold'

function Field({ label, icon, children }: { label: string; icon: 'user' | 'globe' | 'shield'; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-black tracking-wider">
      <span className="flex items-center gap-1.5">
        <Icon name={icon} size={16} /> {label.toUpperCase()}
      </span>
      {children}
    </label>
  )
}
