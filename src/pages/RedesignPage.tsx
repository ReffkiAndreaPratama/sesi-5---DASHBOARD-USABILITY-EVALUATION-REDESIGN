import { useState } from 'react'
import {
  Layers, Users, Target, Pencil, TestTube, Plus, Trash2,
  ChevronRight, AlertTriangle, CheckCircle2, ArrowRight,
  BarChart3, TrendingUp, Filter as FilterIcon,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import type { UsabilityIssue, IssueCategory, IssueSeverity } from '../types'
import { loadIssues, saveIssue, deleteIssue, generateId } from '../lib/storage'
import { EXAMPLE_ISSUES, MONTHLY_TREND } from '../data/demoData'

const STAGE_ICONS = [Users, Target, Pencil, TestTube]
const STAGE_COLORS = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700']

const SEVERITY_COLORS: Record<IssueSeverity, string> = {
  rendah: 'bg-gray-100 text-gray-700 border-gray-200',
  sedang: 'bg-amber-100 text-amber-700 border-amber-200',
  tinggi: 'bg-red-100 text-red-700 border-red-200',
}
const CATEGORY_LABELS: Record<IssueCategory, string> = {
  navigasi: 'Navigasi', keterbacaan: 'Keterbacaan',
  konsistensi: 'Konsistensi', visualisasi: 'Visualisasi', lainnya: 'Lainnya',
}

// Redesigned dashboard demo data
const REDESIGN_MONTHLY = MONTHLY_TREND.map(m => ({ ...m, revenue: m.revenue * 1.0 }))
const REDESIGN_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const UCD_STAGES = [
  {
    id: 1, name: 'Memahami Pengguna', icon: 0,
    description: 'Identifikasi profil pengguna, tujuan penggunaan, dan masalah yang dialami saat menggunakan dashboard awal.',
    items: ['Mahasiswa/peneliti yang menganalisis data', 'Analis bisnis yang membaca laporan harian', 'Manajer yang membutuhkan ringkasan cepat'],
    label: 'Jenis Pengguna',
  },
  {
    id: 2, name: 'Menentukan Kebutuhan', icon: 1,
    description: 'Kelompokkan masalah dari evaluasi dan tentukan kebutuhan utama yang harus dipenuhi desain baru.',
    items: ['Navigasi yang jelas dengan indikator halaman aktif', 'Grafik yang dipilih sesuai jenis data', 'Label dan tooltip yang mudah dibaca', 'Filter yang responsif dan mudah digunakan'],
    label: 'Kebutuhan Utama',
  },
  {
    id: 3, name: 'Membuat Rancangan', icon: 2,
    description: 'Terapkan perbaikan berdasarkan kebutuhan yang teridentifikasi. Lihat perbandingan dashboard di bawah.',
    items: ['Hierarki informasi diperjelas dengan stat card', 'Line chart untuk tren (bukan pie chart)', 'Filter dikelompokkan dalam satu panel', 'Warna dan tipografi konsisten'],
    label: 'Perbaikan Diterapkan',
  },
  {
    id: 4, name: 'Pengujian', icon: 3,
    description: 'Uji kembali rancangan baru dengan pengguna. Bandingkan skor SUS dan hasil tugas sebelum/sesudah.',
    items: ['Isi kuesioner SUS di halaman Kuesioner SUS', 'Catat sesi evaluasi di halaman Evaluasi Usability', 'Lihat perbandingan skor di halaman Hasil Evaluasi'],
    label: 'Langkah Pengujian',
  },
]

export default function RedesignPage() {
  const [activeStage, setActiveStage] = useState(0)
  const [issues, setIssues] = useState<UsabilityIssue[]>(() => {
    const stored = loadIssues()
    return stored.length > 0 ? stored : EXAMPLE_ISSUES
  })
  const [showForm, setShowForm] = useState(false)
  const [newIssue, setNewIssue] = useState({
    category: 'navigasi' as IssueCategory,
    severity: 'sedang' as IssueSeverity,
    description: '',
    recommendation: '',
  })
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before')

  function handleAddIssue() {
    if (!newIssue.description.trim()) { alert('Harap isi deskripsi masalah.'); return }
    const issue: UsabilityIssue = {
      id: generateId('issue'),
      ...newIssue,
      timestamp: new Date().toISOString(),
    }
    saveIssue(issue)
    setIssues(loadIssues())
    setNewIssue({ category: 'navigasi', severity: 'sedang', description: '', recommendation: '' })
    setShowForm(false)
  }

  function handleDeleteIssue(id: string) {
    if (!confirm('Hapus masalah ini?')) return
    deleteIssue(id)
    setIssues(loadIssues())
  }

  const categoryCounts = (['navigasi', 'keterbacaan', 'konsistensi', 'visualisasi', 'lainnya'] as IssueCategory[]).map(cat => ({
    name: CATEGORY_LABELS[cat],
    count: issues.filter(i => i.category === cat).length,
  })).filter(c => c.count > 0)

  return (
    <div className="p-6 space-y-6 lg:pl-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Layers size={24} className="text-primary-600" />
          Perancangan Ulang dengan User-Centered Design
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Alur UCD 4 tahap: memahami pengguna → menentukan kebutuhan → membuat rancangan → pengujian.
        </p>
      </div>

      {/* UCD Stages */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Alur UCD</h2>
        {/* Stage tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {UCD_STAGES.map((stage, idx) => {
            const Icon = STAGE_ICONS[stage.icon]
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border
                  ${activeStage === idx
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'}`}
              >
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${activeStage === idx ? 'bg-white/20 text-white' : STAGE_COLORS[idx]}`}>
                  {stage.id}
                </span>
                <Icon size={14} />
                <span className="hidden sm:inline">{stage.name}</span>
              </button>
            )
          })}
        </div>
        {/* Active stage content */}
        {(() => {
          const stage = UCD_STAGES[activeStage]
          const Icon = STAGE_ICONS[stage.icon]
          return (
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${STAGE_COLORS[activeStage]}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Tahap {stage.id} — {stage.name}</p>
                <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{stage.label}</p>
                  <ul className="space-y-1.5">
                    {stage.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <ChevronRight size={14} className="text-primary-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Issues */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Masalah Usability Teridentifikasi ({issues.length})</h2>
          <button onClick={() => setShowForm(s => !s)} className="btn-secondary text-xs">
            <Plus size={14} /> {showForm ? 'Batal' : 'Tambah Masalah'}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 space-y-3">
            <p className="text-sm font-medium text-primary-800">Masalah Baru</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label">Kategori</label>
                <select className="form-select" value={newIssue.category}
                  onChange={e => setNewIssue(n => ({ ...n, category: e.target.value as IssueCategory }))}>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Keparahan</label>
                <select className="form-select" value={newIssue.severity}
                  onChange={e => setNewIssue(n => ({ ...n, severity: e.target.value as IssueSeverity }))}>
                  <option value="rendah">Rendah</option>
                  <option value="sedang">Sedang</option>
                  <option value="tinggi">Tinggi</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Deskripsi Masalah <span className="text-red-500">*</span></label>
              <textarea className="form-input" rows={2} placeholder="Jelaskan masalah yang ditemukan..."
                value={newIssue.description} onChange={e => setNewIssue(n => ({ ...n, description: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Rekomendasi Perbaikan</label>
              <textarea className="form-input" rows={2} placeholder="Saran tindakan perbaikan..."
                value={newIssue.recommendation} onChange={e => setNewIssue(n => ({ ...n, recommendation: e.target.value }))} />
            </div>
            <button onClick={handleAddIssue} className="btn-primary text-xs">
              <CheckCircle2 size={14} /> Simpan Masalah
            </button>
          </div>
        )}

        {/* Category chart */}
        {categoryCounts.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Distribusi per Kategori</p>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={categoryCounts} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 60 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {categoryCounts.map((_, i) => <Cell key={i} fill={REDESIGN_COLORS[i % REDESIGN_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Issues list */}
        {issues.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400 text-sm gap-2">
            <AlertTriangle size={28} className="text-gray-300" />
            Belum ada masalah tercatat. Tambahkan masalah dari evaluasi.
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map(issue => (
              <div key={issue.id} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge border text-xs ${SEVERITY_COLORS[issue.severity]}`}>
                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                    </span>
                    <span className="badge bg-gray-100 text-gray-600 border border-gray-200 text-xs">
                      {CATEGORY_LABELS[issue.category]}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteIssue(issue.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0" aria-label="Hapus masalah">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-800">{issue.description}</p>
                {issue.recommendation && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-emerald-700">
                    <ArrowRight size={12} className="mt-0.5 shrink-0" />
                    <span>{issue.recommendation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Before / After Comparison */}
      <div className="card p-5">
        <h2 className="section-title mb-2">Perbandingan Rancangan</h2>
        <p className="text-sm text-gray-500 mb-4">
          Bandingkan elemen visual dashboard sebelum dan sesudah perbaikan berdasarkan masalah yang teridentifikasi.
        </p>

        {/* Tab */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab('before')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
              ${activeTab === 'before' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            Dashboard Awal
          </button>
          <button onClick={() => setActiveTab('after')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
              ${activeTab === 'after' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            Dashboard Perbaikan
          </button>
        </div>

        {activeTab === 'before' ? (
          <div className="space-y-4">
            {/* Before: issues highlighted */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <p className="font-medium mb-1">⚠ Masalah pada Dashboard Awal</p>
              <ul className="space-y-1 text-xs">
                <li>• Tidak ada stat card — pengguna harus menghitung sendiri dari grafik</li>
                <li>• Label grafik terlalu kecil dan tidak ada tooltip interaktif</li>
                <li>• Filter tersebar, tidak dikelompokkan dalam satu area</li>
                <li>• Grafik jenis tidak selalu sesuai dengan data yang ditampilkan</li>
                <li>• Tidak ada indikator tren atau target</li>
              </ul>
            </div>
            {/* Mock "before" chart — bar only, no stat cards, crowded */}
            <div className="p-4 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={14} className="text-gray-400" />
                <p className="text-xs text-gray-400">Dashboard Awal — Bar chart saja, tanpa ringkasan</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={REDESIGN_MONTHLY.map(m => ({ bulan: m.month, pendapatan: m.revenue }))}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="bulan" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Bar dataKey="pendapatan" fill="#9ca3af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* After: improvements listed */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
              <p className="font-medium mb-1">✓ Perbaikan pada Dashboard Baru</p>
              <ul className="space-y-1 text-xs">
                <li>• Stat card menampilkan KPI utama secara langsung</li>
                <li>• Line chart untuk tren (lebih tepat dari bar chart untuk data temporal)</li>
                <li>• Tooltip interaktif di semua grafik</li>
                <li>• Filter dikelompokkan dalam satu panel dengan label jelas</li>
                <li>• Garis target ditambahkan ke grafik tren</li>
              </ul>
            </div>
            {/* Mock "after" chart — line chart with target */}
            <div className="p-4 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-primary-500" />
                <p className="text-xs text-gray-500">Dashboard Baru — Line chart dengan target, tooltip interaktif</p>
              </div>
              {/* Mini stat cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: 'Total Pendapatan', value: 'Rp 87jt' },
                  { label: 'Unit Terjual', value: '1.824' },
                  { label: 'Produk Aktif', value: '30' },
                ].map(s => (
                  <div key={s.label} className="bg-primary-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-sm font-bold text-primary-700">{s.value}</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={REDESIGN_MONTHLY} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}jt`} tick={{ fontSize: 10 }} width={36} />
                  <Tooltip formatter={(v: number) => [`Rp ${(v / 1_000_000).toFixed(1)}jt`, '']} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Pendapatan" />
                  <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Change list */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FilterIcon size={14} /> Daftar Perubahan dan Alasan
          </h3>
          <div className="space-y-2">
            {[
              { change: 'Menambahkan stat card KPI', reason: 'Pengguna tidak perlu menghitung sendiri; informasi kritis langsung terlihat.' },
              { change: 'Mengganti grafik tren ke line chart', reason: 'Line chart lebih tepat untuk data temporal; memudahkan pembacaan tren naik/turun.' },
              { change: 'Mengelompokkan filter dalam satu panel', reason: 'Mengurangi beban kognitif; pengguna menemukan semua kontrol di satu tempat.' },
              { change: 'Menambahkan tooltip interaktif', reason: 'Pengguna dapat membaca nilai tepat tanpa harus memperkirakan dari skala sumbu.' },
              { change: 'Menambahkan garis target ke grafik', reason: 'Membantu pengguna membandingkan pencapaian dengan target tanpa tabel terpisah.' },
              { change: 'Meningkatkan ukuran font label grafik', reason: 'Label kecil teridentifikasi sebagai masalah keterbacaan dalam evaluasi awal.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 text-sm">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">{item.change}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
