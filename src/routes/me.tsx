import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { TRACK_BY_ID } from '../content/catalog'
import type { TrackId } from '../content/catalog'
import { Meter, btnClass } from '../components/comic'
import { AlertsPanel } from '../components/AlertsPanel'
import { Icon } from '../components/Icon'
import { authClient } from '../lib/auth-client'
import { meQuery } from '../lib/queries'
import { updateProfile } from '../server/fns'
import { useToast } from '../lib/toast'

export const Route = createFileRoute('/me')({
  head: () => ({ meta: [{ title: 'Your file · Doomsday Ready' }] }),
  component: MePage,
})

function MePage() {
  const { data: me } = useQuery(meQuery)
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(me?.user?.name ?? '')

  const toast = useToast()
  const updateName = useMutation({
    mutationFn: (newName: string) => updateProfile({ data: { name: newName } }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['me'] })
      toast({ text: 'Username updated', icon: 'check', tone: 'yellow' })
      setEditing(false)
    },
    onError: (err) => {
      toast({ text: (err as Error).message || 'Failed to update', icon: 'x', tone: 'red' })
    },
  })

  if (!me?.user || !me.stats)
    return (
      <main className="halftone flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="font-display m-0 text-6xl">NO FILE ON RECORD</h1>
        <p className="text-lg font-semibold">Tick a title or take a quiz and we’ll open one for you.</p>
        <Link to="/tracks" className={btnClass('yellow', 'lg')}>
          PICK A TRACK
        </Link>
        <div className="w-full max-w-xl text-left">
          <AlertsPanel />
        </div>
      </main>
    )

  const s = me.stats
  const toNext = s.nextRank ? ((s.totalXp - s.rankFloor) / (s.nextRank.minXp - s.rankFloor)) * 100 : 100
  const track = s.activeTrack ? TRACK_BY_ID.get(s.activeTrack as TrackId) : undefined

  return (
    <main className="halftone min-h-[80vh]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="panel flex flex-wrap items-center gap-6 bg-paper p-7">
          <span className="font-display flex h-24 w-24 items-center justify-center rounded-full border-4 border-ink bg-pow text-6xl shadow-[5px_5px_0_#111]">{me.user.name[0]?.toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-black tracking-[0.15em] text-hero-red">{me.user.isAnonymous ? 'GUEST AGENT' : 'AGENT FILE'}</div>
            {editing ? (
              <form
                className="mt-2 flex flex-wrap items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (name.trim().length >= 2) updateName.mutate(name.trim())
                }}
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={32}
                  className="border-[3px] border-ink px-3 py-2 font-display text-4xl"
                  autoFocus
                />
                <button type="submit" disabled={updateName.isPending} className={btnClass('yellow')}>
                  <Icon name="check" size={18} /> SAVE
                </button>
                <button type="button" onClick={() => { setEditing(false); setName(me.user.name) }} className={btnClass('paper')}>
                  CANCEL
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="font-display m-0 text-6xl">{me.user.name}</h1>
                <button type="button" onClick={() => setEditing(true)} className="border-2 border-ink p-1.5 hover:bg-ink hover:text-paper">
                  <Icon name="pencil" size={18} />
                </button>
              </div>
            )}
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

        <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
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

        <div className="mt-8">
          <AlertsPanel />
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
