import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TRACK_BY_ID } from '../content/catalog'
import type { TrackId } from '../content/catalog'
import { Meter, btnClass } from '../components/comic'
import { Icon } from '../components/Icon'
import { authClient } from '../lib/auth-client'
import { meQuery } from '../lib/queries'

export const Route = createFileRoute('/me')({
  head: () => ({ meta: [{ title: 'Your file · Doomsday Ready' }] }),
  component: MePage,
})

function MePage() {
  const { data: me } = useQuery(meQuery)
  const qc = useQueryClient()
  const navigate = useNavigate()

  if (!me?.user || !me.stats)
    return (
      <main className="halftone flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="font-display m-0 text-6xl">NO FILE ON RECORD</h1>
        <p className="text-lg font-semibold">Tick a title or take a quiz and we’ll open one for you.</p>
        <Link to="/tracks" className={btnClass('yellow', 'lg')}>
          PICK A TRACK
        </Link>
      </main>
    )

  const s = me.stats
  const toNext = s.nextRank ? ((s.totalXp - s.rankFloor) / (s.nextRank.minXp - s.rankFloor)) * 100 : 100
  const track = s.activeTrack ? TRACK_BY_ID.get(s.activeTrack as TrackId) : undefined

  return (
    <main className="halftone min-h-[80vh]">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="panel flex flex-wrap items-center gap-6 bg-paper p-7">
          <span className="font-display flex h-24 w-24 items-center justify-center rounded-full border-4 border-ink bg-pow text-6xl shadow-[5px_5px_0_#111]">{me.user.name[0]?.toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-black tracking-[0.15em] text-hero-red">{me.user.isAnonymous ? 'GUEST AGENT' : 'AGENT FILE'}</div>
            <h1 className="font-display m-0 text-6xl">{me.user.name}</h1>
            {me.user.email && <div className="font-semibold">{me.user.email}</div>}
          </div>
          {s.readyAt ? (
            <span className="font-display rotate-[-6deg] border-4 border-win px-4 py-1 text-4xl text-win">READY!</span>
          ) : (
            <Link to="/quiz" className={btnClass('ink')}>
              <Icon name="bolt" size={22} /> GET READY
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <Stat icon="star" label="TOTAL XP" value={s.totalXp.toLocaleString()} />
          <Stat icon="shield" label="RANK" value={s.rank} />
          <Stat icon="film" label="TITLES WATCHED" value={String(s.titlesWatched)} />
          <Stat icon="target" label="BEST EXAM" value={s.bestExamPct != null ? `${s.bestExamPct}%` : '—'} />
        </div>

        <div className="panel mt-8 bg-white p-6">
          <div className="flex justify-between font-black">
            <span>{s.rank}</span>
            <span>{s.nextRank ? `${s.nextRank.name} at ${s.nextRank.minXp.toLocaleString()} XP` : 'Max rank'}</span>
          </div>
          <div className="mt-2">
            <Meter value={toNext} label="Progress to next rank" />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {track && (
            <Link to="/tracks/$trackId" params={{ trackId: track.id }} className={btnClass('yellow')}>
              <Icon name="film" size={22} /> CONTINUE {track.name.toUpperCase()}
            </Link>
          )}
          {me.user.isAnonymous ? (
            <Link to="/auth" search={{ mode: 'signup' }} className={btnClass('red')}>
              <Icon name="shieldCheck" size={22} /> CLAIM MY PROGRESS
            </Link>
          ) : (
            <button
              type="button"
              className={btnClass('paper')}
              onClick={async () => {
                await authClient.signOut()
                await qc.invalidateQueries()
                navigate({ to: '/' })
              }}
            >
              <Icon name="logout" size={22} /> SIGN OUT
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

function Stat({ icon, label, value }: { icon: 'star' | 'shield' | 'film' | 'target'; label: string; value: string }) {
  return (
    <div className="border-4 border-ink bg-paper p-5 shadow-[6px_6px_0_#111]">
      <Icon name={icon} size={30} />
      <div className="font-display mt-2 text-5xl leading-none">{value}</div>
      <div className="text-sm font-black tracking-wider">{label}</div>
    </div>
  )
}
