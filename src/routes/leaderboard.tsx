import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { z } from 'zod'
import { cn } from '../components/comic'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'
import { leaderboardQuery } from '../lib/queries'
import { RANKS } from '../shared/game'

const search = z.object({ scope: z.enum(['global', 'week', 'daily']).default('global').catch('global') })

export const Route = createFileRoute('/leaderboard')({
  validateSearch: search,
  loaderDeps: ({ search: s }) => ({ scope: s.scope }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(leaderboardQuery(deps.scope)),
  head: () => ({ meta: [{ title: 'Hall of Heroes · Doomsday Ready' }] }),
  component: Leaderboard,
})

const TABS: { id: 'global' | 'week' | 'daily'; label: string; icon: IconName }[] = [
  { id: 'global', label: 'ALL-TIME', icon: 'globe' },
  { id: 'week', label: 'THIS WEEK', icon: 'calendar' },
  { id: 'daily', label: 'TODAY’S CHALLENGE', icon: 'flame' },
]

const LADDER_ICON: Record<string, IconName> = {
  civilian: 'user',
  recruit: 'target',
  agent: 'compass',
  avenger: 'shield',
  'founding-member': 'star',
  'multiverse-legend': 'rings',
}

const PODIUM = [
  { idx: 1, h: 'h-[110px]', color: '#4FC3F7' },
  { idx: 0, h: 'h-[150px]', color: '#FFD23F' },
  { idx: 2, h: 'h-[80px]', color: '#FF8A3D' },
]

function Leaderboard() {
  const { scope } = Route.useSearch()
  const { data } = useQuery(leaderboardQuery(scope))
  const rows = data?.rows ?? []

  return (
    <main className="halftone">
      <section className="halftone-light border-b-4 border-ink bg-[#6A1B9A]">
        <div className="mx-auto max-w-7xl px-4 pt-10">
          <h1 className="font-display ink-stroke m-0 flex flex-wrap items-center gap-x-4 text-[clamp(40px,11vw,96px)] leading-[1.05] text-paper" style={{ textShadow: '5px 5px 0 #111', WebkitTextStroke: '2px #111' }}>
            <Icon name="trophy" size={64} fill="#FFD23F" strokeWidth={1.8} className="anim-float text-ink" /> HALL OF HEROES
          </h1>
          <div role="tablist" aria-label="Leaderboard scope" className="mt-4 flex flex-wrap gap-2.5">
            {TABS.map((t) => (
              <Link
                key={t.id}
                role="tab"
                aria-selected={scope === t.id}
                to="/leaderboard"
                search={{ scope: t.id }}
                className={cn('flex items-center gap-2 border-[3px] border-ink px-4 py-2.5 text-sm font-black tracking-wide text-ink no-underline', scope === t.id ? 'bg-pow' : 'bg-paper')}
              >
                <Icon name={t.icon} size={18} strokeWidth={2.6} /> {t.label}
              </Link>
            ))}
          </div>
          <div className="mt-7 flex items-end justify-center gap-2 sm:mt-9 sm:gap-4">
            {PODIUM.map((p) => {
              const r = rows[p.idx]
              return (
                <motion.div key={p.idx} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * p.idx, type: 'spring', stiffness: 200, damping: 16 }} className="flex min-w-0 max-w-[190px] flex-1 flex-col items-center">
                  {p.idx === 0 && <Icon name="crown" size={36} fill="#FFD23F" strokeWidth={1.8} className="-mb-1.5" />}
                  <div className="anim-float font-display flex h-14 w-14 items-center justify-center rounded-full border-4 border-ink text-3xl sm:h-20 sm:w-20 sm:text-4xl" style={{ background: r ? p.color : '#ddd' }}>
                    {r ? r.name[0]?.toUpperCase() : '?'}
                  </div>
                  <div className="mt-2 max-w-full truncate text-sm font-black text-paper sm:text-base">{r?.name ?? 'Unclaimed'}</div>
                  <div className="font-display text-lg text-pow sm:text-2xl">{r ? `${r.value.toLocaleString()} ${r.unit}` : '—'}</div>
                  <div className={cn('font-display mt-2.5 flex w-full items-start justify-center border-4 border-b-0 border-ink bg-paper text-5xl sm:text-6xl', p.h)}>{p.idx + 1}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-7 px-4 pb-20 pt-7 sm:pt-9">
        <div className="min-w-0 flex-[999_1_560px] overflow-x-auto border-4 border-ink bg-white shadow-[8px_8px_0_#111]">
          <table className="w-full border-collapse md:min-w-[560px]">
            <thead>
              <tr className="bg-ink text-left text-[13px] tracking-wider text-paper">
                <th className="px-3 py-3 sm:px-4">#</th>
                <th className="px-3 py-3 sm:px-4">AGENT</th>
                <th className="px-3 py-3 sm:px-4">RANK</th>
                <th className="hidden px-4 py-3 md:table-cell">WATCHED</th>
                <th className="hidden px-4 py-3 md:table-cell">BEST EXAM</th>
                <th className="px-3 py-3 sm:px-4 text-right">{scope === 'daily' ? 'SCORE' : 'XP'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-bold">
                    Nobody here yet. {scope === 'daily' ? 'Play today’s challenge and take #1.' : 'Sign up, tick a title, and you’re on the board.'}
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <Row key={r.userId} r={r} />
              ))}
              {data?.me && (
                <>
                  <tr>
                    <td colSpan={6} className="border-t-[3px] border-ink bg-paper px-4 py-1 text-center text-xs font-black">· · ·</td>
                  </tr>
                  <Row r={data.me} />
                </>
              )}
            </tbody>
          </table>
          {data?.me?.guest && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-ink bg-pow px-4 py-3 font-bold">
              Guests aren’t shown on public boards. Your XP is safe; sign up to appear.
              <Link to="/auth" search={{ mode: 'signup' }} className="bg-ink px-3 py-1.5 font-black text-pow no-underline">
                CLAIM MY SPOT
              </Link>
            </div>
          )}
        </div>

        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
          <div className="border-4 border-ink bg-pow p-5 shadow-[8px_8px_0_#111]">
            <div className="font-display flex items-center gap-2.5 text-3xl">
              <Icon name="shieldCheck" size={30} fill="#FFF4DC" strokeWidth={2.2} /> RANK LADDER
            </div>
            <ol className="mt-3 flex list-none flex-col gap-2 p-0 font-extrabold">
              {RANKS.map((rk) => (
                <li key={rk.id} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-ink bg-paper">
                    <Icon name={LADDER_ICON[rk.id]} size={17} />
                  </span>
                  <span className="flex-1">{rk.name}</span>
                  <span>{rk.minXp.toLocaleString()} XP</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-4 border-ink bg-ink p-5 text-paper shadow-[8px_8px_0_#C8102E]">
            <div className="font-display flex items-center gap-2.5 text-3xl text-pow">
              <Icon name="star" size={28} /> HOW TO EARN XP
            </div>
            <ul className="mt-3 flex list-none flex-col gap-1.5 p-0 text-sm font-bold">
              <li>+150 per film watched, +250 per series</li>
              <li>Quiz points ÷ 10 per quiz</li>
              <li>+500 the first time you’re READY</li>
              <li>+250 for a flawless exam</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

function Row({ r }: { r: { position: number; userId: string; name: string; value: number; unit: string; rank: string; ready: boolean; titlesWatched: number; bestExamPct: number | null; isMe: boolean } }) {
  return (
    <tr className={cn('border-t-[3px] border-ink transition-colors hover:bg-pow', r.isMe ? 'bg-[#FFE9A8]' : 'bg-white')}>
      <td className="font-display px-3 py-3 sm:px-4 text-2xl">{r.position}</td>
      <td className="px-3 py-3 sm:px-4 font-extrabold">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {r.name}
          {r.isMe && <span className="bg-ink px-1.5 text-[11px] font-black text-pow">YOU</span>}
          {r.ready && (
            <span className="flex items-center gap-1 border-2 border-ink bg-win px-1.5 text-[11px] font-black text-paper">
              <Icon name="check" size={11} strokeWidth={3.5} /> READY
            </span>
          )}
        </span>
      </td>
      <td className="px-3 py-3 sm:px-4">
        <span className="inline-flex items-center gap-1 border-2 border-ink bg-sky px-2 py-0.5 text-xs font-black">
          <Icon name="shield" size={12} strokeWidth={3} /> {r.rank.toUpperCase()}
        </span>
      </td>
      <td className="hidden px-4 py-3 font-bold md:table-cell">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="film" size={14} strokeWidth={2.8} /> {r.titlesWatched}
        </span>
      </td>
      <td className="hidden px-4 py-3 font-bold md:table-cell">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="bolt" size={14} fill="#FFD23F" strokeWidth={2.2} /> {r.bestExamPct != null ? `${r.bestExamPct}%` : '—'}
        </span>
      </td>
      <td className="font-display px-3 py-3 sm:px-4 text-right text-2xl text-hero-red">{r.value.toLocaleString()}</td>
    </tr>
  )
}
