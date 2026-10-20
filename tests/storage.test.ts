import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadSusResponses, saveSusResponse, deleteSusResponse, clearSusResponses,
  loadIssues, saveIssue, deleteIssue, clearIssues,
  loadUsabilitySessions, saveUsabilitySession, deleteUsabilitySession,
  generateId,
} from '../src/lib/storage'
import type { SusResponse, UsabilityIssue, UsabilitySession } from '../src/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

const makeSusResponse = (id = 'r1'): SusResponse => ({
  id,
  respondentName: 'Test User',
  respondentRole: 'Tester',
  timestamp: new Date().toISOString(),
  answers: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2],
  score: 75,
  phase: 'before',
})

const makeIssue = (id = 'i1'): UsabilityIssue => ({
  id,
  category: 'navigasi',
  severity: 'sedang',
  description: 'Masalah navigasi',
  recommendation: 'Perbaiki menu',
  timestamp: new Date().toISOString(),
})

const makeSession = (id = 's1'): UsabilitySession => ({
  id,
  respondentName: 'Test User',
  respondentRole: 'Tester',
  timestamp: new Date().toISOString(),
  tasks: [],
  ratings: {
    kejelasanInformasi: 4,
    kemudahanNavigasi: 3,
    konsistensiElemen: 4,
    keterbacaanGrafik: 3,
    kejelasanFilter: 4,
    komentarUmum: '',
  },
  phase: 'before',
})

describe('SUS storage', () => {
  beforeEach(() => { localStorageMock.clear() })

  it('loads empty array when no data stored', () => {
    expect(loadSusResponses()).toEqual([])
  })

  it('saves and loads a response', () => {
    const r = makeSusResponse()
    saveSusResponse(r)
    const loaded = loadSusResponses()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe('r1')
  })

  it('saves multiple responses', () => {
    saveSusResponse(makeSusResponse('r1'))
    saveSusResponse(makeSusResponse('r2'))
    expect(loadSusResponses()).toHaveLength(2)
  })

  it('replaces existing response with same id', () => {
    saveSusResponse(makeSusResponse('r1'))
    const updated = { ...makeSusResponse('r1'), score: 90 }
    saveSusResponse(updated)
    const loaded = loadSusResponses()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].score).toBe(90)
  })

  it('deletes a response by id', () => {
    saveSusResponse(makeSusResponse('r1'))
    saveSusResponse(makeSusResponse('r2'))
    deleteSusResponse('r1')
    const loaded = loadSusResponses()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe('r2')
  })

  it('clears all responses', () => {
    saveSusResponse(makeSusResponse('r1'))
    saveSusResponse(makeSusResponse('r2'))
    clearSusResponses()
    expect(loadSusResponses()).toEqual([])
  })
})

describe('Issues storage', () => {
  beforeEach(() => { localStorageMock.clear() })

  it('loads empty array when no data stored', () => {
    expect(loadIssues()).toEqual([])
  })

  it('saves and loads an issue', () => {
    saveIssue(makeIssue())
    expect(loadIssues()).toHaveLength(1)
  })

  it('replaces issue with same id', () => {
    saveIssue(makeIssue('i1'))
    saveIssue({ ...makeIssue('i1'), description: 'Updated' })
    const loaded = loadIssues()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].description).toBe('Updated')
  })

  it('deletes issue by id', () => {
    saveIssue(makeIssue('i1'))
    saveIssue(makeIssue('i2'))
    deleteIssue('i1')
    expect(loadIssues()).toHaveLength(1)
  })

  it('clears all issues', () => {
    saveIssue(makeIssue('i1'))
    clearIssues()
    expect(loadIssues()).toEqual([])
  })
})

describe('Usability sessions storage', () => {
  beforeEach(() => { localStorageMock.clear() })

  it('loads empty array when no data', () => {
    expect(loadUsabilitySessions()).toEqual([])
  })

  it('saves and loads a session', () => {
    saveUsabilitySession(makeSession())
    expect(loadUsabilitySessions()).toHaveLength(1)
  })

  it('deletes session by id', () => {
    saveUsabilitySession(makeSession('s1'))
    saveUsabilitySession(makeSession('s2'))
    deleteUsabilitySession('s1')
    expect(loadUsabilitySessions()).toHaveLength(1)
    expect(loadUsabilitySessions()[0].id).toBe('s2')
  })
})

describe('generateId', () => {
  it('generates unique IDs', () => {
    const a = generateId('x')
    const b = generateId('x')
    expect(a).not.toBe(b)
  })

  it('uses given prefix', () => {
    expect(generateId('sus')).toMatch(/^sus_/)
  })
})
