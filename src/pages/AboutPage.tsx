import {
  Info, BookOpen, Code2, FlaskConical, Database, GitBranch,
  ChevronRight, ExternalLink,
} from 'lucide-react'

const TECH_STACK = [
  { name: 'React 18', desc: 'Library UI berbasis komponen' },
  { name: 'TypeScript', desc: 'Strict typing untuk kode yang andal' },
  { name: 'Vite', desc: 'Build tool cepat berbasis ESM' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
  { name: 'Recharts', desc: 'Library visualisasi data berbasis D3' },
  { name: 'React Router', desc: 'Routing sisi klien' },
  { name: 'Lucide React', desc: 'Ikon SVG konsisten' },
  { name: 'Vitest', desc: 'Framework pengujian modern' },
]

const REFERENCES = [
  {
    authors: 'Brooke, J.',
    year: '1996',
    title: 'SUS: A "quick and dirty" usability scale',
    source: 'Dalam P. W. Jordan et al. (Eds.), Usability Evaluation in Industry (hal. 189–194). Taylor & Francis.',
  },
  {
    authors: 'Bangor, A., Kortum, P. T., & Miller, J. T.',
    year: '2008',
    title: 'An Empirical Evaluation of the System Usability Scale',
    source: 'International Journal of Human-Computer Interaction, 24(6), 574–594.',
  },
  {
    authors: 'Nielsen, J.',
    year: '1993',
    title: 'Usability Engineering',
    source: 'Academic Press.',
  },
  {
    authors: 'ISO 9241-210',
    year: '2019',
    title: 'Ergonomics of Human-System Interaction — Part 210: Human-Centred Design for Interactive Systems',
    source: 'International Organization for Standardization.',
  },
]

const LIMITATIONS = [
  'Aplikasi menggunakan localStorage sehingga data tidak persisten antar perangkat.',
  'Data demonstrasi dashboard adalah data fiktif, bukan data perusahaan nyata.',
  'Skor SUS hanya bermakna statistis jika dikumpulkan dari cukup banyak responden (disarankan ≥5).',
  'Tidak ada autentikasi pengguna; semua data tersimpan secara lokal.',
  'Perbandingan sebelum/sesudah memerlukan kondisi pengujian yang setara untuk dapat diinterpretasikan dengan valid.',
  'Radar chart aspek usability saat ini menggunakan nilai contoh, belum terhubung ke data sesi evaluasi.',
]

export default function AboutPage() {
  return (
    <div className="p-6 space-y-6 lg:pl-8 max-w-4xl">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Info size={24} className="text-primary-600" />
          Tentang Proyek
        </h1>
        <p className="text-sm text-gray-500 mt-1">Dokumentasi, tujuan, metodologi, dan referensi UsabilityLab.</p>
      </div>

      {/* Project identity */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white shrink-0">
            <FlaskConical size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">UsabilityLab — Dashboard Evaluation</h2>
            <p className="text-sm text-gray-500 mt-1">
              Aplikasi web untuk mengevaluasi usability dan merancang ulang dashboard visualisasi data menggunakan
              metode User-Centered Design (UCD) dan System Usability Scale (SUS).
            </p>
          </div>
        </div>
      </div>

      {/* Tujuan */}
      <div className="card p-5">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-600" /> Tujuan Penelitian
        </h2>
        <ul className="space-y-2">
          {[
            'Mengevaluasi kemudahan penggunaan dashboard visualisasi data.',
            'Mengidentifikasi masalah antarmuka dan penyajian informasi.',
            'Mengumpulkan kebutuhan pengguna melalui pengujian berbasis tugas.',
            'Merancang ulang dashboard berdasarkan prinsip User-Centered Design.',
            'Mengukur usability menggunakan System Usability Scale (SUS).',
            'Membandingkan hasil evaluasi sebelum dan sesudah perancangan ulang.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <ChevronRight size={14} className="text-primary-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Metode SUS */}
      <div className="card p-5">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <FlaskConical size={18} className="text-primary-600" /> Metode System Usability Scale
        </h2>
        <div className="prose prose-sm text-gray-700 space-y-3">
          <p>
            SUS dikembangkan oleh John Brooke pada tahun 1996 sebagai instrumen evaluasi usability yang cepat,
            mudah diadministrasikan, dan terbukti valid secara empiris.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2 border border-gray-200">
            <p className="font-sans font-medium text-gray-900 font-mono">Rumus Perhitungan SUS:</p>
            <p><span className="text-primary-600">Butir ganjil (1,3,5,7,9):</span>  kontribusi = skor_jawaban − 1</p>
            <p><span className="text-amber-600">Butir genap (2,4,6,8,10):</span>  kontribusi = 5 − skor_jawaban</p>
            <p className="pt-2 border-t border-gray-200"><span className="text-gray-900 font-semibold">Skor SUS</span> = Σ(semua kontribusi) × 2,5</p>
            <p className="text-xs text-gray-500">Rentang: 0–100 · Bukan persentase · Bukan skor kepuasan</p>
          </div>
          <p className="text-sm text-gray-600">
            Interpretasi grade menggunakan skala Bangor et al. (2008):
            A (≥90 Terbaik), B (80–89 Sangat Baik), C (70–79 Baik), D (60–69 Cukup), F (&lt;60 Buruk).
          </p>
        </div>
      </div>

      {/* Alur UCD */}
      <div className="card p-5">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Database size={18} className="text-primary-600" /> Alur User-Centered Design
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { num: 1, title: 'Memahami Pengguna', desc: 'Identifikasi profil, kebutuhan, dan tujuan pengguna.' },
            { num: 2, title: 'Menentukan Kebutuhan', desc: 'Kelompokkan masalah dan tentukan prioritas perbaikan.' },
            { num: 3, title: 'Membuat Rancangan', desc: 'Implementasikan perbaikan berdasarkan kebutuhan teridentifikasi.' },
            { num: 4, title: 'Pengujian', desc: 'Uji rancangan baru dan bandingkan dengan rancangan awal.' },
          ].map(s => (
            <div key={s.num} className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <span className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {s.num}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card p-5">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Code2 size={18} className="text-primary-600" /> Teknologi
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TECH_STACK.map(t => (
            <div key={t.name} className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
              <p className="text-sm font-semibold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="card p-5">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <GitBranch size={18} className="text-amber-600" /> Keterbatasan
        </h2>
        <ul className="space-y-2">
          {LIMITATIONS.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* References */}
      <div className="card p-5">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-600" /> Referensi
        </h2>
        <div className="space-y-4">
          {REFERENCES.map((ref, i) => (
            <div key={i} className="text-sm text-gray-700 border-l-2 border-primary-200 pl-3">
              <p>
                <span className="font-medium">{ref.authors}</span> ({ref.year}).{' '}
                <em>{ref.title}</em>.{' '}
                <span className="text-gray-500">{ref.source}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub */}
      <div className="card p-5 bg-gray-900 text-white">
        <div className="flex items-center gap-3">
          <GitBranch size={20} className="text-gray-300" />
          <div>
            <p className="font-semibold">Siap untuk GitHub</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Proyek ini mencakup README lengkap, .gitignore, struktur modular, dan pengujian otomatis.
              Jalankan <code className="bg-gray-800 px-1 rounded text-xs">npm run test</code> untuk memverifikasi sebelum push.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors shrink-0"
          >
            GitHub <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
