import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'motion/react'
import { TITLE_BY_ID, TRACKS, releaseDateFor, trackMinutes } from '../../content/catalog'
import type { TrackId } from '../../content/catalog'
import { btnClass, cn, daysUntil } from '../../components/comic'
import { Icon } from '../../components/Icon'
import type { IconName } from '../../components/Icon'
import { meQuery } from '../../lib/queries'
import { chooseTrack } from '../../server/fns'

export const Route = createFileRoute('/tracks/')({
  head: () => ({ meta: [{ title: 'Pick your track · Doomsday Ready' }] }),
  component: TracksPage,
})

const trackIcon: Record<string, IconName> = { stopwatch: 'stopwatch', star: 'star', layers: 'layers', rings: 'rings', users: 'users' }

function TracksPage() {
  const { data: me } = useQuery(meQuery)
  const [picked, setPicked] = useState<TrackId>((me?.stats?.activeTrack as TrackId) ?? 'essentials')
  const navigate = useNavigate()
  const qc = useQueryClient()
  const days = daysUntil(releaseDateFor(me?.country))
  const watched = new Set(me?.watchedIds ?? [])

  const start = useMutation({
    mutationFn: (trackId: TrackId) => chooseTrack({ data: { trackId } }),
    onSuccess: (_, trackId) => {
      qc.invalidateQueries({ queryKey: ['me'] })
      navigate({ to: '/tracks/$trackId', params: { trackId } })
    },
  })

  const active = TRACKS.find((t) => t.id === picked)!
  const activeHours = trackMinutes(active) / 60

  return (
    <main className="halftone min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="text-sm font-black uppercase tracking-[0.15em] text-hero-red">Step 1 of 3 · Choose your mission</div>
        <h1 className="font-display m-0 mt-1 text-[clamp(56px,7vw,96px)] leading-[0.95]">
          PICK YOUR <span className="ink-stroke text-hero-red" style={{ WebkitTextStroke: '2px #111' }}>TRACK</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-semibold">
          How much time do you have before December 18? Pick a path. Switch any time; your ticks belong to titles, not tracks, so nothing is lost.
        </p>

        <div className="mt-10 flex flex-wrap items-start gap-8">
          <div className="grid min-w-0 flex-[999_1_560px] gap-6 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]" role="radiogroup" aria-label="Tracks">
            {TRACKS.map((t) => {
              const on = t.id === picked
              const hrs = trackMinutes(t) / 60
              const done = t.titleIds.filter((id) => watched.has(id)).length
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPicked(t.id)}
                  className={cn('lift flex flex-col border-4 border-ink p-0 text-left text-ink transition-shadow', on ? 'scale-[1.02] bg-white shadow-[10px_10px_0_#C8102E]' : 'bg-paper shadow-[6px_6px_0_#111]')}
                >
                  <div className="flex w-full items-center justify-between border-b-4 border-ink px-4 py-3.5" style={{ background: t.color }}>
                    <span className="font-display flex items-center gap-2.5 text-4xl">
                      <span className="ico flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink bg-paper">
                        <Icon name={trackIcon[t.icon]} size={24} strokeWidth={2.4} />
                      </span>
                      {t.name.toUpperCase()}
                    </span>
                    <span className="bg-ink px-2 py-1 text-xs font-black tracking-wider text-paper">{t.level.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-3 p-4">
                    <div className="flex gap-5">
                      <Stat value={t.titleIds.length} label="TITLES" icon="film" />
                      <Stat value={Math.round(hrs)} label="HOURS" icon="clock" />
                      <Stat value={(hrs / days).toFixed(1)} label="HRS / DAY" icon="calendar" />
                    </div>
                    <p className="m-0 font-semibold leading-snug">{t.blurb}</p>
                    {done > 0 && (
                      <div className="flex items-center gap-1.5 text-sm font-black text-win">
                        <Icon name="check" size={16} strokeWidth={3} /> {done}/{t.titleIds.length} already watched
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <motion.aside
            key={active.id}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="min-w-0 flex-[1_1_340px] border-4 border-ink bg-ink p-6 text-paper"
            style={{ boxShadow: `10px 10px 0 ${active.color}` }}
          >
            <div className="flex items-center gap-2 text-[13px] font-black tracking-[0.15em]" style={{ color: active.color }}>
              <Icon name="shieldCheck" size={18} /> MISSION BRIEFING
            </div>
            <h2 className="font-display m-0 mt-1.5 text-5xl">{active.name.toUpperCase()}</h2>
            <p className="mb-4 mt-2 font-semibold leading-relaxed">{active.brief}</p>
            <div className="mb-2.5 text-[13px] font-black tracking-wider">FIRST UP ON THIS TRACK</div>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {active.titleIds.slice(0, 4).map((id, i) => {
                const title = TITLE_BY_ID.get(id)!
                return (
                  <li key={id} className="flex items-center gap-3 border-[3px] border-paper bg-paper px-3 py-2 text-ink">
                    <span className="font-display w-6 text-2xl">{i + 1}</span>
                    <Icon name={watched.has(id) ? 'check' : 'play'} size={18} strokeWidth={2.6} className={watched.has(id) ? 'text-win' : 'text-hero-red'} />
                    <span className="flex-1 font-extrabold">{title.name}</span>
                    <span className="text-xs font-extrabold">{title.year}</span>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 text-sm font-semibold opacity-85">
              ~{Math.round(activeHours)} hours. At {(activeHours / days).toFixed(1)} hrs/day you finish before opening night.
            </p>
            <button
              type="button"
              disabled={start.isPending}
              onClick={() => start.mutate(active.id)}
              className="font-display mt-5 flex w-full items-center justify-center gap-2.5 border-4 border-paper py-3 text-3xl text-ink transition-transform hover:-translate-y-0.5"
              style={{ background: active.color }}
            >
              <Icon name="bolt" size={28} fill="#111" strokeWidth={2} /> {start.isPending ? 'ASSEMBLING…' : `START ${active.name.toUpperCase()}`}
            </button>
          </motion.aside>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-4 border-ink bg-pow px-5 py-4 shadow-[6px_6px_0_#111]">
          <span className="font-display flex items-center gap-2.5 text-3xl">
            <Icon name="compass" size={34} fill="#FFF4DC" strokeWidth={2.2} /> ALREADY SEEN A LOT?
          </span>
          <span className="min-w-[220px] flex-1 font-bold">Skip straight to the 20-question Readiness Exam and let your weak spots tell you what to rewatch.</span>
          <Link to="/quiz" className={btnClass('ink')}>
            TAKE THE EXAM <Icon name="arrowRight" size={20} />
          </Link>
        </div>
      </div>
    </main>
  )
}

function Stat({ value, label, icon }: { value: number | string; label: string; icon: IconName }) {
  return (
    <div>
      <div className="font-display text-4xl leading-none">{value}</div>
      <div className="flex items-center gap-1 text-xs font-extrabold tracking-wider">
        <Icon name={icon} size={13} strokeWidth={2.8} /> {label}
      </div>
    </div>
  )
}
