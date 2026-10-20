import { describe, it, expect } from 'vitest'
import {
  calculateSusScore,
  getSusGrade,
  getSusLabel,
  median,
  computeSusStats,
} from '../src/lib/susCalculator'
import type { SusAnswer, SusResponse } from '../src/types'

// ─── calculateSusScore ───────────────────────────────────────────────────────

describe('calculateSusScore', () => {
  it('calculates correct score for all-max responses (5,1,5,1,5,1,5,1,5,1 → 100)', () => {
    const answers: SusAnswer[] = [5, 1, 5, 1, 5, 1, 5, 1, 5, 1]
    expect(calculateSusScore(answers)).toBe(100)
  })

  it('calculates correct score for all-min responses (1,5,1,5,1,5,1,5,1,5 → 0)', () => {
    const answers: SusAnswer[] = [1, 5, 1, 5, 1, 5, 1, 5, 1, 5]
    expect(calculateSusScore(answers)).toBe(0)
  })

  it('calculates correct score for all-neutral responses (3,3,3,3,3,3,3,3,3,3 → 50)', () => {
    const answers: SusAnswer[] = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    expect(calculateSusScore(answers)).toBe(50)
  })

  it('calculates known example: (4,1,4,1,4,1,4,1,4,1) → 90', () => {
    // Odd: 4-1=3 each (×5 = 15), Even: 5-1=4 each (×5 = 20) → 35 × 2.5 = 87.5
    const answers: SusAnswer[] = [4, 1, 4, 1, 4, 1, 4, 1, 4, 1]
    expect(calculateSusScore(answers)).toBe(87.5)
  })

  it('calculates known SUS example: (4,2,4,1,4,2,4,1,5,1) → 85', () => {
    // Q1(4) odd:  4-1=3
    // Q2(2) even: 5-2=3
    // Q3(4) odd:  4-1=3
    // Q4(1) even: 5-1=4
    // Q5(4) odd:  4-1=3
    // Q6(2) even: 5-2=3
    // Q7(4) odd:  4-1=3
    // Q8(1) even: 5-1=4
    // Q9(5) odd:  5-1=4
    // Q10(1) even:5-1=4
    // sum=34, ×2.5=85
    const answers: SusAnswer[] = [4, 2, 4, 1, 4, 2, 4, 1, 5, 1]
    expect(calculateSusScore(answers)).toBe(85)
  })

  it('throws error for fewer than 10 answers', () => {
    const answers: SusAnswer[] = [3, 3, 3, 3, 3]
    expect(() => calculateSusScore(answers)).toThrow('10 jawaban')
  })

  it('throws error for more than 10 answers', () => {
    const answers = Array(11).fill(3) as SusAnswer[]
    expect(() => calculateSusScore(answers)).toThrow('10 jawaban')
  })

  it('throws error for answer value 0', () => {
    const answers = [0, 3, 3, 3, 3, 3, 3, 3, 3, 3] as unknown as SusAnswer[]
    expect(() => calculateSusScore(answers)).toThrow('tidak valid')
  })

  it('throws error for answer value 6', () => {
    const answers = [6, 3, 3, 3, 3, 3, 3, 3, 3, 3] as unknown as SusAnswer[]
    expect(() => calculateSusScore(answers)).toThrow('tidak valid')
  })

  it('returns value in range 0–100', () => {
    const answers: SusAnswer[] = [4, 2, 4, 3, 4, 2, 4, 2, 4, 2]
    const score = calculateSusScore(answers)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('score is a multiple of 2.5', () => {
    const answers: SusAnswer[] = [4, 2, 4, 3, 4, 2, 4, 2, 4, 2]
    const score = calculateSusScore(answers)
    expect(score % 2.5).toBe(0)
  })
})

// ─── getSusGrade ─────────────────────────────────────────────────────────────

describe('getSusGrade', () => {
  it('returns A for score ≥90', () => {
    expect(getSusGrade(90)).toBe('A')
    expect(getSusGrade(100)).toBe('A')
    expect(getSusGrade(95)).toBe('A')
  })

  it('returns B for 80 ≤ score < 90', () => {
    expect(getSusGrade(80)).toBe('B')
    expect(getSusGrade(85)).toBe('B')
    expect(getSusGrade(89.9)).toBe('B')
  })

  it('returns C for 70 ≤ score < 80', () => {
    expect(getSusGrade(70)).toBe('C')
    expect(getSusGrade(75)).toBe('C')
  })

  it('returns D for 60 ≤ score < 70', () => {
    expect(getSusGrade(60)).toBe('D')
    expect(getSusGrade(65)).toBe('D')
  })

  it('returns F for score < 60', () => {
    expect(getSusGrade(59)).toBe('F')
    expect(getSusGrade(0)).toBe('F')
    expect(getSusGrade(50)).toBe('F')
  })
})

// ─── getSusLabel ─────────────────────────────────────────────────────────────

describe('getSusLabel', () => {
  it('returns correct labels', () => {
    expect(getSusLabel(95)).toBe('Terbaik')
    expect(getSusLabel(85)).toBe('Sangat Baik')
    expect(getSusLabel(75)).toBe('Baik')
    expect(getSusLabel(65)).toBe('Cukup')
    expect(getSusLabel(55)).toBe('Buruk')
    expect(getSusLabel(30)).toBe('Tidak Dapat Diterima')
  })
})

// ─── median ──────────────────────────────────────────────────────────────────

describe('median', () => {
  it('returns null for empty array', () => {
    expect(median([])).toBeNull()
  })

  it('returns single value for array of length 1', () => {
    expect(median([75])).toBe(75)
  })

  it('returns middle value for odd-length array', () => {
    expect(median([60, 70, 80])).toBe(70)
    expect(median([55, 70, 85, 90, 95])).toBe(85)
  })

  it('returns average of two middle values for even-length array', () => {
    expect(median([60, 80])).toBe(70)
    expect(median([60, 70, 80, 90])).toBe(75)
  })

  it('sorts array before calculating', () => {
    expect(median([90, 60, 70, 80])).toBe(75)
  })
})

// ─── computeSusStats ─────────────────────────────────────────────────────────

describe('computeSusStats', () => {
  it('returns null stats for empty array', () => {
    const stats = computeSusStats([])
    expect(stats.count).toBe(0)
    expect(stats.mean).toBeNull()
    expect(stats.median).toBeNull()
    expect(stats.min).toBeNull()
    expect(stats.max).toBeNull()
  })

  it('calculates correct mean', () => {
    const responses = [70, 80, 90].map(score => makeResponse(score))
    const stats = computeSusStats(responses)
    expect(stats.mean).toBe(80)
  })

  it('calculates correct min and max', () => {
    const responses = [55, 72.5, 85, 92.5].map(score => makeResponse(score))
    const stats = computeSusStats(responses)
    expect(stats.min).toBe(55)
    expect(stats.max).toBe(92.5)
  })

  it('distribution covers all ranges', () => {
    const responses = [25, 55, 65, 75, 85, 95].map(makeResponse)
    const stats = computeSusStats(responses)
    expect(stats.distribution).toHaveLength(6)
    const total = stats.distribution.reduce((s, d) => s + d.count, 0)
    expect(total).toBe(responses.length)
  })

  it('grade distribution sums to response count', () => {
    const responses = [55, 65, 75, 85, 95].map(makeResponse)
    const stats = computeSusStats(responses)
    const total = stats.grades.reduce((s, g) => s + g.count, 0)
    expect(total).toBe(responses.length)
  })
})

// Helper
function makeResponse(score: number): SusResponse {
  return {
    id: `test_${score}`,
    respondentName: 'Test',
    respondentRole: 'Tester',
    timestamp: new Date().toISOString(),
    answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3] as SusAnswer[],
    score,
    phase: 'before',
  }
}
