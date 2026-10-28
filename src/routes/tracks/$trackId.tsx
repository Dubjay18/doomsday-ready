import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { z } from 'zod'
import { TITLE_BY_ID, TRACK_BY_ID } from '../../content/catalog'
import type { Title, TrackId } from '../../content/catalog'
import { Meter, PosterPanel, cn } from '../../components/comic'
import { Icon } from '../../components/Icon'
import { trailerThumb } from '../../components/Trailer'
import type { IconName } from '../../components/Icon'
import { meQuery, postersQuery } from '../../lib/queries'
import { useTick } from '../../lib/useTick'

const search = z.object({
  filter: z.enum(['all', 'todo', 'done', 'series']).default('all').catch('all'),
  order: z.enum(['release', 'chrono']).default('release').catch('release'),
})

export const Route = createFileRoute('/tracks/$trackId')({
  validateSearch: search,
  loader: ({ params }) => {
    const track = TRACK_BY_ID.get(params.trackId as TrackId)
    if (!track) throw notFound()
    return { trackId: track.id }
  },
  head: ({ params }) => ({ meta: [{ title: `${TRACK_BY_ID.get(params.trackId as TrackId)?.name ?? 'Track'} watchlist · Doomsday Ready` }] }),
  component: Watchlist,
})

const FILTERS: { id: 'all' | 'todo' | 'done' | 'series'; label: string; icon: IconName }[] = [
  { id: 'all', label: 'ALL', icon: 'grid' },
  { id: 'todo', label: 'TO WATCH', icon: 'eye' },
  { id: 'done', label: 'WATCHED', icon: 'check' },
  { id: 'series', label: 'SERIES ONLY', icon: 'tv' },
]

