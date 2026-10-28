import { describe, expect, it } from 'vitest'
import { TITLES, TITLE_BY_ID, TRACKS } from '../src/content/catalog'
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

  it('has unique lore ids that only link to real titles', () => {
    expect(new Set(LORE.map((l) => l.id)).size).toBe(LORE.length)
    for (const l of LORE) for (const id of l.titles ?? []) expect(TITLE_BY_ID.has(id), `${l.id} -> ${id}`).toBe(true)
  })
})
