import { useState } from 'react'
import { FileQuestion, CheckCircle2, Trash2, Info, AlertTriangle, BookOpen } from 'lucide-react'
import SusQuestionnaire from '../components/SusQuestionnaire'
import type { SusAnswer, SusResponse } from '../types'
import { calculateSusScore, getSusGrade, getSusLabel } from '../lib/susCalculator'
import { saveSusResponse, loadSusResponses, deleteSusResponse, generateId } from '../lib/storage'

const PHASE_OPTIONS = [
  { value: 'before', label: 'Sebelum Perancangan Ulang' },
  { value: 'after', label: 'Setelah Perancangan Ulang' },
]

function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    B: 'bg-blue-100 text-blue-800 border-blue-200',
    C: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    D: 'bg-orange-100 text-orange-800 border-orange-200',
    F: 'bg-red-100 text-red-800 border-red-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold border ${colors[grade] ?? 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {grade}
    </span>
  )
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 70 ? '#3b82f6' : score >= 60 ? '#f59e0b' : '#ef4444'
  const pct = score / 100
  const r = 52, cx = 64, cy = 64
  const circ = 2 * Math.PI * r
  const dash = circ * pct
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" aria-label={`Skor SUS: ${score}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" fill={color}>
        {score}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#9ca3af">
        / 100
      </text>
    </svg>
  )
}

