import { describe, expect, it } from 'vitest'
import { QUESTIONS, QUESTION_BY_ID } from '../src/content/questions'
import { TITLE_BY_ID, TITLES, TRACKS } from '../src/content/catalog'
import { fiftyFifty, grade, hintFor, sampleQuestions } from '../src/server/services/quiz/engine'
import { rankFor, verdictFor } from '../src/shared/game'

const weightOf = (q: (typeof QUESTIONS)[number]) => TITLE_BY_ID.get(q.titleId)!.weight

describe('content', () => {
  it('every question has 4 unique options and one answer', () => {
    for (const q of QUESTIONS) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.answer).toBeGreaterThanOrEqual(0)
    }
  })
  it('question ids are unique', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })
  it('every track only references known titles', () => {
    for (const t of TRACKS) for (const id of t.titleIds) expect(TITLE_BY_ID.has(id)).toBe(true)
  })
  it('title ids are unique', () => {
    expect(new Set(TITLES.map((t) => t.id)).size).toBe(TITLES.length)
  })
})

describe('sampler', () => {
  const opts = { seed: 42, n: 20, mix: { easy: 6, medium: 9, hard: 5 }, perTitleCap: 2, weightOf }

  it('is deterministic for a seed', () => {
    expect(sampleQuestions(QUESTIONS, opts)).toEqual(sampleQuestions(QUESTIONS, opts))
  })
  it('differs across seeds', () => {
    const a = sampleQuestions(QUESTIONS, opts).questionIds
    const b = sampleQuestions(QUESTIONS, { ...opts, seed: 7 }).questionIds
    expect(a).not.toEqual(b)
  })
  it('returns n unique questions and respects the per-title cap', () => {
    const s = sampleQuestions(QUESTIONS, opts)
    expect(s.questionIds).toHaveLength(20)
    expect(new Set(s.questionIds).size).toBe(20)
    const per = new Map<string, number>()
    for (const id of s.questionIds) {
      const t = QUESTION_BY_ID.get(id)!.titleId
      per.set(t, (per.get(t) ?? 0) + 1)
    }
    expect(Math.max(...per.values())).toBeLessThanOrEqual(2)
  })
  it('option order is a permutation of the original indexes', () => {
    const s = sampleQuestions(QUESTIONS, opts)
    for (const order of s.optionOrder) expect([...order].sort()).toEqual([0, 1, 2, 3])
  })
  it('avoids recently seen questions when the pool allows', () => {
    const first = sampleQuestions(QUESTIONS, opts).questionIds
    const second = sampleQuestions(QUESTIONS, { ...opts, seed: 43, avoid: new Set(first) }).questionIds
    const overlap = second.filter((id) => first.includes(id)).length
    expect(overlap).toBeLessThanOrEqual(3)
  })
  it('handles a pool smaller than n', () => {
    const pool = QUESTIONS.filter((q) => q.titleId === 'eternals')
    expect(sampleQuestions(pool, { ...opts, n: 5 }).questionIds).toHaveLength(pool.length)
  })
})

describe('grader', () => {
  const q = QUESTION_BY_ID.get('loki-s1-1')! // easy
  it('awards base + time bonus × combo', () => {
    const g = grade({ question: q, choice: q.answer, elapsedMs: 0, combo: 2, usedFifty: false, usedHint: false })
    expect(g).toEqual({ correct: true, timedOut: false, points: (100 + 50) * 2, nextCombo: 3 })
  })
  it('caps combo at 5', () => {
    expect(grade({ question: q, choice: q.answer, elapsedMs: 5000, combo: 5, usedFifty: false, usedHint: false }).nextCombo).toBe(5)
  })
  it('wrong answer resets combo and scores 0', () => {
    const wrong = (q.answer + 1) % 4
    expect(grade({ question: q, choice: wrong, elapsedMs: 1000, combo: 4, usedFifty: false, usedHint: false })).toMatchObject({ correct: false, points: 0, nextCombo: 1 })
  })
  it('times out after limit + grace', () => {
    expect(grade({ question: q, choice: q.answer, elapsedMs: 22_900, combo: 1, usedFifty: false, usedHint: false }).correct).toBe(true)
    expect(grade({ question: q, choice: q.answer, elapsedMs: 23_100, combo: 1, usedFifty: false, usedHint: false }).timedOut).toBe(true)
  })
  it('lifelines reduce points', () => {
    const g = grade({ question: q, choice: q.answer, elapsedMs: 20_000, combo: 1, usedFifty: true, usedHint: true })
    expect(g.points).toBe(50 - 25)
  })
  it('50/50 never removes the answer', () => {
    for (let s = 0; s < 50; s++) {
      const removed = fiftyFifty(q, s)
      expect(removed).toHaveLength(2)
      expect(removed).not.toContain(q.answer)
    }
  })
  it('hint never contains the full answer', () => {
    expect(hintFor(q)).not.toContain(q.options[q.answer])
  })
})

describe('rules', () => {
  it('READY needs 80%', () => {
    expect(verdictFor(16, 20).ready).toBe(true)
    expect(verdictFor(15, 20).ready).toBe(false)
    expect(verdictFor(4, 5).ready).toBe(true)
  })
  it('ranks by threshold', () => {
    expect(rankFor(0).id).toBe('civilian')
    expect(rankFor(5999).id).toBe('agent')
    expect(rankFor(6000).id).toBe('avenger')
    expect(rankFor(99999).id).toBe('multiverse-legend')
  })
})
