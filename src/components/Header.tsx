import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { meQuery } from '../lib/queries'
import { Logo } from './comic'
import { Icon } from './Icon'
import type { IconName } from './Icon'

const NAV: { to: '/tracks' | '/phases' | '/news' | '/lore' | '/quiz' | '/leaderboard'; label: string; icon: IconName }[] = [
  { to: '/tracks', label: 'Tracks', icon: 'film' },
  { to: '/phases', label: 'Phases', icon: 'layers' },
  { to: '/news', label: 'News', icon: 'alert' },
  { to: '/lore', label: 'Lore', icon: 'bulb' },
  { to: '/quiz', label: 'Quiz', icon: 'bolt' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
]

export function Header() {
  const { data: me } = useQuery(meQuery)
  const signedIn = me?.user && !me.user.isAnonymous

  return (
    <header className="sticky top-0 z-40 border-b-4 border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5 text-paper no-underline">
          <Logo />
          <span className="font-display text-[1.9rem] leading-none">
            DOOMSDAY<span className="text-pow"> READY</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-extrabold uppercase tracking-wide">
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
          {me?.stats && (
            <Link to="/me" className="flex items-center gap-2 border-2 border-paper px-2.5 py-1 text-paper no-underline hover:bg-paper hover:text-ink">
              <Icon name="star" size={16} fill="#FFD23F" strokeWidth={2} className="text-pow" />
              <span>{me.stats.totalXp.toLocaleString()} XP</span>
              <span className="hidden text-pow sm:inline">· {me.stats.rank}</span>
            </Link>
          )}
          {signedIn ? (
            <Link to="/me" className="flex items-center gap-1.5 bg-pow px-3 py-2 text-ink no-underline shadow-[4px_4px_0_#C8102E]">
              <Icon name="user" size={18} />
              {me!.user!.name}
            </Link>
          ) : (
            <Link to="/auth" className="flex items-center gap-1.5 border-[3px] border-paper bg-pow px-3 py-2 text-ink no-underline shadow-[4px_4px_0_#C8102E]">
              <Icon name="user" size={18} />
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm">
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
