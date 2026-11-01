import { describe, expect, it } from 'vitest'
import { renderShareCard } from '../src/server/og/card-png'
import { stampLabel } from '../src/shared/game'

describe('share card', () => {
  it('uses the same stamp words as the verdict page', () => {
    expect(stampLabel('exam', 'READY!', true, 80)).toBe('READY!')
    expect(stampLabel('exam', 'YOU ARE THE MULTIVERSE', true, 100)).toBe('YOU ARE THE MULTIVERSE')
    expect(stampLabel('title', 'YOU ARE THE MULTIVERSE', true, 100)).toBe('NAILED IT!')
    expect(stampLabel('daily', 'SIDEKICK', false, 60)).toBe('NOT BAD!')
    expect(stampLabel('title', 'CIVILIAN', false, 20)).toBe('OOF!')
  })

  it('renders a 1200x630 PNG and does not embed the name as readable text', () => {
    const png = renderShareCard({
      name: 'GAMORA',
      stamp: 'YOU ARE THE MULTIVERSE',
      scoreLine: '20/20  100%',
      rankLine: 'RANK AVENGER',
      kicker: 'READINESS EXAM',
      ready: true,
      pct: 100,
    })
    expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
    expect(png[24]).toBe(8)
    expect(png[25]).toBe(2)
    expect(png.includes(Buffer.from('GAMORA'))).toBe(false)
    expect(png.includes(Buffer.from('explanation'))).toBe(false)
  })
})
