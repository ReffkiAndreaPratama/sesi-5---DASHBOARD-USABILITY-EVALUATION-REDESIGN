/**
 * Modul perhitungan System Usability Scale (SUS).
 *
 * Referensi:
 *   Brooke, J. (1996). SUS: A "quick and dirty" usability scale.
 *   Dalam P. W. Jordan et al. (Eds.), Usability Evaluation in Industry (hal. 189–194).
 *   Taylor & Francis.
 *
 *   Bangor, A., Kortum, P. T., & Miller, J. T. (2008).
 *   An Empirical Evaluation of the System Usability Scale.
 *   International Journal of Human-Computer Interaction, 24(6), 574–594.
 */

import type { SusAnswer, SusResponse, SusStats } from '../types'

/**
 * Menghitung skor SUS dari 10 jawaban.
 *
 * Aturan:
 * - Butir ganjil (1,3,5,7,9): kontribusi = jawaban − 1
 * - Butir genap (2,4,6,8,10): kontribusi = 5 − jawaban
 * - Skor SUS = jumlah kontribusi × 2,5  →  rentang 0–100
 *
 * @param answers Array 10 jawaban (SusAnswer = 1|2|3|4|5), index 0 = Q1
 * @returns Skor SUS (0–100)
 * @throws Error jika jumlah jawaban bukan 10 atau ada jawaban di luar 1–5
 */
export function calculateSusScore(answers: SusAnswer[]): number {
  if (answers.length !== 10) {
    throw new Error(`SUS membutuhkan tepat 10 jawaban; diterima ${answers.length}.`)
  }

  for (let i = 0; i < answers.length; i++) {
    const a = answers[i]
    if (a < 1 || a > 5 || !Number.isInteger(a)) {
      throw new Error(`Jawaban Q${i + 1} tidak valid: ${a}. Nilai harus berupa bilangan bulat 1–5.`)
    }
  }

  let total = 0
  for (let i = 0; i < 10; i++) {
    const answer = answers[i]
    // Indeks 0,2,4,6,8 → butir ganjil → positif
    const contribution = i % 2 === 0 ? answer - 1 : 5 - answer
    total += contribution
  }

  return total * 2.5
}

/**
 * Mengembalikan grade SUS berdasarkan skor.
 *
 * Skala berdasarkan Bangor et al. (2008):
 * ≥90: A (Sempurna), ≥80: B (Sangat Baik), ≥70: C (Baik), ≥60: D (Cukup), <60: F (Buruk/Tidak Dapat Diterima)
 */
export function getSusGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

/**
 * Mengembalikan label verbal skor SUS (berdasarkan Bangor et al., 2008).
 */
export function getSusLabel(score: number): string {
  if (score >= 90) return 'Terbaik'
  if (score >= 80) return 'Sangat Baik'
  if (score >= 70) return 'Baik'
  if (score >= 60) return 'Cukup'
  if (score >= 50) return 'Buruk'
  return 'Tidak Dapat Diterima'
}

/**
 * Menghitung median dari array angka.
 */
export function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Menghitung statistik agregat dari kumpulan respons SUS.
 */
export function computeSusStats(responses: SusResponse[]): SusStats {
  if (responses.length === 0) {
    return {
      count: 0,
      mean: null,
      median: null,
      min: null,
      max: null,
      distribution: buildDistribution([]),
      grades: buildGradeDistribution([]),
    }
  }

  const scores = responses.map(r => r.score)
  const sum = scores.reduce((a, b) => a + b, 0)

  return {
    count: scores.length,
    mean: Math.round((sum / scores.length) * 10) / 10,
    median: median(scores),
    min: Math.min(...scores),
    max: Math.max(...scores),
    distribution: buildDistribution(scores),
    grades: buildGradeDistribution(scores),
  }
}

function buildDistribution(scores: number[]): { range: string; count: number }[] {
  const ranges = [
    { range: '0–49',   min: 0,  max: 49  },
    { range: '50–59',  min: 50, max: 59  },
    { range: '60–69',  min: 60, max: 69  },
    { range: '70–79',  min: 70, max: 79  },
    { range: '80–89',  min: 80, max: 89  },
    { range: '90–100', min: 90, max: 100 },
  ]
  return ranges.map(r => ({
    range: r.range,
    count: scores.filter(s => s >= r.min && s <= r.max).length,
  }))
}

function buildGradeDistribution(scores: number[]): { grade: string; count: number }[] {
  const gradeLabels = ['A', 'B', 'C', 'D', 'F']
  return gradeLabels.map(g => ({
    grade: g,
    count: scores.filter(s => getSusGrade(s) === g).length,
  }))
}