export default function SusPage() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [phase, setPhase] = useState<'before' | 'after'>('before')
  const [result, setResult] = useState<SusResponse | null>(null)
  const [responses, setResponses] = useState<SusResponse[]>(loadSusResponses)
  const [key, setKey] = useState(0) // remount questionnaire after submit

  function handleSubmit(answers: SusAnswer[]) {
    if (!name.trim()) { alert('Harap masukkan nama responden sebelum mengirim.'); return }
    const score = calculateSusScore(answers)
    const response: SusResponse = {
      id: generateId('sus'),
      respondentName: name.trim(),
      respondentRole: role.trim() || 'Tidak disebutkan',
      timestamp: new Date().toISOString(),
      answers,
      score,
      phase,
    }
    saveSusResponse(response)
    setResult(response)
    setResponses(loadSusResponses())
  }

  function handleNewResponse() {
    setResult(null)
    setName(''); setRole('')
    setKey(k => k + 1)
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus respons ini?')) return
    deleteSusResponse(id)
    setResponses(loadSusResponses())
  }

  return (
    <div className="p-6 space-y-6 lg:pl-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileQuestion size={24} className="text-primary-600" />
          Kuesioner System Usability Scale (SUS)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          10 pernyataan standar SUS (Brooke, 1996). Skor dihitung otomatis, rentang 0–100.
        </p>
      </div>

      {/* SUS Info Box */}
      <div className="card p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tentang System Usability Scale</p>
            <p className="text-xs leading-relaxed">
              SUS dikembangkan oleh John Brooke (1996) sebagai instrumen evaluasi usability yang cepat dan andal.
              Rumus: butir ganjil (kontribusi = skor − 1), butir genap (kontribusi = 5 − skor), skor akhir = jumlah kontribusi × 2,5.
              Interpretasi: ≥80 (Sangat Baik / B), ≥70 (Baik / C), ≥60 (Cukup / D), &lt;60 (Buruk / F).
              <strong className="block mt-1">Skor SUS bukan persentase pengguna yang puas.</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form / Result */}
        <div className="lg:col-span-2">
          {result ? (
            /* Result Card */
            <div className="card p-6 text-center space-y-4">
              <div className="flex justify-center">
                <ScoreGauge score={result.score} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Skor SUS untuk</p>
                <p className="text-xl font-bold text-gray-900">{result.respondentName}</p>
                <p className="text-sm text-gray-500">{result.respondentRole} · {result.phase === 'before' ? 'Sebelum' : 'Sesudah'} perancangan ulang</p>
              </div>
              <div className="flex justify-center items-center gap-3">
                <GradeBadge grade={getSusGrade(result.score)} />
                <span className="text-lg font-semibold text-gray-800">{getSusLabel(result.score)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm max-w-xs mx-auto">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Skor</p>
                  <p className="font-bold text-gray-900 text-xl tabular-nums">{result.score}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Grade</p>
                  <p className="font-bold text-gray-900 text-xl">{getSusGrade(result.score)}</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 text-left">
                <p className="font-medium mb-1">⚠ Catatan Interpretasi</p>
                <p>Skor ini berasal dari satu responden dan belum dapat dijadikan kesimpulan penelitian. Kumpulkan setidaknya 5–8 responden untuk memperoleh estimasi yang lebih andal (Nielsen, 1993).</p>
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={handleNewResponse} className="btn-primary">
                  <CheckCircle2 size={15} /> Respons Baru
                </button>
              </div>
            </div>
          ) : (
            /* Questionnaire Form */
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Isi Kuesioner SUS</h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                <div className="sm:col-span-1">
                  <label htmlFor="sus-name" className="form-label">Nama Responden <span className="text-red-500">*</span></label>
                  <input id="sus-name" type="text" className="form-input" placeholder="Nama lengkap..."
                    value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="sus-role" className="form-label">Peran</label>
                  <input id="sus-role" type="text" className="form-input" placeholder="Misal: Mahasiswa..."
                    value={role} onChange={e => setRole(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Fase</label>
                  <select className="form-select" value={phase} onChange={e => setPhase(e.target.value as 'before' | 'after')}>
                    {PHASE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <SusQuestionnaire key={key} onSubmit={handleSubmit} />
            </div>
          )}
        </div>

        {/* Sidebar: saved responses */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-primary-600" />
              Respons Tersimpan ({responses.length})
            </h2>
            {responses.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400 text-sm text-center gap-2">
                <AlertTriangle size={28} className="text-gray-300" />
                Belum ada respons tersimpan.
              </div>
            ) : (
              <ul className="space-y-2">
                {[...responses].reverse().map(r => (
                  <li key={r.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 truncate">{r.respondentName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tabular-nums" style={{
                          color: r.score >= 80 ? '#059669' : r.score >= 70 ? '#2563eb' : r.score >= 60 ? '#d97706' : '#dc2626'
                        }}>{r.score}</span>
                        <GradeBadge grade={getSusGrade(r.score)} />
                        <button onClick={() => handleDelete(r.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-1" aria-label="Hapus respons">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs badge border ${r.phase === 'before' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {r.phase === 'before' ? 'Sebelum' : 'Sesudah'}
                      </span>
                      <span className="text-xs text-gray-400">{r.respondentRole}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.timestamp).toLocaleString('id-ID')}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Grade Scale */}
          <div className="card p-4 text-xs text-gray-600 space-y-1.5">
            <p className="font-medium text-gray-700">Interpretasi Skor SUS</p>
            {[
              { range: '≥ 90', grade: 'A', label: 'Terbaik', color: 'text-emerald-600' },
              { range: '80–89', grade: 'B', label: 'Sangat Baik', color: 'text-blue-600' },
              { range: '70–79', grade: 'C', label: 'Baik', color: 'text-blue-500' },
              { range: '60–69', grade: 'D', label: 'Cukup', color: 'text-amber-600' },
              { range: '< 60', grade: 'F', label: 'Buruk', color: 'text-red-600' },
            ].map(s => (
              <div key={s.grade} className="flex items-center justify-between">
                <span className="font-mono">{s.range}</span>
                <span className={`font-bold ${s.color}`}>{s.grade}</span>
                <span className="text-gray-500">{s.label}</span>
              </div>
            ))}
            <p className="mt-2 text-gray-400 leading-relaxed text-[10px]">
              Sumber: Bangor et al. (2008). Nilai cut-off bersifat acuan, bukan batas mutlak.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
