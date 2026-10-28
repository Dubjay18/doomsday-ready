import { Link, createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { TITLE_BY_ID, TRACKS } from '../../content/catalog'
import { Chip, btnClass, cn } from '../../components/comic'
import { Icon } from '../../components/Icon'
import { TrailerPlayer, hasTrailer, trailerThumb } from '../../components/Trailer'
import { meQuery, questionCountsQuery, watchQuery } from '../../lib/queries'
import { useTick } from '../../lib/useTick'
import { startQuizFn } from '../../server/fns'

export const Route = createFileRoute('/titles/$titleId')({
  loader: ({ params, context }) => {
    const title = TITLE_BY_ID.get(params.titleId)
    if (!title) throw notFound()
    void context.queryClient.prefetchQuery(questionCountsQuery)
    return { titleId: title.id }
  },
  head: ({ params }) => ({ meta: [{ title: `${TITLE_BY_ID.get(params.titleId)?.name ?? 'Title'} · Doomsday Ready` }] }),
  component: TitlePage,
})

const REGIONS = ['NG', 'US', 'GB', 'CA', 'IN', 'ZA', 'KE', 'GH', 'AU', 'DE', 'FR', 'BR']

function TitlePage() {
  const { titleId } = Route.useLoaderData()
  const title = TITLE_BY_ID.get(titleId)!
  const { data: me } = useQuery(meQuery)
  const [region, setRegion] = useState<string | undefined>(undefined)
  const effectiveRegion = region ?? me?.country ?? 'US'
  const { data: watch, isLoading } = useQuery(watchQuery(titleId, effectiveRegion))
  const { data: counts } = useQuery(questionCountsQuery)
  const tick = useTick()
  const navigate = useNavigate()
  const watched = me?.watchedIds.includes(titleId) ?? false
  const qCount = counts?.counts[titleId] ?? 0
  const inTracks = TRACKS.filter((t) => t.titleIds.includes(titleId))

  const quiz = useMutation({
    mutationFn: () => startQuizFn({ data: { mode: 'title', titleId } }),
    onSuccess: ({ sessionId }) => navigate({ to: '/quiz/$sessionId', params: { sessionId } }),
  })

  const pickRegion = (r: string) => {
    setRegion(r)
    document.cookie = `dr_region=${r}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <main>
      <section className="halftone border-b-4 border-ink" style={{ backgroundColor: title.color }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-8 px-4 py-12">
          {watch?.posterUrl ? (
            <img src={watch.posterUrl} alt={`${title.name} poster`} className="w-40 border-4 border-ink shadow-[8px_8px_0_#111]" />
          ) : (
            trailerThumb(titleId, 'md') && <img src={trailerThumb(titleId, 'md')!} alt={`${title.name} preview`} className="aspect-video w-64 border-4 border-ink object-cover shadow-[8px_8px_0_#111]" />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Chip icon={title.kind === 'film' ? 'film' : 'tv'} dark>
                {title.kind.toUpperCase()}
              </Chip>
              <Chip icon="calendar">{title.year}</Chip>
              <Chip icon="clock">{title.kind === 'series' ? `${title.episodes} episodes` : `${Math.floor(title.runtimeMin / 60)}h ${title.runtimeMin % 60}m`}</Chip>
              {title.universe === 'fox' && <Chip icon="rings">FOX UNIVERSE</Chip>}
              {title.universe === 'sony' && <Chip icon="rings">SONY UNIVERSE</Chip>}
              {title.phase && <Chip icon="layers">PHASE {title.phase}</Chip>}
            </div>
            <h1 className="font-display ink-stroke m-0 mt-3 text-[clamp(48px,6vw,84px)] leading-[0.95] text-paper" style={{ textShadow: '5px 5px 0 #111' }}>
              {title.name}
            </h1>
          </div>
        </div>
      </section>

      {hasTrailer(titleId) && (
        <section id="trailer" className="mx-auto max-w-4xl px-4 pt-10">
          <h2 className="font-display m-0 mb-4 flex items-center gap-2.5 text-4xl">
            <Icon name="play" size={34} fill="#C8102E" /> TRAILER
          </h2>
          <TrailerPlayer titleId={titleId} name={title.name} />
        </section>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <section className="panel bg-white p-6">
          <h2 className="font-display m-0 flex items-center gap-2.5 text-4xl">
            <Icon name="target" size={34} /> WHY IT MATTERS
          </h2>
          <p className="mt-3 text-lg font-semibold leading-relaxed">{title.why}</p>
          <div className="mt-2 text-sm font-extrabold">
            Doomsday relevance:{' '}
            <span className="inline-flex gap-0.5 align-middle">
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} name="star" size={16} strokeWidth={2} fill={i < Math.round(title.weight * 5) ? '#C8102E' : 'none'} className="text-hero-red" />
              ))}
            </span>
          </div>
          <button
            type="button"
            onClick={() => tick.mutate({ titleId, watched: !watched })}
            aria-pressed={watched}
            className={cn(btnClass(watched ? 'ink' : 'yellow', 'lg'), 'mt-6 w-full')}
          >
            <Icon name={watched ? 'check' : 'plus'} size={28} strokeWidth={3} /> {watched ? 'WATCHED' : 'MARK AS WATCHED'}
          </button>
          {inTracks.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold">
              On tracks:
              {inTracks.map((t) => (
                <Link key={t.id} to="/tracks/$trackId" params={{ trackId: t.id }} className="border-2 border-ink px-2 py-0.5 font-black text-ink no-underline" style={{ background: t.color }}>
                  {t.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="panel bg-paper p-6">
          <h2 className="font-display m-0 flex items-center gap-2.5 text-4xl">
            <Icon name="tvPlay" size={34} /> WHERE TO WATCH
          </h2>
          <label className="mt-3 flex items-center gap-2 text-sm font-black" htmlFor="region">
            <Icon name="globe" size={16} /> COUNTRY
            <select id="region" value={effectiveRegion} onChange={(e) => pickRegion(e.target.value)} className="border-[3px] border-ink bg-white px-2 py-1 font-bold">
              {[...new Set([effectiveRegion, ...REGIONS])].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {isLoading && <p className="font-bold">Scanning the multiverse…</p>}
          {watch && watch.source === 'tmdb' && (
            <div className="mt-4 flex flex-col gap-4">
              {(['stream', 'rent', 'buy'] as const).map((k) =>
                watch[k].length ? (
                  <div key={k}>
                    <div className="mb-2 text-xs font-black tracking-[0.15em]">{k === 'stream' ? 'STREAM' : k.toUpperCase()}</div>
                    <div className="flex flex-wrap gap-2">
                      {watch[k].map((p) => (
                        <a key={p.id} href={watch.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 border-[3px] border-ink bg-white px-2.5 py-1.5 text-sm font-extrabold text-ink no-underline">
                          {p.logo ? <img src={p.logo} alt="" className="h-6 w-6 border border-ink" /> : <Icon name="play" size={14} fill="#111" />}
                          {p.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
              {!watch.stream.length && !watch.rent.length && !watch.buy.length && (
                <p className="m-0 font-bold">Not available to stream, rent or buy in {watch.region} right now. Try another country.</p>
              )}
              <p className="m-0 text-xs font-semibold">Watch data by JustWatch, via TMDB.</p>
            </div>
          )}
          {watch && watch.source === 'fallback' && (
            <div className="mt-4">
              <p className="mt-0 font-semibold">See every legal streaming, rental and purchase option for {watch.region} on JustWatch:</p>
              <a href={watch.link} target="_blank" rel="noreferrer" className={btnClass('yellow')}>
                <Icon name="external" size={20} /> FIND IT ON JUSTWATCH
              </a>
            </div>
          )}
        </section>

        <section className="panel bg-ink p-6 text-paper" style={{ boxShadow: '8px 8px 0 #C8102E' }}>
          <h2 className="font-display m-0 flex items-center gap-2.5 text-4xl text-pow">
            <Icon name="bolt" size={34} /> TITLE QUIZ
          </h2>
          {qCount > 0 ? (
            <>
              <p className="mt-3 font-semibold leading-relaxed">
                {Math.min(qCount, 5)} quick questions on {title.name}. Combos, timers and XP included. Spoilers for this title only.
              </p>
              <button type="button" disabled={quiz.isPending} onClick={() => quiz.mutate()} className={cn(btnClass('yellow', 'lg'), 'mt-2 w-full')}>
                <Icon name="bolt" size={28} fill="#111" strokeWidth={2} /> {quiz.isPending ? 'LOADING…' : 'START QUIZ'}
              </button>
              {quiz.isError && <p className="font-bold text-pow">{(quiz.error as Error).message}</p>}
            </>
          ) : (
            <p className="mt-3 font-semibold">Questions for this title are still being written. It still counts toward your track.</p>
          )}
        </section>
      </div>
    </main>
  )
}
