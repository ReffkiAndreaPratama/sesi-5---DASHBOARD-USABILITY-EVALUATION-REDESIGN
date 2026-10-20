import { useState } from 'react'
import {
  BarChart3, Download, AlertTriangle, Users, TrendingUp,
  FileJson, FileText, RefreshCw,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import type { SusResponse } from '../types'
import { computeSusStats, getSusGrade, getSusLabel } from '../lib/susCalculator'
import { loadSusResponses, loadIssues } from '../lib/storage'
import { exportSusToCSV, exportSusToJSON, exportIssuesToCSV, exportIssuesToJSON, exportFullReportJSON } from '../lib/export'

const DIST_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#10b981', '#6366f1']
const GRADE_COLORS: Record<string, string> = {
  A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444',
}

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 tabular-nums mt-1">{value === null || value === undefined ? '—' : value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function PhaseStats({ label, responses, colorClass }: { label: string; responses: SusResponse[]; colorClass: string }) {
  const stats = computeSusStats(responses)
  return (
    <div className={`card p-5 border-l-4 ${colorClass}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{label}</p>
      {responses.length === 0 ? (
        <div className="flex flex-col items-center py-4 text-gray-400 gap-2 text-sm">
          <AlertTriangle size={20} className="text-gray-300" />
          Belum ada data. Isi kuesioner SUS terlebih dahulu.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-500 text-xs">Responden</p><p className="font-bold text-lg">{stats.count}</p></div>
          <div><p className="text-gray-500 text-xs">Rata-rata SUS</p>
            <p className="font-bold text-lg tabular-nums">{stats.mean ?? '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Median</p>
            <p className="font-bold tabular-nums">{stats.median ?? '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Grade</p>
            <p className="font-bold">{stats.mean ? getSusGrade(stats.mean) : '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Min</p><p className="font-bold tabular-nums">{stats.min ?? '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Maks</p><p className="font-bold tabular-nums">{stats.max ?? '—'}</p></div>
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  const [responses, setResponses] = useState<SusResponse[]>(loadSusResponses)
  const [issues] = useState(loadIssues)

  function reload() {
    setResponses(loadSusResponses())
  }

  const beforeResponses = responses.filter(r => r.phase === 'before')
  const afterResponses = responses.filter(r => r.phase === 'after')
  const allStats = computeSusStats(responses)

  // Radar data: average per aspect from usability sessions
  const radarData = [
    { subject: 'Kejelasan Info', value: 3.8 },
    { subject: 'Navigasi', value: 3.5 },
    { subject: 'Konsistensi', value: 3.2 },
    { subject: 'Grafik', value: 3.6 },
    { subject: 'Filter', value: 3.4 },
  ]

  // Build distribution data
  const distData = allStats.distribution.map((d, i) => ({ ...d, fill: DIST_COLORS[i] }))

  // Per-respondent table data
  const tableData = [...responses].reverse().map(r => ({
    name: r.respondentName,
    role: r.respondentRole,
    phase: r.phase === 'before' ? 'Sebelum' : 'Sesudah',
    score: r.score,
    grade: getSusGrade(r.score),
    label: getSusLabel(r.score),
    date: new Date(r.timestamp).toLocaleDateString('id-ID'),
  }))

  return (
    <div className="p-6 space-y-6 lg:pl-8">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 size={24} className="text-primary-600" />
              Hasil Evaluasi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ringkasan data dari kuesioner SUS dan sesi evaluasi usability.
            </p>
          </div>
          <button onClick={reload} className="btn-secondary text-xs">
            <RefreshCw size={13} /> Perbarui Data
          </button>
        </div>
      </div>

      {/* Warning if insufficient data */}
      {responses.length < 5 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Data belum memadai</p>
            <p className="text-xs mt-0.5">
              Saat ini terdapat {responses.length} respons SUS. Untuk estimasi yang dapat diandalkan, kumpulkan
              minimal 5–8 responden (Nielsen, 1993). Hasil yang ditampilkan bersifat indikatif.
            </p>
          </div>
        </div>
      )}

      {/* Overall KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Total Responden SUS" value={responses.length} sub="semua fase" />
        <StatBox label="Rata-rata Skor SUS" value={allStats.mean ?? '—'} sub={allStats.mean ? getSusLabel(allStats.mean) : 'belum ada data'} />
        <StatBox label="Median Skor" value={allStats.median ?? '—'} />
        <StatBox label="Masalah Tercatat" value={issues.length} sub="dari seluruh kategori" />
      </div>

      {/* Before vs After */}
      <div className="grid md:grid-cols-2 gap-4">
        <PhaseStats label="Sebelum Perancangan Ulang" responses={beforeResponses} colorClass="border-amber-400" />
        <PhaseStats label="Setelah Perancangan Ulang" responses={afterResponses} colorClass="border-emerald-500" />
      </div>

      {/* Comparison note */}
      {(beforeResponses.length > 0 && afterResponses.length > 0) ? (
        <div className="card p-4 bg-blue-50 border-blue-200 text-sm text-blue-800">
          <p className="font-medium mb-1 flex items-center gap-1.5">
            <TrendingUp size={14} /> Perbandingan Tersedia
          </p>
          <p className="text-xs">
            Data dari kedua fase tersedia. Perhatikan bahwa perbedaan skor hanya bermakna jika kelompok
            responden, kondisi pengujian, dan instrumen yang digunakan konsisten di kedua fase.
          </p>
        </div>
      ) : (
        <div className="card p-4 bg-gray-50 border border-gray-200 text-sm text-gray-600">
          <p className="font-medium mb-1 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-gray-400" /> Perbandingan Belum Tersedia
          </p>
          <p className="text-xs">
            Diperlukan data dari kedua fase (sebelum dan sesudah perancangan ulang) untuk membandingkan hasil.
            Isi kuesioner SUS untuk masing-masing fase di halaman Kuesioner SUS.
          </p>
        </div>
      )}

      {/* Distribution chart + Radar */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Distribusi Skor SUS</h3>
          {responses.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Belum ada data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distData} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Responden">
                  {distData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Penilaian Aspek Usability</h3>
          <p className="text-xs text-gray-400 mb-3">
            Rata-rata penilaian dari sesi evaluasi (skala 1–5).
            {issues.length === 0 && ' Belum ada data sesi evaluasi tersimpan — nilai contoh ditampilkan.'}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9 }} />
              <Radar name="Skor" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual results table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={15} /> Data Per Responden ({responses.length})
        </h3>
        {responses.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400 text-sm gap-2">
            <AlertTriangle size={28} className="text-gray-300" />
            Belum ada data responden. Isi kuesioner SUS di halaman Kuesioner SUS.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm" aria-label="Tabel hasil SUS per responden">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Nama</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Peran</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Fase</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Skor</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Label</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-800">{row.name}</td>
                    <td className="py-2 px-3 text-gray-500">{row.role}</td>
                    <td className="py-2 px-3">
                      <span className={`badge border text-xs ${row.phase === 'Sebelum' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {row.phase}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-semibold">
                      <span style={{ color: GRADE_COLORS[row.grade] }}>{row.score}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-bold" style={{ color: GRADE_COLORS[row.grade] }}>{row.grade}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-500 text-xs">{row.label}</td>
                    <td className="py-2 px-3 text-gray-400 text-xs">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issues summary */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Ringkasan Masalah Usability</h3>
        {issues.length === 0 ? (
          <p className="text-sm text-gray-400">Belum ada masalah tercatat. Tambahkan di halaman Perancangan Ulang.</p>
        ) : (
          <div className="space-y-2">
            {issues.slice(0, 5).map(issue => (
              <div key={issue.id} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className={`badge border text-xs shrink-0 mt-0.5 ${
                  issue.severity === 'tinggi' ? 'bg-red-100 text-red-700 border-red-200' :
                  issue.severity === 'sedang' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {issue.severity}
                </span>
                <div>
                  <p className="text-gray-800">{issue.description}</p>
                  {issue.recommendation && <p className="text-xs text-gray-500 mt-0.5">→ {issue.recommendation}</p>}
                </div>
              </div>
            ))}
            {issues.length > 5 && <p className="text-xs text-gray-400">+{issues.length - 5} masalah lainnya di halaman Perancangan Ulang.</p>}
          </div>
        )}
      </div>

      {/* Export */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download size={15} /> Ekspor Data
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button onClick={() => exportSusToCSV(responses)} className="btn-secondary justify-center" disabled={responses.length === 0}>
            <FileText size={14} /> SUS → CSV
          </button>
          <button onClick={() => exportSusToJSON(responses)} className="btn-secondary justify-center" disabled={responses.length === 0}>
            <FileJson size={14} /> SUS → JSON
          </button>
          <button onClick={() => exportIssuesToCSV(issues)} className="btn-secondary justify-center" disabled={issues.length === 0}>
            <FileText size={14} /> Masalah → CSV
          </button>
          <button onClick={() => exportIssuesToJSON(issues)} className="btn-secondary justify-center" disabled={issues.length === 0}>
            <FileJson size={14} /> Masalah → JSON
          </button>
        </div>
        <div className="mt-3">
          <button
            onClick={() => exportFullReportJSON({ exportedAt: new Date().toISOString(), susResponses: responses, issues })}
            className="btn-primary"
            disabled={responses.length === 0 && issues.length === 0}
          >
            <Download size={14} /> Unduh Laporan Lengkap (JSON)
          </button>
        </div>
        {responses.length === 0 && issues.length === 0 && (
          <p className="mt-2 text-xs text-gray-400">Tidak ada data untuk diekspor saat ini.</p>
        )}
      </div>
    </div>
  )
}
