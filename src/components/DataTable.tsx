import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, SearchX } from 'lucide-react'

type SortDirection = 'asc' | 'desc' | null

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  emptyMessage?: string
  'aria-label'?: string
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = 'Tidak ada data yang cocok.',
  'aria-label': ariaLabel,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data
    return [...data].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va === vb) return 0
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va
      }
      const sa = String(va ?? '').toLowerCase()
      const sb = String(vb ?? '').toLowerCase()
      return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  function toggleSort(key: keyof T) {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
    else if (sortDir === 'asc') setSortDir('desc')
    else { setSortKey(null); setSortDir(null) }
    setPage(1)
  }

  function SortIcon({ colKey }: { colKey: keyof T }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-gray-400" />
    if (sortDir === 'asc') return <ChevronUp size={13} className="text-primary-600" />
    return <ChevronDown size={13} className="text-primary-600" />
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100 text-sm" aria-label={ariaLabel}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${col.className ?? ''}`}
                >
                  {col.sortable ? (
                    <button
                      className="flex items-center gap-1 hover:text-gray-900 focus:outline-none"
                      onClick={() => toggleSort(col.key)}
                      aria-label={`Urutkan berdasarkan ${col.label}`}
                    >
                      {col.label}
                      <SortIcon colKey={col.key} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <SearchX size={32} className="text-gray-300" />
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50 transition-colors">
                  {columns.map(col => {
                    const val = row[col.key]
                    return (
                      <td key={String(col.key)} className={`px-4 py-3 text-gray-700 ${col.className ?? ''}`}>
                        {col.render ? col.render(val, row) : String(val ?? '—')}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>
            Menampilkan {((safePage - 1) * pageSize) + 1}–
            {Math.min(safePage * pageSize, sorted.length)} dari {sorted.length} data
          </span>
          <div className="flex gap-1">
            <button
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Halaman sebelumnya"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - safePage) <= 2)
              .map(p => (
                <button
                  key={p}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium
                    ${p === safePage
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setPage(p)}
                  aria-label={`Halaman ${p}`}
                  aria-current={p === safePage ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
            <button
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Halaman berikutnya"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
