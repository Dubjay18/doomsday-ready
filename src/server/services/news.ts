/**
 * MCU news, aggregated from public RSS feeds. We only keep the headline, a short excerpt, the image
 * and the link; every card links out to the publisher. Cached in memory so we hit each feed at most
 * once every 20 minutes, and a feed that is down just drops out instead of breaking the page.
 */
export interface NewsItem {
  id: string
  title: string
  excerpt: string
  url: string
  image: string | null
  source: string
  publishedAt: string
  spoiler: boolean
}

interface Feed {
  source: string
  url: string
  /** General-interest feeds are filtered down to Marvel stories. */
  filter?: RegExp
}

const MARVEL = /marvel|mcu|avengers|doomsday|x-men|spider-man|thunderbolts|fantastic four|deadpool|wolverine|daredevil|visionquest|doctor doom|loki|disney\+/i

const FEEDS: Feed[] = [
  { source: 'ComicBook', url: 'https://comicbook.com/category/marvel/feed/' },
  { source: 'Screen Rant', url: 'https://screenrant.com/feed/', filter: MARVEL },
  { source: 'CBR', url: 'https://www.cbr.com/feed/category/movies/', filter: MARVEL },
  { source: 'Collider', url: 'https://collider.com/feed/', filter: MARVEL },
]

const TTL = 20 * 60 * 1000
let cache: { at: number; items: NewsItem[] } | null = null

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' }
function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
}
const cdata = (s: string) => s.replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '')
const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))?.[1]

function parse(xml: string, feed: Feed): NewsItem[] {
  const out: NewsItem[] = []
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const raw = m[1]
    const title = decode(cdata(tag(raw, 'title') ?? '')).trim()
    const url = decode(cdata(tag(raw, 'link') ?? '')).trim()
    const date = new Date(tag(raw, 'pubDate') ?? '')
    if (!title || !/^https?:\/\//.test(url) || Number.isNaN(date.getTime())) continue

    const desc = cdata(tag(raw, 'description') ?? '')
    const body = cdata(tag(raw, 'content:encoded') ?? '')
    const cats = [...raw.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)].map((c) => decode(cdata(c[1])))
    if (feed.filter && !feed.filter.test(`${title} ${cats.join(' ')}`)) continue

    const image =
      raw.match(/<media:content[^>]*url="([^"]+)"/i)?.[1] ??
      raw.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/i)?.[1] ??
      (desc + body).match(/<img[^>]*src="([^"]+)"/i)?.[1] ??
      null
    const text = decode(desc.replace(/<figure[\s\S]*?<\/figure>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
    const excerpt = text.replace(/\s*\[…\]\s*$/, '…').slice(0, 220)
    out.push({
      id: url,
      title,
      excerpt,
      url,
      image: image ? decode(image) : null,
      source: feed.source,
      publishedAt: date.toISOString(),
      spoiler: /spoiler/i.test(`${title} ${text}`),
    })
  }
  return out
}

async function loadFeed(feed: Feed): Promise<NewsItem[]> {
  const res = await fetch(feed.url, { headers: { 'user-agent': 'DoomsdayReady/1.0 (+news aggregator)', accept: 'application/rss+xml, application/xml, text/xml' }, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`${feed.source} ${res.status}`)
  return parse(await res.text(), feed)
}

export async function getNews(limit = 24): Promise<{ items: NewsItem[]; updatedAt: string }> {
  if (!cache || Date.now() - cache.at > TTL) {
    const settled = await Promise.allSettled(FEEDS.map(loadFeed))
    const items = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    const seen = new Set<string>()
    const unique = items
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .filter((i) => !seen.has(i.title.toLowerCase()) && !!seen.add(i.title.toLowerCase()))
      .slice(0, 60)
    // If every feed failed, keep the last good batch and retry in a minute rather than caching nothing for 20.
    if (unique.length) cache = { at: Date.now(), items: unique }
    else cache = { at: Date.now() - TTL + 60_000, items: cache?.items ?? [] }
  }
  return { items: cache.items.slice(0, limit), updatedAt: new Date(cache.at).toISOString() }
}