function Watchlist() {
  const { trackId } = Route.useLoaderData()
  const { filter, order } = Route.useSearch()
  const track = TRACK_BY_ID.get(trackId)!
  const { data: me } = useQuery(meQuery)
  const { data: posters } = useQuery(postersQuery(track.titleIds))
  const tick = useTick()
  const watched = new Set(me?.watchedIds ?? [])

  const all = track.titleIds.map((id) => TITLE_BY_ID.get(id)!)
  const ordered = order === 'chrono' ? [...all].sort((a, b) => a.chrono - b.chrono) : all
  const shown = ordered.filter(
    (t) => filter === 'all' || (filter === 'todo' && !watched.has(t.id)) || (filter === 'done' && watched.has(t.id)) || (filter === 'series' && t.kind === 'series'),
  )
  const done = all.filter((t) => watched.has(t.id)).length
  const pct = (done / all.length) * 100
  const minsLeft = all.filter((t) => !watched.has(t.id)).reduce((m, t) => m + t.runtimeMin, 0)

  return (
    <main>
      <section className="border-b-4 border-ink" style={{ background: track.color }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-8 px-4 py-10">
          <div className="min-w-0 flex-[999_1_520px]">
            <Link to="/tracks" className="flex items-center gap-1 text-[13px] font-black tracking-[0.15em] text-ink">
              <Icon name="arrowRight" size={14} className="rotate-180" /> ALL TRACKS · {track.level.toUpperCase()} LEVEL
            </Link>
            <h1 className="font-display m-0 mt-1 text-[clamp(56px,7vw,92px)] leading-[0.95]" style={{ textShadow: '4px 4px 0 #FFF4DC' }}>
              {track.name.toUpperCase()}
            </h1>
            <p className="mt-2 max-w-xl text-lg font-semibold">{track.brief} Every tick earns XP.</p>
          </div>
          <div className="min-w-0 flex-[1_1_360px] border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#111]">
            <div className="flex items-baseline justify-between">
              <span className="font-display flex items-center gap-2 text-3xl">
                <Icon name="bolt" size={28} fill="#FFD23F" strokeWidth={2} /> READINESS METER
              </span>
              <span className="font-display text-4xl text-hero-red">{Math.round(pct)}%</span>
            </div>
            <div className="mt-2">
              <Meter value={pct} label={`${track.name} progress`} />
            </div>
            <div className="mt-2.5 flex justify-between text-sm font-extrabold">
              <span>
                {done} / {all.length} watched
              </span>
              <span>~{Math.round(minsLeft / 60)} hrs left</span>
            </div>
            {done === all.length && (
              <Link to="/quiz" className="font-display mt-3 flex items-center justify-center gap-2 border-4 border-ink bg-hero-red py-2 text-2xl text-paper">
                <Icon name="bolt" size={22} /> TRACK DONE: TAKE THE EXAM
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8">
        <div className="mb-7 flex flex-wrap items-center gap-2.5">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              from={Route.fullPath}
              search={(s) => ({ ...s, filter: f.id })}
              className={cn('flex items-center gap-2 border-[3px] border-ink px-4 py-2.5 text-sm font-black tracking-wide no-underline', filter === f.id ? 'bg-ink text-pow' : 'bg-paper text-ink')}
            >
              <Icon name={f.icon} size={16} strokeWidth={2.8} /> {f.label}
            </Link>
          ))}
          <span className="flex-1" />
          <Link
            from={Route.fullPath}
            search={(s) => ({ ...s, order: order === 'release' ? 'chrono' : 'release' })}
            className="flex items-center gap-2 border-[3px] border-dashed border-ink bg-paper px-4 py-2.5 text-sm font-black text-ink no-underline"
          >
            <Icon name="clock" size={16} strokeWidth={2.8} /> {order === 'release' ? 'RELEASE ORDER' : 'STORY ORDER'}
          </Link>
        </div>

        {shown.length === 0 && <p className="text-lg font-bold">Nothing here. Try another filter.</p>}

        <motion.div layout className="grid gap-7 [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))]">
          <AnimatePresence>
            {shown.map((t) => (
              <TitleCard
                key={t.id}
                title={t}
                order={track.titleIds.indexOf(t.id) + 1}
                optional={track.optional?.includes(t.id) ?? false}
                watched={watched.has(t.id)}
                posterUrl={posters?.[t.id]}
                onToggle={() => tick.mutate({ titleId: t.id, watched: !watched.has(t.id) })}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}

function TitleCard({ title, order, optional, watched, posterUrl, onToggle }: { title: Title; order: number; optional: boolean; watched: boolean; posterUrl?: string | null; onToggle: () => void }) {
  const runtime = title.kind === 'series' ? `${title.episodes ?? '?'} eps` : `${Math.floor(title.runtimeMin / 60)}h ${title.runtimeMin % 60}m`
  const priority = optional ? 'OPTIONAL' : title.weight >= 0.75 ? 'ESSENTIAL' : 'RECOMMENDED'
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative flex flex-col border-4 border-ink bg-white shadow-[6px_6px_0_#111] transition-transform hover:-translate-y-1 hover:-rotate-[0.6deg]"
    >
      <Link to="/titles/$titleId" params={{ titleId: title.id }} className="block text-inherit no-underline">
        <PosterPanel
          name={title.name}
          color={title.color}
          posterUrl={posterUrl ?? trailerThumb(title.id, 'sm')}
          badge={
            <span className="flex items-center gap-1.5 bg-ink px-2 py-1 text-xs font-black tracking-wider text-paper">
              <Icon name={title.kind === 'series' ? 'tv' : 'film'} size={14} strokeWidth={2.8} className="text-pow" />#{order} · {title.kind.toUpperCase()}{title.universe !== 'mcu' ? ` · ${title.universe.toUpperCase()}` : ''}
            </span>
          }
        >
          <AnimatePresence>
            {watched && (
              <motion.div
                initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: -12, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 600, damping: 18 }}
                className="font-display absolute right-3 top-10 border-4 border-hero-red bg-paper/95 px-2.5 text-3xl text-hero-red shadow-[3px_3px_0_#111]"
              >
                WATCHED!
              </motion.div>
            )}
          </AnimatePresence>
        </PosterPanel>
      </Link>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap gap-3 text-[13px] font-extrabold">
          <span className="flex items-center gap-1">
            <Icon name="calendar" size={14} strokeWidth={2.8} /> {title.year}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="clock" size={14} strokeWidth={2.8} /> {runtime}
          </span>
          <span className="flex items-center gap-1 text-hero-red">
            <Icon name="star" size={14} fill="#C8102E" strokeWidth={2} /> {priority}
          </span>
        </div>
        <p className="m-0 text-[15px] font-semibold leading-snug">
          <b>Why it matters:</b> {title.why}
        </p>
        <Link to="/titles/$titleId" params={{ titleId: title.id }} className="flex items-center gap-1 text-xs font-black tracking-wider text-ink">
          <Icon name="play" size={16} strokeWidth={2.6} /> TRAILER · WHERE TO WATCH · QUIZ
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={watched}
          className={cn('font-display mt-auto flex items-center justify-center gap-2 border-[3px] border-ink py-2.5 text-2xl transition-transform active:scale-95', watched ? 'bg-ink text-pow' : 'bg-pow text-ink')}
        >
          <Icon name={watched ? 'check' : 'plus'} size={22} strokeWidth={3} /> {watched ? 'WATCHED' : 'MARK AS WATCHED'}
        </button>
      </div>
    </motion.article>
  )
}
