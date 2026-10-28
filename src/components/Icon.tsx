/** The Doomsday Ready icon set: 24×24 grid, 2.5px round strokes to match the ink borders. */
const paths = {
  film: 'M3 4h18v16H3z M7 4v16 M17 4v16 M3 9h4 M3 15h4 M17 9h4 M17 15h4',
  tv: 'M3 7h18v13H3z M8 3l4 4 4-4',
  tvPlay: 'M3 7h18v13H3z M8 3l4 4 4-4 M10 11l5 2.5-5 2.5z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  trophy: 'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M7 6H4a3 3 0 0 0 3 4 M17 6h3a3 3 0 0 1-3 4',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  stopwatch: 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 10v4l2 2 M10 2h4 M12 2v4',
  star: 'M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7z',
  layers: 'M12 2 2 7l10 5 10-5z M2 12l10 5 10-5 M2 17l10 5 10-5',
  rings: 'M8 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M16 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  flame: 'M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8 0 4 3 7 7 7z',
  shield: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z',
  shieldCheck: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z M9 12l2 2 4-4',
  crown: 'M3 17h18 M3 17l2-11 5 5 2-7 2 7 5-5 2 11z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  calendar: 'M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21a7 7 0 0 1 14 0 M16 3.5a4 4 0 0 1 0 7.5 M22 21a7 7 0 0 0-4-6.3',
  share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4',
  bulb: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  alert: 'M12 2 1 21h22z M12 9v5 M12 17v.5',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
  check: 'M4 12l5 5L20 6',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 11v6 M12 7.5v.5',
  book: 'M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4z M12 5v15',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z M10 21a2 2 0 0 0 4 0',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 21h16',
  plus: 'M12 5v14 M5 12h14',
  play: 'M6 4l14 8-14 8z',
  refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5',
  ticket: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z M14 7v10',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M16 8l-2 6-6 2 2-6z',
  half: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 3v18 M12 7l5 5 M12 12l5 5',
  medal: 'M8 2l4 7 4-7 M12 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  grid: 'M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z',
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
  logout: 'M15 3h6v18h-6 M10 17l-5-5 5-5 M5 12h12',
  external: 'M14 3h7v7 M21 3l-9 9 M19 14v7H3V5h7',
  x: 'M6 6l12 12 M18 6L6 18',
  pencil: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
} as const

export type IconName = keyof typeof paths

export function Icon({
  name,
  size = 20,
  fill = 'none',
  strokeWidth = 2.5,
  className,
  title,
}: {
  name: IconName
  size?: number
  fill?: string
  strokeWidth?: number
  className?: string
  title?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      style={{ flex: 'none' }}
    >
      <path d={paths[name]} />
    </svg>
  )
}
