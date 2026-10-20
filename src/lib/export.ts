/**
 * Modul ekspor data ke format CSV dan JSON.
 * Berjalan sepenuhnya di sisi klien menggunakan Blob API.
 */

import type { SusResponse, UsabilityIssue } from '../types'
import { getSusGrade, getSusLabel } from './susCalculator'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function rowToCSV(cells: (string | number | null | undefined)[]): string {
  return cells.map(escapeCSV).join(',')
}

// ─── SUS Export ──────────────────────────────────────────────────────────────

export function exportSusToCSV(responses: SusResponse[]): void {
  const headers = [
    'ID', 'Nama Responden', 'Peran', 'Waktu', 'Fase',
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
    'Skor SUS', 'Grade', 'Label',
  ]

  const rows = responses.map(r => rowToCSV([
    r.id,
    r.respondentName,
    r.respondentRole,
    r.timestamp,
    r.phase,
    ...r.answers,
    r.score,
    getSusGrade(r.score),
    getSusLabel(r.score),
  ]))

  const csv = [rowToCSV(headers), ...rows].join('\n')
  downloadFile(`sus_responses_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;')
}

export function exportSusToJSON(responses: SusResponse[]): void {
  const enriched = responses.map(r => ({
    ...r,
    grade: getSusGrade(r.score),
    label: getSusLabel(r.score),
  }))
  const json = JSON.stringify(enriched, null, 2)
  downloadFile(`sus_responses_${Date.now()}.json`, json, 'application/json')
}

// ─── Issues Export ────────────────────────────────────────────────────────────

export function exportIssuesToCSV(issues: UsabilityIssue[]): void {
  const headers = ['ID', 'Kategori', 'Keparahan', 'Deskripsi', 'Rekomendasi', 'Waktu']
  const rows = issues.map(i => rowToCSV([
    i.id, i.category, i.severity, i.description, i.recommendation, i.timestamp,
  ]))
  const csv = [rowToCSV(headers), ...rows].join('\n')
  downloadFile(`issues_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;')
}

export function exportIssuesToJSON(issues: UsabilityIssue[]): void {
  const json = JSON.stringify(issues, null, 2)
  downloadFile(`issues_${Date.now()}.json`, json, 'application/json')
}

// ─── Combined Report ──────────────────────────────────────────────────────────

export interface ReportData {
  exportedAt: string
  susResponses: SusResponse[]
  issues: UsabilityIssue[]
}

export function exportFullReportJSON(data: ReportData): void {
  const json = JSON.stringify(data, null, 2)
  downloadFile(`usabilitylab_report_${Date.now()}.json`, json, 'application/json')
}
