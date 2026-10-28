import { useState } from 'react'
import { TRAILERS } from '../content/trailers'
import { Icon } from './Icon'

type Thumb = 'sm' | 'md' | 'lg'
const FILE: Record<Thumb, string> = { sm: 'mqdefault', md: 'hqdefault', lg: 'maxresdefault' }

/** Preview image for a title's trailer, or null if we don't have one. Free, key-less and always 16:9 at `lg`. */
export function trailerThumb(titleId: string, size: Thumb = 'sm') {
  const id = TRAILERS[titleId]
  return id ? `https://i.ytimg.com/vi/${id}/${FILE[size]}.jpg` : null
}

export function hasTrailer(titleId: string) {
  return titleId in TRAILERS
}

/**
 * Click-to-load YouTube player. Shows the preview image first, and only loads the iframe
 * (from the privacy-friendly nocookie domain) when someone presses play, so a page of
 * 20 titles doesn't pull 20 players.
 */
export function TrailerPlayer({ titleId, name, className }: { titleId: string; name: string; className?: string }) {
  const [playing, setPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const id = TRAILERS[titleId]
  if (!id) return null

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden border-4 border-ink bg-ink shadow-[8px_8px_0_#111]">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`${name} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play the ${name} trailer`} className="group absolute inset-0 block h-full w-full cursor-pointer border-0 bg-transparent p-0">
            <img
              src={`https://i.ytimg.com/vi/${id}/${thumbFailed ? 'hqdefault' : 'maxresdefault'}.jpg`}
              onError={() => setThumbFailed(true)}
              alt={`${name} trailer preview`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-ink bg-pow shadow-[4px_4px_0_#111] transition-transform group-hover:scale-110">
              <Icon name="play" size={34} fill="#111" strokeWidth={2} className="ml-1" />
            </span>
            <span className="font-display absolute bottom-3 left-3 bg-ink px-2.5 py-0.5 text-2xl text-pow">WATCH THE TRAILER</span>
          </button>
        )}
      </div>
      <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-ink">
        <Icon name="external" size={14} strokeWidth={2.8} /> Open on YouTube
      </a>
    </div>
  )
}
