import { Icon } from './Icon'
import type { NewsItem } from '../server/services/news'

export function timeAgo(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return days < 14 ? `${days}d ago` : new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export function NewsCard({ item, compact }: { item: NewsItem; compact?: boolean }) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className="lift flex flex-col border-4 border-ink bg-white text-ink no-underline shadow-[6px_6px_0_#111]">
      {item.image ? (
        <img src={item.image} alt="" loading="lazy" className={compact ? 'aspect-[16/8] w-full border-b-4 border-ink object-cover' : 'aspect-video w-full border-b-4 border-ink object-cover'} />
      ) : (
        <div className="halftone flex aspect-video w-full items-center justify-center border-b-4 border-ink bg-pow">
          <Icon name="bolt" size={48} fill="#111" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black tracking-wider">
          <span className="bg-ink px-2 py-0.5 text-pow">{item.source.toUpperCase()}</span>
          <span>{timeAgo(item.publishedAt)}</span>
          {item.spoiler && <span className="border-2 border-hero-red px-1.5 text-hero-red">SPOILERS</span>}
        </div>
        <h3 className="m-0 text-lg font-black leading-tight">{item.title}</h3>
        {!compact && item.excerpt && <p className="m-0 text-sm font-semibold leading-snug text-ink/80">{item.excerpt}</p>}
        <span className="mt-auto flex items-center gap-1 pt-1 text-xs font-black tracking-wider text-hero-red">
          READ ON {item.source.toUpperCase()} <Icon name="external" size={13} strokeWidth={2.8} />
        </span>
      </div>
    </a>
  )
}
