import { useState } from 'react'
import { ClipboardCheck, CheckCircle2, XCircle, Clock, MessageSquare, User, Save, Trash2, AlertTriangle } from 'lucide-react'
import { USABILITY_TASKS } from '../data/demoData'
import type { TaskStatus, TaskResult, EvaluationRating, UsabilitySession } from '../types'
import { saveUsabilitySession, loadUsabilitySessions, deleteUsabilitySession, generateId } from '../lib/storage'

const STATUS_LABELS: Record<TaskStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  belum_dimulai: { label: 'Belum Dimulai', color: 'text-gray-400 bg-gray-50 border-gray-200', icon: Clock },
  selesai: { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  tidak_selesai: { label: 'Tidak Selesai', color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle },
}

const PHASES = [
  { value: 'before', label: 'Sebelum Perancangan Ulang' },
  { value: 'after', label: 'Setelah Perancangan Ulang' },
]

const DEFAULT_RATINGS: EvaluationRating = {
  kejelasanInformasi: 3,
  kemudahanNavigasi: 3,
  konsistensiElemen: 3,
  keterbacaanGrafik: 3,
  kejelasanFilter: 3,
  komentarUmum: '',
}

function initTasks(): TaskResult[] {
  return USABILITY_TASKS.map(t => ({ taskId: t.id, status: 'belum_dimulai', timeSeconds: null, notes: '' }))
}

const RATING_FIELDS: { key: keyof Omit<EvaluationRating, 'komentarUmum'>; label: string }[] = [
  { key: 'kejelasanInformasi', label: 'Kejelasan Informasi' },
  { key: 'kemudahanNavigasi', label: 'Kemudahan Navigasi' },
  { key: 'konsistensiElemen', label: 'Konsistensi Elemen' },
  { key: 'keterbacaanGrafik', label: 'Keterbacaan Grafik' },
  { key: 'kejelasanFilter', label: 'Kejelasan Filter' },
]

