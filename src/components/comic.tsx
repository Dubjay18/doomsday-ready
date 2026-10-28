import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

export function cn(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ')
}

/** The Doomsday Ready mark: an original starburst, not anyone else's logo. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <polygon points="20,1 25,13 39,9 29,20 39,31 25,27 20,39 15,27 1,31 11,20 1,9 15,13" fill="#FFD23F" stroke="#FFF4DC" strokeWidth="2" />
      <text x="20" y="25" textAnchor="middle" fontFamily="Bangers" fontSize="14" fill="#111">DR</text>
    </svg>
  )
}

export function Burst({ color = '#FFD23F', size = 170, children, className }: { color?: string; size?: number; children?: ReactNode; className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0">
        <polygon points="100,0 118,58 180,30 142,82 200,100 142,118 180,170 118,142 100,200 82,142 20,170 58,118 0,100 58,82 20,30 82,58" fill={color} stroke="#111" strokeWidth="5" />
      </svg>
      <span className="relative font-display text-[2.4rem] leading-none text-ink" style={{ transform: 'rotate(-8deg)' }}>
        {children}
      </span>
    </div>
  )
}

export function SpinningBurst({ size = 360, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" className={cn('anim-spin', className)}>
      <polygon points="100,0 116,62 176,24 138,84 200,100 138,116 176,176 116,138 100,200 84,138 24,176 62,116 0,100 62,84 24,24 84,62" fill="#FFD23F" stroke="#111" strokeWidth="3" />
    </svg>
  )
}

export function Meter({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label ?? 'Progress'}
      className="relative h-7 overflow-hidden border-4 border-ink bg-white"
    >
      <div
        className="halftone h-full border-r-4 border-ink bg-pow transition-[width] duration-500 ease-[cubic-bezier(.2,1.4,.4,1)]"
        style={{ width: `${pct}%`, borderRightWidth: pct === 0 ? 0 : undefined }}
      />
    </div>
  )
}

type BtnTone = 'yellow' | 'paper' | 'ink' | 'red'
const tones: Record<BtnTone, string> = {
  yellow: 'bg-pow text-ink',
  paper: 'bg-paper text-ink',
  ink: 'bg-ink text-pow',
  red: 'bg-hero-red text-paper',
}

export function btnClass(tone: BtnTone = 'yellow', size: 'md' | 'lg' = 'md') {
  return cn(
    'press inline-flex items-center justify-center gap-2.5 border-4 border-ink font-display tracking-wider shadow-[6px_6px_0_#111] disabled:cursor-not-allowed disabled:opacity-60',
    tones[tone],
    size === 'lg' ? 'px-7 py-3 text-[1.9rem]' : 'px-5 py-2 text-2xl',
  )
}

export function Chip({ icon, children, dark }: { icon?: IconName; children: ReactNode; dark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 border-2 border-ink px-2 py-0.5 text-[13px] font-extrabold', dark ? 'bg-ink text-paper' : 'bg-paper')}>
      {icon && <Icon name={icon} size={14} strokeWidth={2.8} className={dark ? 'text-pow' : undefined} />}
      {children}
    </span>
  )
}

export function SectionTitle({ children, icon, className }: { children: ReactNode; icon?: IconName; className?: string }) {
  return (
    <h2 className={cn('font-display m-0 flex items-center gap-4 text-5xl sm:text-6xl', className)}>
      {icon && <Icon name={icon} size={52} strokeWidth={2} fill="#FFF4DC" className="anim-wobble" />}
      {children}
    </h2>
  )
}

/** Placeholder "cover" when there's no TMDB poster: halftone panel with the title in display type. */
export function PosterPanel({ name, color, posterUrl, badge, children }: { name: string; color: string; posterUrl?: string | null; badge?: ReactNode; children?: ReactNode }) {
  return (
    <div className="halftone relative flex h-44 items-end border-b-4 border-ink p-3" style={{ backgroundColor: color }}>
      {posterUrl && <img src={posterUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />}
      {posterUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />}
      {badge && <div className="absolute left-2.5 top-2.5">{badge}</div>}
      <h3 className="font-display ink-stroke relative m-0 text-[1.9rem] leading-[1.02] text-paper" style={{ WebkitTextStroke: '1.5px #111', textShadow: '3px 3px 0 #111' }}>
        {name}
      </h3>
      {children}
    </div>
  )
}

/** Live countdown. Renders dashes on the server to avoid hydration mismatch. */
export function useCountdown(targetIso: string) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const target = new Date(targetIso).getTime()
  if (now === null) return { ready: false, done: false, d: '--', h: '--', m: '--', s: '--', days: null as number | null }
  let ms = Math.max(0, target - now)
  const done = ms === 0
  const d = Math.floor(ms / 86_400_000)
  ms -= d * 86_400_000
  const h = Math.floor(ms / 3_600_000)
  ms -= h * 3_600_000
  const m = Math.floor(ms / 60_000)
  ms -= m * 60_000
  const s = Math.floor(ms / 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return { ready: true, done, d: String(d), h: p(h), m: p(m), s: p(s), days: d + (h || m || s ? 1 : 0) }
}

export function daysUntil(targetIso: string) {
  return Math.max(1, Math.ceil((new Date(targetIso).getTime() - Date.now()) / 86_400_000))
}
