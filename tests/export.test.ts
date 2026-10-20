import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportSusToCSV, exportSusToJSON, exportIssuesToCSV, exportIssuesToJSON } from '../src/lib/export'
import type { SusResponse, UsabilityIssue } from '../src/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Read a Blob as text using FileReader (works in jsdom). */
function blobToText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(blob)
  })
}

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockClick = vi.fn()
const mockRevoke = vi.fn()
let capturedBlob: Blob | null = null
let capturedFilename: string | null = null

beforeEach(() => {
  vi.clearAllMocks()
  capturedBlob = null
  capturedFilename = null

  globalThis.URL.createObjectURL = vi.fn((blob: Blob) => {
    capturedBlob = blob
    return 'blob:mock-url'
  })
  globalThis.URL.revokeObjectURL = mockRevoke

  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      const anchor = {
        href: '',
        download: '',
        click: mockClick,
      } as unknown as HTMLAnchorElement
      Object.defineProperty(anchor, 'download', {
        get: () => capturedFilename,
        set: (v: string) => { capturedFilename = v },
        configurable: true,
      })
      return anchor
    }
    // Fall through to real createElement for everything else
    return Object.getPrototypeOf(document).createElement.call(document, tag) as HTMLElement
  })
  vi.spyOn(document.body, 'appendChild').mockImplementation(node => node)
  vi.spyOn(document.body, 'removeChild').mockImplementation(node => node)
})

// ─── Fixtures ────────────────────────────────────────────────────────────────

const makeSusResponse = (id = 'r1'): SusResponse => ({
  id,
  respondentName: 'Budi',
  respondentRole: 'Mahasiswa',
  timestamp: '2024-06-01T10:00:00Z',
  answers: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2],
  score: 75,
  phase: 'before',
})

const makeIssue = (id = 'i1'): UsabilityIssue => ({
  id,
  category: 'navigasi',
  severity: 'sedang',
  description: 'Tidak ada breadcrumb',
  recommendation: 'Tambahkan breadcrumb',
  timestamp: '2024-06-01T10:00:00Z',
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('exportSusToCSV', () => {
  it('triggers file download', () => {
    exportSusToCSV([makeSusResponse()])
    expect(mockClick).toHaveBeenCalledOnce()
    expect(mockRevoke).toHaveBeenCalledOnce()
  })

  it('creates a CSV blob with correct MIME type', () => {
    exportSusToCSV([makeSusResponse()])
    expect(capturedBlob).not.toBeNull()
    expect(capturedBlob!.type).toContain('text/csv')
  })

  it('CSV contains header row', async () => {
    exportSusToCSV([makeSusResponse()])
    const text = await blobToText(capturedBlob!)
    expect(text).toContain('Nama Responden')
    expect(text).toContain('Skor SUS')
  })

  it('CSV contains response data', async () => {
    exportSusToCSV([makeSusResponse()])
    const text = await blobToText(capturedBlob!)
    expect(text).toContain('Budi')
    expect(text).toContain('75')
  })

  it('does nothing problematic with empty array', () => {
    exportSusToCSV([])
    expect(mockClick).toHaveBeenCalled()
  })
})

describe('exportSusToJSON', () => {
  it('triggers file download', () => {
    exportSusToJSON([makeSusResponse()])
    expect(mockClick).toHaveBeenCalledOnce()
  })

  it('creates a JSON blob with enriched data', async () => {
    exportSusToJSON([makeSusResponse()])
    expect(capturedBlob).not.toBeNull()
    const text = await blobToText(capturedBlob!)
    const parsed = JSON.parse(text)
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed[0]).toHaveProperty('grade')
    expect(parsed[0]).toHaveProperty('label')
    expect(parsed[0].score).toBe(75)
  })
})

describe('exportIssuesToCSV', () => {
  it('triggers file download', () => {
    exportIssuesToCSV([makeIssue()])
    expect(mockClick).toHaveBeenCalledOnce()
  })

  it('CSV contains issue data', async () => {
    exportIssuesToCSV([makeIssue()])
    const text = await blobToText(capturedBlob!)
    expect(text).toContain('breadcrumb')
    expect(text).toContain('navigasi')
  })
})

describe('exportIssuesToJSON', () => {
  it('creates valid JSON array', async () => {
    exportIssuesToJSON([makeIssue()])
    const text = await blobToText(capturedBlob!)
    const parsed = JSON.parse(text)
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed[0].id).toBe('i1')
  })
})