export default function UsabilityPage() {
  const [respondentName, setRespondentName] = useState('')
  const [respondentRole, setRespondentRole] = useState('')
  const [phase, setPhase] = useState<'before' | 'after'>('before')
  const [tasks, setTasks] = useState<TaskResult[]>(initTasks)
  const [ratings, setRatings] = useState<EvaluationRating>(DEFAULT_RATINGS)
  const [saved, setSaved] = useState(false)
  const [sessions, setSessions] = useState<UsabilitySession[]>(loadUsabilitySessions)

  function updateTask(idx: number, updates: Partial<TaskResult>) {
    setTasks(prev => prev.map((t, i) => i === idx ? { ...t, ...updates } : t))
  }

  function updateRating(key: keyof EvaluationRating, value: number | string) {
    setRatings(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    if (!respondentName.trim()) { alert('Harap masukkan nama responden.'); return }
    const session: UsabilitySession = {
      id: generateId('ses'),
      respondentName: respondentName.trim(),
      respondentRole: respondentRole.trim() || 'Tidak disebutkan',
      timestamp: new Date().toISOString(),
      tasks,
      ratings,
      phase,
    }
    saveUsabilitySession(session)
    setSessions(loadUsabilitySessions())
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    // Reset form
    setRespondentName(''); setRespondentRole('')
    setTasks(initTasks()); setRatings(DEFAULT_RATINGS)
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus sesi ini?')) return
    deleteUsabilitySession(id)
    setSessions(loadUsabilitySessions())
  }

  const completedTasks = tasks.filter(t => t.status === 'selesai').length
  const totalTasks = tasks.length

  return (
    <div className="p-6 space-y-6 lg:pl-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardCheck size={24} className="text-primary-600" />
          Evaluasi Usability
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Catat hasil pengujian tugas dan berikan penilaian terhadap aspek-aspek usability dashboard.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Respondent */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={15} className="text-primary-600" /> Informasi Responden
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ev-name" className="form-label">Nama Responden <span className="text-red-500">*</span></label>
                <input id="ev-name" type="text" className="form-input" placeholder="Masukkan nama..."
                  value={respondentName} onChange={e => setRespondentName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="ev-role" className="form-label">Peran / Jabatan</label>
                <input id="ev-role" type="text" className="form-input" placeholder="Misal: Mahasiswa, Analis..."
                  value={respondentRole} onChange={e => setRespondentRole(e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <label className="form-label">Fase Pengujian</label>
              <div className="flex gap-4 mt-1">
                {PHASES.map(p => (
                  <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="phase" value={p.value}
                      checked={phase === p.value} onChange={() => setPhase(p.value as 'before' | 'after')}
                      className="text-primary-600" />
                    <span className="text-sm text-gray-700">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Daftar Tugas Pengujian</h2>
              <span className="text-xs text-gray-500 tabular-nums">{completedTasks}/{totalTasks} selesai</span>
            </div>
            <div className="space-y-4">
              {USABILITY_TASKS.map((task, idx) => {
                const result = tasks[idx]
                const statusMeta = STATUS_LABELS[result.status]
                const StatusIcon = statusMeta.icon
                return (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <span className="text-gray-400 mr-1.5">T{idx + 1}.</span>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                      </div>
                      <span className={`badge border text-xs ${statusMeta.color} shrink-0 flex items-center gap-1`}>
                        <StatusIcon size={11} /> {statusMeta.label}
                      </span>
                    </div>
                    <details className="mb-3">
                      <summary className="text-xs text-primary-600 cursor-pointer hover:underline">Lihat langkah-langkah</summary>
                      <ol className="mt-1.5 space-y-1 ml-3">
                        {task.steps.map((s, si) => (
                          <li key={si} className="text-xs text-gray-500">{si + 1}. {s}</li>
                        ))}
                      </ol>
                    </details>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">Status Penyelesaian</label>
                        <select className="form-select" value={result.status}
                          onChange={e => updateTask(idx, { status: e.target.value as TaskStatus })}>
                          <option value="belum_dimulai">Belum Dimulai</option>
                          <option value="selesai">Selesai</option>
                          <option value="tidak_selesai">Tidak Selesai</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">
                          Waktu (detik)
                          <span className="ml-1 text-gray-400 font-normal">— opsional, isi hanya jika diukur</span>
                        </label>
                        <input type="number" min="0" placeholder="–" className="form-input"
                          value={result.timeSeconds ?? ''}
                          onChange={e => updateTask(idx, {
                            timeSeconds: e.target.value ? Number(e.target.value) : null
                          })} />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="form-label">Catatan / Observasi</label>
                      <textarea className="form-input" rows={2}
                        placeholder="Kesulitan yang ditemukan, komentar pengguna, dll."
                        value={result.notes}
                        onChange={e => updateTask(idx, { notes: e.target.value })} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ratings */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Penilaian Aspek Usability</h2>
            <div className="space-y-4">
              {RATING_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm text-gray-700 font-medium">{label}</label>
                    <span className="text-sm font-semibold text-primary-600">{ratings[key]}/5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => updateRating(key, v)}
                        className={`w-10 h-10 rounded-lg border-2 text-sm font-semibold transition-all
                          ${ratings[key] === v
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : 'border-gray-200 text-gray-500 hover:border-primary-300'}`}
                        aria-label={`${label}: ${v}`}
                        aria-pressed={ratings[key] === v}
                      >
                        {v}
                      </button>
                    ))}
                    <span className="flex items-center text-xs text-gray-400 ml-1">
                      {ratings[key] <= 2 ? 'Buruk' : ratings[key] === 3 ? 'Cukup' : ratings[key] === 4 ? 'Baik' : 'Sangat Baik'}
                    </span>
                  </div>
                </div>
              ))}
              <div>
                <label htmlFor="ev-comment" className="form-label flex items-center gap-1.5">
                  <MessageSquare size={13} /> Komentar Umum
                </label>
                <textarea id="ev-comment" className="form-input" rows={3}
                  placeholder="Tuliskan masalah, saran, atau kesan keseluruhan..."
                  value={ratings.komentarUmum}
                  onChange={e => updateRating('komentarUmum', e.target.value)} />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={handleSave} className="btn-primary">
                <Save size={15} /> Simpan Sesi Evaluasi
              </button>
              {saved && (
                <span className="text-sm text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Tersimpan!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: saved sessions */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Sesi Tersimpan ({sessions.length})</h2>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400 text-sm text-center gap-2">
                <AlertTriangle size={28} className="text-gray-300" />
                Belum ada sesi evaluasi yang disimpan.
              </div>
            ) : (
              <ul className="space-y-2">
                {sessions.map(s => {
                  const done = s.tasks.filter(t => t.status === 'selesai').length
                  return (
                    <li key={s.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800 truncate">{s.respondentName}</p>
                        <button onClick={() => handleDelete(s.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Hapus sesi">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-gray-500 mt-0.5">{s.respondentRole}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`badge border ${s.phase === 'before' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {s.phase === 'before' ? 'Sebelum' : 'Sesudah'}
                        </span>
                        <span className="text-gray-400">{done}/{s.tasks.length} tugas</span>
                      </div>
                      <p className="text-gray-400 mt-1">{new Date(s.timestamp).toLocaleString('id-ID')}</p>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Legend */}
          <div className="card p-4 text-xs text-gray-500 space-y-1.5">
            <p className="font-medium text-gray-700">Skala Penilaian</p>
            <p>1 = Sangat Buruk</p>
            <p>2 = Buruk</p>
            <p>3 = Cukup</p>
            <p>4 = Baik</p>
            <p>5 = Sangat Baik</p>
            <p className="mt-2 text-gray-400 leading-relaxed">
              Waktu penyelesaian tugas hanya diisi jika benar-benar diukur selama sesi pengujian.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
