import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Chip } from '../components/comic'
import { Icon } from '../components/Icon'
import { NewsCard, timeAgo } from '../components/NewsCard'
import { newsQuery } from '../lib/queries'

export const Route = createFileRoute('/news')({
  loader: ({ context }) => void context.queryClient.prefetchQuery(newsQuery(30)),
  head: () => ({ meta: [{ title: 'MCU news · Doomsday Ready' }] }),
  component: NewsPage,
})

function NewsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery(newsQuery(30))
  const [lead, ...rest] = data?.items ?? []

  return (
    <main className="halftone min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="text-sm font-black uppercase tracking-[0.15em] text-hero-red">Straight from the multiverse</div>
        <h1 className="font-display m-0 mt-1 text-[clamp(56px,7vw,96px)] leading-[0.95]">
          MCU <span className="ink-stroke text-hero-red" style={{ WebkitTextStroke: '2px #111' }}>NEWS</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-semibold">
          The latest Marvel headlines from around the web, refreshed every 20 minutes. We link out to the publisher for every story. Anything marked <b>SPOILERS</b> gives away a recent release.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => refetch()} disabled={isFetching} className="flex items-center gap-2 border-[3px] border-ink bg-paper px-4 py-2 text-sm font-black tracking-wide disabled:opacity-60">
            <Icon name="refresh" size={16} strokeWidth={2.8} /> {isFetching ? 'REFRESHING…' : 'REFRESH'}
          </button>
          {data && <Chip icon="clock">Updated {timeAgo(data.updatedAt)}</Chip>}
        </div>

        {isLoading && <p className="mt-10 text-lg font-bold">Scanning the multiverse for headlines…</p>}
        {(isError || (data && data.items.length === 0)) && (
          <div className="panel mt-10 max-w-xl bg-white p-6">
            <h2 className="font-display m-0 text-3xl">NO HEADLINES RIGHT NOW</h2>
            <p className="mb-0 font-semibold">The news feeds didn’t answer. Try again in a minute.</p>
          </div>
        )}

        {lead && (
          <a href={lead.url} target="_blank" rel="noreferrer" className="lift mt-10 grid border-4 border-ink bg-ink text-paper no-underline shadow-[10px_10px_0_#C8102E] md:grid-cols-[1.4fr_1fr]">
            {lead.image ? <img src={lead.image} alt="" className="h-full min-h-56 w-full object-cover" /> : <div className="halftone min-h-56 bg-pow" />}
            <div className="flex flex-col justify-center gap-3 p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-black tracking-wider text-pow">
                <span>LATEST · {lead.source.toUpperCase()}</span>
                <span>{timeAgo(lead.publishedAt)}</span>
                {lead.spoiler && <span className="border-2 border-pow px-1.5">SPOILERS</span>}
              </div>
              <h2 className="font-display m-0 text-4xl leading-tight sm:text-5xl">{lead.title}</h2>
              <p className="m-0 font-semibold">{lead.excerpt}</p>
              <span className="flex items-center gap-1 text-sm font-black tracking-wider text-pow">
                READ THE STORY <Icon name="external" size={15} strokeWidth={2.8} />
              </span>
            </div>
          </a>
        )}

        <div className="mt-10 grid gap-7 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {rest.map((i) => (
            <NewsCard key={i.id} item={i} />
          ))}
        </div>
        <p className="mt-10 text-xs font-semibold">Headlines, images and excerpts belong to their publishers (ComicBook, Screen Rant, CBR, Collider). Doomsday Ready is an unofficial fan project.</p>
      </div>
    </main>
  )
}
