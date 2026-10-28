/**
 * Quiz engine. Pure functions only (no DB, no framework), so it is fully unit-testable.
 * See docs/04-QUIZ-ENGINE.md.
 */
import { BASE_POINTS, COMBO_CAP, GRACE_MS, TIME_LIMIT_MS } from '../../../shared/game'
import type { Difficulty, Question } from '../../../content/questions'

/** mulberry32: tiny, fast, deterministic PRNG. Same seed ⇒ same sequence. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(s: string) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0
  return h
}

export function shuffle<T>(xs: readonly T[], rand: () => number): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface SampleOpts {
  seed: number
  n: number
  mix?: Partial<Record<Difficulty, number>>
  perTitleCap?: number
  /** title id → 0..1 importance */
  weightOf: (q: Question) => number
  /** Question ids to avoid if the pool allows (recently seen). */
  avoid?: Set<string>
}

export interface Sampled {
  questionIds: string[]
  /** For each question, the order its original option indexes are shown in. */
  optionOrder: number[][]
}

/**
 * Weighted sampling without replacement (Efraimidis–Spirakis), stratified by
 * difficulty, with a per-title cap. Falls back gracefully when a stratum or the
 * fresh pool runs dry, so it always returns min(n, pool) questions.
 */
export function sampleQuestions(pool: Question[], opts: SampleOpts): Sampled {
  const rand = mulberry32(opts.seed)
  const cap = opts.perTitleCap ?? Infinity
  const avoid = opts.avoid ?? new Set<string>()

  const keyed = pool
    .map((q) => {
      const w = Math.max(0.01, opts.weightOf(q)) * (avoid.has(q.id) ? 0.05 : 1)
      return { q, key: Math.pow(rand(), 1 / w) }
    })
    .sort((a, b) => b.key - a.key)

  const picked: Question[] = []
  const perTitle = new Map<string, number>()
  const take = (q: Question) => {
    picked.push(q)
    perTitle.set(q.titleId, (perTitle.get(q.titleId) ?? 0) + 1)
  }
  const fits = (q: Question) => !picked.includes(q) && (perTitle.get(q.titleId) ?? 0) < cap

  // 1) fill each difficulty stratum
  if (opts.mix) {
    for (const [diff, k] of Object.entries(opts.mix) as [Difficulty, number][]) {
      let got = 0
      for (const { q } of keyed) {
        if (got >= k || picked.length >= opts.n) break
        if (q.difficulty === diff && fits(q)) {
          take(q)
          got++
        }
      }
    }
  }
  // 2) top up from anything that respects the cap
  for (const { q } of keyed) {
    if (picked.length >= opts.n) break
    if (fits(q)) take(q)
  }
  // 3) last resort: ignore the cap (tiny pools, e.g. a single-title quiz)
  for (const { q } of keyed) {
    if (picked.length >= opts.n) break
    if (!picked.includes(q)) take(q)
  }

  const ordered = shuffle(picked, rand)
  return {
    questionIds: ordered.map((q) => q.id),
    optionOrder: ordered.map((q) => shuffle(q.options.map((_, i) => i), rand)),
  }
}

export interface GradeInput {
  question: Question
  /** Original option index chosen, or null for a timeout. */
  choice: number | null
  elapsedMs: number
  combo: number
  usedFifty: boolean
  usedHint: boolean
  limitMs?: number
}

export interface Graded {
  correct: boolean
  timedOut: boolean
  points: number
  nextCombo: number
}

export function grade(input: GradeInput): Graded {
  const limit = input.limitMs ?? TIME_LIMIT_MS
  const timedOut = input.choice === null || input.elapsedMs > limit + GRACE_MS
  const correct = !timedOut && input.choice === input.question.answer
  if (!correct) return { correct: false, timedOut, points: 0, nextCombo: 1 }

  let base: number = BASE_POINTS[input.question.difficulty]
  if (input.usedFifty) base = Math.round(base / 2)
  const timeBonus = Math.round(50 * Math.max(0, 1 - Math.min(input.elapsedMs, limit) / limit))
  const hintPenalty = input.usedHint ? 25 : 0
  const points = Math.max(0, (base + timeBonus - hintPenalty) * input.combo)
  return { correct: true, timedOut: false, points, nextCombo: Math.min(input.combo + 1, COMBO_CAP) }
}

/** Two wrong option indexes to hide for a 50/50 (deterministic per question). */
export function fiftyFifty(q: Question, seed: number): number[] {
  const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answer)
  return shuffle(wrong, mulberry32(seed ^ hashSeed(q.id))).slice(0, 2)
}

export function hintFor(q: Question): string {
  const ans = q.options[q.answer]
  const first = ans.replace(/^[^A-Za-z0-9]+/, '')[0] ?? '?'
  const words = ans.split(/\s+/).length
  return `The answer starts with "${first.toUpperCase()}" and is ${words} word${words === 1 ? '' : 's'} long.`
}
