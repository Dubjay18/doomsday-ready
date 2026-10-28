/** Game rules shared by server and client. Pure, no imports from server code. */

export const PASS_MARK = 0.8
export const EXAM_SIZE = 20
export const TITLE_QUIZ_SIZE = 5
export const DAILY_SIZE = 5
export const TIME_LIMIT_MS = 20_000
export const GRACE_MS = 3_000
export const COMBO_CAP = 5
export const DAILY_WATCH_XP_CAP = 10 // titles per UTC day that earn XP

export const XP = {
  watchFilm: 150,
  watchSeries: 250,
  watchSpecial: 50,
  ready: 500,
  flawless: 250,
} as const

export const BASE_POINTS = { easy: 100, medium: 150, hard: 200 } as const

export interface Rank {
  id: string
  name: string
  minXp: number
}

export const RANKS: Rank[] = [
  { id: 'civilian', name: 'Civilian', minXp: 0 },
  { id: 'recruit', name: 'Recruit', minXp: 1_000 },
  { id: 'agent', name: 'Agent', minXp: 3_000 },
  { id: 'avenger', name: 'Avenger', minXp: 6_000 },
  { id: 'founding-member', name: 'Founding Member', minXp: 10_000 },
  { id: 'multiverse-legend', name: 'Multiverse Legend', minXp: 15_000 },
]

export function rankFor(xp: number): Rank {
  let r = RANKS[0]
  for (const rank of RANKS) if (xp >= rank.minXp) r = rank
  return r
}

export function nextRank(xp: number): Rank | null {
  return RANKS.find((r) => r.minXp > xp) ?? null
}

export function verdictFor(correct: number, total: number) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100)
  const ready = total > 0 && correct / total >= PASS_MARK
  let title: string
  let line: string
  if (pct >= 95) [title, line] = ['YOU ARE THE MULTIVERSE', 'Doom should be worried about you.']
  else if (ready) [title, line] = ['READY!', 'Cleared for opening night.']
  else if (pct >= 50) [title, line] = ['SIDEKICK', 'Close, but Doom would win. Patch your weak spots and retake.']
  else [title, line] = ['CIVILIAN', 'Please evacuate the area. Then go watch the Speedrun track.']
  return { pct, ready, title, line }
}
