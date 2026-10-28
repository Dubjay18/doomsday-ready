import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { meQuery } from '../lib/queries'
import { Logo } from './comic'
import { Icon } from './Icon'
import type { IconName } from './Icon'

const NAV: { to: '/tracks' | '/phases' | '/news' | '/lore' | '/quiz' | '/leaderboard' | '/characters'; label: string; icon: IconName }[] = [
  { to: '/tracks', label: 'Tracks', icon: 'film' },
  { to: '/phases', label: 'Phases', icon: 'layers' },
  { to: '/news', label: 'News', icon: 'alert' },
  { to: '/characters', label: 'Characters', icon: 'users' },
  { to: '/lore', label: 'Lore', icon: 'bulb' },
  { to: '/quiz', label: 'Quiz', icon: 'bolt' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
]

export function Header() {
  const { data: me } = useQuery(meQuery)
  const signedIn = me?.user && !me.user.isAnonymous
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (r) => r.location.pathname })

  // Close the menu on navigation, and let Escape dismiss it.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const xp = me?.stats && (
    <Link to="/me" className="flex items-center gap-2 border-2 border-paper px-2.5 py-1 text-paper no-underline hover:bg-paper hover:text-ink">
      <Icon name="star" size={16} fill="#FFD23F" strokeWidth={2} className="text-pow" />
      <span>{me.stats.totalXp.toLocaleString()} XP</span>
      <span className="text-pow">· {me.stats.rank}</span>
    </Link>
  )
  const account = signedIn ? (
    <Link to="/me" className="flex items-center gap-1.5 bg-pow px-3 py-2 text-ink no-underline shadow-[4px_4px_0_#C8102E]">
      <Icon name="user" size={18} />
      <span className="max-w-[10rem] truncate">{me!.user!.name}</span>
    </Link>
  ) : (
    <Link to="/auth" className="flex items-center gap-1.5 border-[3px] border-paper bg-pow px-3 py-2 text-ink no-underline shadow-[4px_4px_0_#C8102E]">
      <Icon name="user" size={18} />
      Sign in
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 border-b-4 border-ink bg-ink pt-[env(safe-area-inset-top)] text-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 text-paper no-underline">
          <Logo />
          <span className="font-display text-[1.6rem] leading-none sm:text-[1.9rem]">
            DOOMSDAY<span className="text-pow"> READY</span>
          </span>
        </Link>

        <button
          type="button"
          className="flex h-11 w-11 flex-none items-center justify-center border-[3px] border-paper text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'x' : 'grid'} size={22} />
        </button>

        <nav aria-label="Primary" className="hidden flex-wrap items-center gap-x-5 gap-y-2 text-sm font-extrabold uppercase tracking-wide lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-1.5 text-paper no-underline hover:text-pow"
              activeProps={{ className: 'text-pow underline decoration-4 underline-offset-8' }}
            >
              <Icon name={n.icon} size={18} className="text-pow" />
              {n.label}
            </Link>
          ))}
          {xp}
          {account}
        </nav>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t-4 border-paper/20 px-4 pb-5 pt-2 lg:hidden">
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 p-0">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="flex min-h-12 items-center gap-2.5 text-base font-extrabold uppercase tracking-wide text-paper no-underline"
                  activeProps={{ className: 'text-pow' }}
                >
                  <Icon name={n.icon} size={20} className="text-pow" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-extrabold uppercase tracking-wide">
            {xp}
            {account}
          </div>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm">
        <span className="font-display flex items-center gap-2 text-2xl">
          <Logo size={30} /> DOOMSDAY READY
        </span>
        <p className="m-0">
          Built by <a href="https://jayfolio.dev" className="text-pow hover:underline" target="_blank" rel="noopener noreferrer">Jay</a>
        </p>
      </div>
    </footer>
  )
}
