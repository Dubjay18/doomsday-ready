import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { TITLES, releaseDateFor } from '../content/catalog'
import type { Title } from '../content/catalog'
import { PHASES, ROAD_AHEAD, SAGAS } from '../content/phases'
import type { PhaseInfo } from '../content/phases'
import { Meter, btnClass, cn, useCountdown } from '../components/comic'
import { Icon } from '../components/Icon'
import { TrailerPlayer, trailerThumb } from '../components/Trailer'
import { meQuery } from '../lib/queries'

export const Route = createFileRoute('/phases')({
  head: () => ({ meta: [{ title: 'MCU phases roadmap · Doomsday Ready' }] }),
  component: PhasesPage,
})

const byRelease = (a: Title, b: Title) => a.year - b.year || TITLES.indexOf(a) - TITLES.indexOf(b)

function PhasesPage() {
  const { data: me } = useQuery(meQuery)
  const watched = new Set(me?.watchedIds ?? [])
  const cd = useCountdown(releaseDateFor(me?.country))

  const inPhase = (p: PhaseInfo) => TITLES.filter((t) => t.phase === p.phase).sort(byRelease)
  const all = PHASES.flatMap(inPhase)
  const doneAll = all.filter((t) => watched.has(t.id)).length

  return (
    <main>
      <section className="halftone-light border-b-4 border-ink bg-deep">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-14">
          <div className="text-sm font-black uppercase tracking-[0.15em] text-pow">Every Phase, one roadmap</div>
          <h1 className="font-display ink-stroke m-0 mt-1 text-[clamp(56px,7vw,100px)] leading-[0.95] text-paper" style={{ textShadow: '5px 5px 0 #111' }}>
            THE ROAD TO DOOMSDAY
          </h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-paper">
            Marvel Studios releases its stories in Phases, and groups the Phases into two Sagas. Here is each one: what happens, what it sets up, and every title in it.
          </p>

          {/* Roadmap rail */}
          <ol className="m-0 mt-9 flex list-none flex-wrap items-stretch gap-3 p-0" aria-label="Phases">
            {PHASES.map((p) => {
              const ts = inPhase(p)
              const done = ts.filter((t) => watched.has(t.id)).length
              return (
                <li key={p.phase} className="min-w-[140px] flex-1">
                  <a href={`#phase-${p.phase}`} className="lift flex h-full flex-col gap-1 border-4 border-ink p-3 text-ink no-underline shadow-[5px_5px_0_#111]" style={{ background: p.color }}>
                    <span className="font-display text-4xl leading-none">PHASE {p.phase}</span>
                    <span className="text-xs font-black tracking-wider">{p.years}</span>
                    <span className="mt-auto text-xs font-extrabold">
                      {done}/{ts.length} watched
                    </span>
                  </a>
                </li>
              )
            })}
            <li className="min-w-[140px] flex-1">
              <a href="#road-ahead" className="lift flex h-full flex-col gap-1 border-4 border-paper bg-ink p-3 text-pow no-underline shadow-[5px_5px_0_#C8102E]">
                <span className="font-display text-4xl leading-none">DOOMSDAY</span>
                <span className="text-xs font-black tracking-wider text-paper">DEC 18, 2026</span>
                <span className="mt-auto text-xs font-extrabold text-paper">{cd.ready ? (cd.done ? 'In cinemas' : `${cd.d} days to go`) : ' '}</span>
              </a>
            </li>
          </ol>
          <div className="mt-5 max-w-md text-paper">
            <div className="mb-1 flex justify-between text-sm font-extrabold">
              <span>Your progress across all six phases</span>
              <span>
                {doneAll}/{all.length}
              </span>
            </div>
            <Meter value={(doneAll / Math.max(all.length, 1)) * 100} label="Progress across all phases" />
          </div>
        </div>
      </section>

      {PHASES.map((p, i) => {
        const ts = inPhase(p)
        const done = ts.filter((t) => watched.has(t.id)).length
        const showSaga = i === 0 || PHASES[i - 1].saga !== p.saga
        return (
          <div key={p.phase}>
            {showSaga && (
              <div className="border-b-4 border-ink bg-ink px-4 py-5 text-paper">
                <div className="mx-auto flex max-w-7xl flex-wrap items-baseline gap-x-5 gap-y-1">
                  <h2 className="font-display m-0 text-5xl text-pow">{SAGAS[p.saga].name.toUpperCase()}</h2>
                  <span className="font-black tracking-wider">{SAGAS[p.saga].years}</span>
                  <span className="font-semibold opacity-90">{SAGAS[p.saga].blurb}</span>
                </div>
              </div>
            )}
            <section id={`phase-${p.phase}`} className={cn('scroll-mt-16 border-b-4 border-ink', i % 2 ? 'halftone' : 'bg-white')}>
              <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                  <div className="font-display border-4 border-ink px-4 py-1 text-5xl shadow-[5px_5px_0_#111]" style={{ background: p.color, color: p.phase === 1 || p.phase === 3 ? '#FFF4DC' : '#111' }}>
                    PHASE {p.phase}
                  </div>
                  <h3 className="font-display m-0 text-5xl leading-none">{p.name.toUpperCase()}</h3>
                  <span className="text-sm font-black tracking-widest">{p.years}</span>
                </div>
                <p className="mb-0 mt-4 max-w-3xl text-xl font-extrabold">{p.tagline}</p>
                <p className="mt-2 max-w-3xl text-lg font-semibold leading-relaxed">{p.summary}</p>

                <div className="mt-7 flex flex-wrap items-start gap-8">
                  <div className="min-w-0 flex-[1_1_380px] border-4 border-ink bg-paper p-5 shadow-[6px_6px_0_#111]">
                    <h4 className="font-display m-0 flex items-center gap-2 text-3xl">
                      <Icon name="target" size={26} /> KEY MOMENTS
                    </h4>
                    <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
                      {p.beats.map((b) => (
                        <li key={b} className="flex gap-2.5 font-semibold leading-snug">
                          <Icon name="star" size={16} fill={p.color} strokeWidth={2} className="mt-1 flex-none" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <p className="mb-0 mt-4 border-t-[3px] border-ink pt-3 text-sm font-bold">
                      <span className="font-black tracking-wider text-hero-red">LEADS TO › </span>
                      {p.leadsTo}
                    </p>
                  </div>

                  <div className="min-w-0 flex-[1_1_420px]">
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="font-display text-3xl">{ts.length} TITLES</span>
                      <span className="text-sm font-extrabold">
                        {done}/{ts.length} watched
                      </span>
                    </div>
                    <Meter value={(done / Math.max(ts.length, 1)) * 100} label={`Phase ${p.phase} progress`} />
                    <ol className="m-0 mt-4 grid list-none gap-2.5 p-0 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
                      {ts.map((t) => (
                        <PhaseTitle key={t.id} title={t} watched={watched.has(t.id)} />
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )
      })}

      <section id="road-ahead" className="halftone-light scroll-mt-16 bg-hero-red">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-display ink-stroke m-0 text-6xl text-paper" style={{ textShadow: '4px 4px 0 #111' }}>
            THE ROAD AHEAD
          </h2>
          <div className="mt-8 flex flex-wrap items-start gap-10">
            <div className="min-w-0 flex-[1_1_380px]">
              <TrailerPlayer titleId="doomsday" name="Avengers: Doomsday" />
            </div>
            <div className="min-w-0 flex-[1_1_320px]">
              <ol className="m-0 flex list-none flex-col gap-5 p-0">
                {ROAD_AHEAD.map((r) => (
                  <li key={r.id} className="panel bg-paper p-5">
                    <div className="text-xs font-black tracking-[0.15em] text-hero-red">{r.date.toUpperCase()}</div>
                    <div className="font-display text-4xl leading-tight">{r.name.toUpperCase()}</div>
                    <p className="mb-0 mt-1 font-semibold">{r.note}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/tracks" className={btnClass('yellow')}>
                  PICK A TRACK
                </Link>
                <Link to="/lore" className={btnClass('paper')}>
                  KNOW YOUR MCU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function PhaseTitle({ title, watched }: { title: Title; watched: boolean }) {
  const thumb = trailerThumb(title.id, 'sm')
  return (
    <motion.li initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link to="/titles/$titleId" params={{ titleId: title.id }} className="lift flex items-stretch border-[3px] border-ink bg-white text-ink no-underline shadow-[4px_4px_0_#111]">
        <span className="halftone relative block w-24 flex-none border-r-[3px] border-ink" style={{ backgroundColor: title.color }}>
          {thumb && <img src={thumb} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
          <span className="text-sm font-black leading-tight">{title.name}</span>
          <span className="mt-0.5 flex items-center gap-2 text-xs font-extrabold">
            <span>{title.year}</span>
            <span className="bg-ink px-1.5 text-paper">{title.kind === 'series' ? 'SERIES' : title.kind === 'special' ? 'SPECIAL' : 'FILM'}</span>
            {watched && (
              <span className="flex items-center gap-0.5 text-win">
                <Icon name="check" size={13} strokeWidth={3.2} /> SEEN
              </span>
            )}
          </span>
        </span>
      </Link>
    </motion.li>
  )
}
