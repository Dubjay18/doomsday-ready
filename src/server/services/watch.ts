import { TITLE_BY_ID } from '../../content/catalog'

/**
 * Where to watch, from licensed providers only (ADR-004).
 * With TMDB_READ_TOKEN: TMDB watch/providers (data by JustWatch), cached 12h in memory.
 * Without it: a JustWatch search link for the user's country.
 */
export interface Provider {
  id: number
  name: string
  logo: string | null
}

export interface WatchOptions {
  region: string
  source: 'tmdb' | 'fallback'
  link: string
  stream: Provider[]
  rent: Provider[]
  buy: Provider[]
  posterUrl: string | null
  custom?: { name: string; url: string; logo: string | null }[]
}

const TTL = 12 * 60 * 60 * 1000
const cache = new Map<string, { at: number; value: WatchOptions }>()

function justWatchSearch(region: string, name: string) {
  return `https://www.justwatch.com/${region.toLowerCase()}/search?q=${encodeURIComponent(name)}`
}

function getCustomLinks(name: string) {
  const query = encodeURIComponent(name)
  return [
    { name: 'PopcornMovies', url: `https://popcornmovies.ac/search?q=${query}`, logo: null },
    { name: 'Kokonow', url: `https://kokonow.app/explore/search/results?q=${query}`, logo: null },
  ]
}

async function tmdb<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
    signal: AbortSignal.timeout(4000),
  })
  if (!res.ok) throw new Error(`TMDB ${res.status}`)
  return (await res.json()) as T
}

type TmdbSearch = { results: { id: number; poster_path: string | null; release_date?: string; first_air_date?: string }[] }
type TmdbProviders = { results: Record<string, { link: string; flatrate?: P[]; rent?: P[]; buy?: P[]; ads?: P[]; free?: P[] }> }
type P = { provider_id: number; provider_name: string; logo_path: string | null }

const mapP = (xs?: P[]): Provider[] =>
  (xs ?? []).map((p) => ({ id: p.provider_id, name: p.provider_name, logo: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null }))

export async function getWatchOptions(titleId: string, region: string): Promise<WatchOptions> {
  const title = TITLE_BY_ID.get(titleId)
  if (!title) throw new Error('Unknown title')
  const key = `${titleId}:${region}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < TTL) return hit.value

  const custom = getCustomLinks(title.name)
  const fallback: WatchOptions = { region, source: 'fallback', link: justWatchSearch(region, title.name), stream: [], rent: [], buy: [], posterUrl: null, custom }
  const token = process.env.TMDB_READ_TOKEN
  if (!token) return fallback

  try {
    const isTv = title.kind === 'series'
    const query = title.name.replace(/\s*\((Season|Seasons?) [^)]+\)/, '')
    const search = await tmdb<TmdbSearch>(
      `/search/${isTv ? 'tv' : 'movie'}?query=${encodeURIComponent(query)}&${isTv ? 'first_air_date_year' : 'year'}=${title.year}`,
      token,
    )
    const match = search.results[0]
    if (!match) return { ...fallback, custom }
    const prov = await tmdb<TmdbProviders>(`/${isTv ? 'tv' : 'movie'}/${match.id}/watch/providers`, token)
    const r = prov.results[region]
    const value: WatchOptions = {
      region,
      source: 'tmdb',
      link: r?.link ?? fallback.link,
      stream: mapP([...(r?.flatrate ?? []), ...(r?.free ?? []), ...(r?.ads ?? [])]),
      rent: mapP(r?.rent),
      buy: mapP(r?.buy),
      posterUrl: match.poster_path ? `https://image.tmdb.org/t/p/w342${match.poster_path}` : null,
      custom,
    }
    cache.set(key, { at: Date.now(), value })
    return value
  } catch {
    return { ...fallback, custom }
  }
}

const posterCache = new Map<string, string | null>()

/** Poster URLs for a batch of titles (TMDB only; empty without a token). */
export async function getPosters(ids: string[]): Promise<Record<string, string | null>> {
  const token = process.env.TMDB_READ_TOKEN
  if (!token) return {}
  const out: Record<string, string | null> = {}
  await Promise.all(
    ids.map(async (id) => {
      if (posterCache.has(id)) return void (out[id] = posterCache.get(id)!)
      const title = TITLE_BY_ID.get(id)
      if (!title) return
      try {
        const isTv = title.kind === 'series'
        const query = title.name.replace(/\s*\((Season|Seasons?) [^)]+\)/, '')
        const s = await tmdb<TmdbSearch>(
          `/search/${isTv ? 'tv' : 'movie'}?query=${encodeURIComponent(query)}&${isTv ? 'first_air_date_year' : 'year'}=${title.year}`,
          token,
        )
        const p = s.results[0]?.poster_path
        const url = p ? `https://image.tmdb.org/t/p/w342${p}` : null
        posterCache.set(id, url)
        out[id] = url
      } catch {
        out[id] = null
      }
    }),
  )
  return out
}
