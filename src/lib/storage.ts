/**
 * Lapisan penyimpanan berbasis localStorage.
 * Semua fungsi aman terhadap lingkungan yang tidak mendukung localStorage (misalnya SSR / jsdom tanpa setup).
 */

import type { SusResponse, UsabilitySession, UsabilityIssue } from '../types'
import { STORAGE_KEYS } from '../types'

// ─── Generic helpers ─────────────────────────────────────────────────────────

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

function save<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Storage quota exceeded or unavailable — silently ignore in demo mode
  }
}

// ─── SUS Responses ───────────────────────────────────────────────────────────

export function loadSusResponses(): SusResponse[] {
  return load<SusResponse>(STORAGE_KEYS.SUS_RESPONSES)
}

export function saveSusResponse(response: SusResponse): void {
  const existing = loadSusResponses()
  // Replace if same id, otherwise append
  const idx = existing.findIndex(r => r.id === response.id)
  if (idx >= 0) {
    existing[idx] = response
  } else {
    existing.push(response)
  }
  save(STORAGE_KEYS.SUS_RESPONSES, existing)
}

export function deleteSusResponse(id: string): void {
  const existing = loadSusResponses().filter(r => r.id !== id)
  save(STORAGE_KEYS.SUS_RESPONSES, existing)
}

export function clearSusResponses(): void {
  save(STORAGE_KEYS.SUS_RESPONSES, [])
}

// ─── Usability Sessions ───────────────────────────────────────────────────────

export function loadUsabilitySessions(): UsabilitySession[] {
  return load<UsabilitySession>(STORAGE_KEYS.USABILITY_SESSIONS)
}

export function saveUsabilitySession(session: UsabilitySession): void {
  const existing = loadUsabilitySessions()
  const idx = existing.findIndex(s => s.id === session.id)
  if (idx >= 0) {
    existing[idx] = session
  } else {
    existing.push(session)
  }
  save(STORAGE_KEYS.USABILITY_SESSIONS, existing)
}

export function deleteUsabilitySession(id: string): void {
  const existing = loadUsabilitySessions().filter(s => s.id !== id)
  save(STORAGE_KEYS.USABILITY_SESSIONS, existing)
}

// ─── Issues ───────────────────────────────────────────────────────────────────

export function loadIssues(): UsabilityIssue[] {
  return load<UsabilityIssue>(STORAGE_KEYS.ISSUES)
}

export function saveIssue(issue: UsabilityIssue): void {
  const existing = loadIssues()
  const idx = existing.findIndex(i => i.id === issue.id)
  if (idx >= 0) {
    existing[idx] = issue
  } else {
    existing.push(issue)
  }
  save(STORAGE_KEYS.ISSUES, existing)
}

export function deleteIssue(id: string): void {
  const existing = loadIssues().filter(i => i.id !== id)
  save(STORAGE_KEYS.ISSUES, existing)
}

export function clearIssues(): void {
  save(STORAGE_KEYS.ISSUES, [])
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Generates a simple collision-resistant ID (not UUID v4, sufficient for localStorage demo). */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
