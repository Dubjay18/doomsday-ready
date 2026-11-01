import { describe, expect, it } from 'vitest'
import { TITLES, TITLE_BY_ID, TRACKS } from '../src/content/catalog'
import { QUESTIONS } from '../src/content/questions'
import { LORE } from '../src/content/lore'
import { PHASES } from '../src/content/phases'
import { TRAILERS } from '../src/content/trailers'

describe('content', () => {
  it('has a trailer for every title and for Doomsday', () => {
    for (const t of TITLES) expect(TRAILERS[t.id], t.id).toMatch(/^[\w-]{11}$/)
    expect(TRAILERS.doomsday).toMatch(/^[\w-]{11}$/)
  })

  it('has no trailer ids for titles that do not exist', () => {
    for (const id of Object.keys(TRAILERS)) expect(id === 'doomsday' || TITLE_BY_ID.has(id), id).toBe(true)
  })

  it('puts every Marvel Studios title in exactly one phase, and only those', () => {
    const mcu = TITLES.filter((t) => t.universe === 'mcu')
    for (const t of mcu) expect(PHASES.some((p) => p.phase === t.phase), t.id).toBe(true)
    for (const t of TITLES.filter((x) => x.universe !== 'mcu')) expect(t.phase, t.id).toBeUndefined()
  })

  it('lists the Fox X-Men films in a track', () => {
    const fox = TITLES.filter((t) => t.universe === 'fox').map((t) => t.id)
    const legacy = TRACKS.find((t) => t.id === 'legacy')!
    for (const id of fox) expect(legacy.titleIds, id).toContain(id)
    expect(fox).toEqual(expect.arrayContaining(['x-men', 'x2', 'x-men-the-last-stand', 'x-men-first-class', 'x-men-days-of-future-past', 'logan']))
  })

  it('keeps the exam’s heavy titles stocked, including hard questions', () => {
    const byTitle = new Map<string, { n: number; hard: number }>()
    for (const q of QUESTIONS) {
      const row = byTitle.get(q.titleId) ?? { n: 0, hard: 0 }
      row.n++
      if (q.difficulty === 'hard') row.hard++
      byTitle.set(q.titleId, row)
    }
    for (const t of TITLES) {
      if (t.weight < 1) continue
      const row = byTitle.get(t.id) ?? { n: 0, hard: 0 }
      expect(row.n, t.id).toBeGreaterThanOrEqual(8)
      expect(row.hard, `${t.id} hard`).toBeGreaterThanOrEqual(2)
    }
    for (const id of ['deadpool-and-wolverine', 'captain-america-brave-new-world', 'spider-man-brand-new-day', 'falcon-and-the-winter-soldier']) {
      const row = byTitle.get(id) ?? { n: 0, hard: 0 }
      expect(row.n, id).toBeGreaterThanOrEqual(8)
      expect(row.hard, `${id} hard`).toBeGreaterThanOrEqual(2)
    }
    const shang = byTitle.get('shang-chi') ?? { n: 0, hard: 0 }
    expect(shang.n).toBeGreaterThanOrEqual(5)
    expect(shang.hard).toBeGreaterThanOrEqual(1)
    for (const id of [
      'visionquest',
      'guardians-holiday-special',
      'your-friendly-neighborhood-spider-man',
      'daredevil-born-again-s1',
      'ironheart',
      'eyes-of-wakanda',
      'wonder-man',
      'daredevil-born-again-s2',
    ]) {
      expect(byTitle.get(id)?.n ?? 0, id).toBeGreaterThanOrEqual(5)
    }
  })

  it('has unique lore ids that only link to real titles', () => {
    expect(new Set(LORE.map((l) => l.id)).size).toBe(LORE.length)
    for (const l of LORE) for (const id of l.titles ?? []) expect(TITLE_BY_ID.has(id), `${l.id} -> ${id}`).toBe(true)
  })
})
