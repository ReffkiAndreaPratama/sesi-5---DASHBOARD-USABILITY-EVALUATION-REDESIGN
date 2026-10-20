# UsabilityLab — Dashboard Evaluation

> **Evaluasi Usability dan Perancangan Ulang Dashboard Visualisasi Data Menggunakan Metode User-Centered Design dan System Usability Scale (SUS).**

UsabilityLab adalah aplikasi web untuk mengevaluasi kemudahan penggunaan dashboard visualisasi data, mengumpulkan masukan pengguna melalui kuesioner SUS, merancang ulang antarmuka dengan pendekatan User-Centered Design (UCD), serta membandingkan hasil evaluasi sebelum dan sesudah perbaikan.

---

## Daftar Isi

- [Deskripsi Proyek](#deskripsi-proyek)
- [Latar Belakang](#latar-belakang)
- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Metode User-Centered Design](#metode-user-centered-design)
- [Rumus dan Cara Menghitung SUS](#rumus-dan-cara-menghitung-sus)
- [Struktur Direktori](#struktur-direktori)
- [Instalasi](#instalasi)
- [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)
- [Cara Melakukan Pengujian](#cara-melakukan-pengujian)
- [Cara Mengekspor Data](#cara-mengekspor-data)
- [Keterbatasan](#keterbatasan)
- [Referensi](#referensi)

---

## Deskripsi Proyek

**Nama proyek:** UsabilityLab — Dashboard Evaluation

**Tujuan:**

1. Mengevaluasi kemudahan penggunaan dashboard visualisasi data.
2. Mengidentifikasi masalah antarmuka dan penyajian informasi.
3. Mengumpulkan kebutuhan pengguna melalui pengujian berbasis tugas.
4. Merancang ulang dashboard berdasarkan prinsip User-Centered Design.
5. Mengukur usability menggunakan System Usability Scale (SUS).
6. Membandingkan hasil evaluasi sebelum dan sesudah perancangan ulang.
7. Menyediakan aplikasi yang dapat dijalankan dan dipublikasikan di GitHub.

## Latar Belakang

Dashboard yang menampilkan terlalu banyak informasi, menggunakan visualisasi yang kurang tepat, atau memiliki tata letak yang membingungkan dapat menyulitkan pengguna memahami data. Evaluasi usability dan pendekatan User-Centered Design dapat membantu mengidentifikasi masalah tersebut dan menghasilkan rancangan yang lebih mudah digunakan.

## Fitur Utama

| Halaman | Fungsi |
|---|---|
| **Dashboard** | Dashboard interaktif dengan stat card, grafik tren (line), perbandingan (bar), proporsi (donut), hubungan (scatter), filter tanggal/kategori/wilayah, pencarian, dan tabel detail. |
| **Evaluasi Usability** | Daftar tugas pengujian, catatan status penyelesaian, waktu (opsional), penilaian aspek usability (skala 1–5), dan komentar. |
| **Kuesioner SUS** | 10 pernyataan standar SUS dengan skala Likert 1–5, perhitungan otomatis skor 0–100, grade, dan interpretasi. |
| **Perancangan Ulang** | Alur UCD 4 tahap, pencatatan masalah usability, perbandingan dashboard sebelum/sesudah, daftar perubahan dan alasan. |
| **Hasil Evaluasi** | Statistik agregat SUS (mean, median, min, max, distribusi), perbandingan fase, ringkasan masalah, dan ekspor CSV/JSON. |
| **Tentang Proyek** | Dokumentasi tujuan, metodologi, teknologi, keterbatasan, dan referensi. |

## Teknologi

- **React 19** — library UI berbasis komponen
- **TypeScript** — pengetikan statis untuk kode yang andal
- **Vite 8** — build tool cepat berbasis ESM
- **Tailwind CSS 3** — utility-first CSS framework
- **Recharts** — library visualisasi data berbasis D3
- **React Router 6** — routing sisi klien
- **Lucide React** — ikon SVG konsisten
- **Vitest** — framework pengujian modern
- **React Testing Library** — pengujian komponen React

Penyimpanan data menggunakan **localStorage** browser — tidak memerlukan backend.

## Metode User-Centered Design

Aplikasi mengimplementasikan alur UCD 4 tahap berdasarkan ISO 9241-210:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌────────────┐
│ 1. Memahami      │ ──→ │ 2. Menentukan     │ ──→ │ 3. Membuat       │ ──→ │ 4. Uji     │
│    Pengguna      │     │    Kebutuhan      │     │    Rancangan     │     │            │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └────────────┘
```

1. **Memahami Pengguna** — Identifikasi profil pengguna, tujuan, dan masalah yang dialami.
2. **Menentukan Kebutuhan** — Kelompokkan masalah berdasarkan kategori (navigasi, keterbacaan, konsistensi, visualisasi) dan tentukan prioritas.
3. **Membuat Rancangan** — Terapkan perbaikan berdasarkan kebutuhan teridentifikasi.
4. **Pengujian** — Uji rancangan baru dan bandingkan skor SUS sebelum/sesudah.

## Rumus dan Cara Menghitung SUS

System Usability Scale (SUS) dikembangkan oleh John Brooke (1996). Kuesioner terdiri dari 10 pernyataan dengan skala Likert 1–5 (1 = Sangat Tidak Setuju, 5 = Sangat Setuju).

### Aturan Perhitungan

```
Butir ganjil (Q1, Q3, Q5, Q7, Q9 — pernyataan positif):
    kontribusi = skor_jawaban − 1

Butir genap (Q2, Q4, Q6, Q8, Q10 — pernyataan negatif):
    kontribusi = 5 − skor_jawaban

Skor SUS = (Σ semua kontribusi) × 2,5
```

### Rentang dan Interpretasi

| Skor | Grade | Label | Sumber |
|------|-------|-------|--------|
| ≥ 90 | A | Terbaik | Bangor et al. (2008) |
| 80–89 | B | Sangat Baik | |
| 70–79 | C | Baik | |
| 60–69 | D | Cukup | |
| < 60 | F | Buruk / Tidak Dapat Diterima | |

> **Penting:** Skor SUS **bukan** persentase pengguna yang puas. Skor SUS adalah nilai tunggal pada skala 0–100 yang mengukur persepsi usability secara keseluruhan.

### Contoh Perhitungan

Jawaban: `[4, 2, 4, 1, 4, 2, 4, 1, 5, 1]`

| Butir | Jawaban | Rumus | Kontribusi |
|-------|---------|-------|------------|
| Q1 (ganjil) | 4 | 4 − 1 | 3 |
| Q2 (genap) | 2 | 5 − 2 | 3 |
| Q3 (ganjil) | 4 | 4 − 1 | 3 |
| Q4 (genap) | 1 | 5 − 1 | 4 |
| Q5 (ganjil) | 4 | 4 − 1 | 3 |
| Q6 (genap) | 2 | 5 − 2 | 3 |
| Q7 (ganjil) | 4 | 4 − 1 | 3 |
| Q8 (genap) | 1 | 5 − 1 | 4 |
| Q9 (ganjil) | 5 | 5 − 1 | 4 |
| Q10 (genap) | 1 | 5 − 1 | 4 |
| **Total** | | | **34** |

Skor SUS = 34 × 2,5 = **85** (Grade B — Sangat Baik)

## Struktur Direktori

```
usabilitylab-dashboard/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.test.json
├── .gitignore
├── README.md
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── css.d.ts
│   ├── test-setup.ts
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── ChartPanel.tsx
│   │   ├── DataTable.tsx
│   │   └── SusQuestionnaire.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── UsabilityPage.tsx
│   │   ├── SusPage.tsx
│   │   ├── RedesignPage.tsx
│   │   ├── ResultsPage.tsx
│   │   └── AboutPage.tsx
│   ├── lib/
│   │   ├── susCalculator.ts
│   │   ├── storage.ts
│   │   └── export.ts
│   ├── data/
│   │   └── demoData.ts
│   └── types/
│       └── index.ts
└── tests/
    ├── susCalculator.test.ts
    ├── storage.test.ts
    ├── export.test.ts
    └── dashboard.test.tsx
```

## Instalasi

Prasyarat: **Node.js 18+** dan **npm**.

```bash
# 1. Clone repositori (atau ekstrak folder proyek)
git clone <url-repositori>
cd usabilitylab-dashboard

# 2. Install dependensi
npm install
```

## Cara Menjalankan Aplikasi

```bash
# Mode pengembangan (hot reload)
npm run dev

# Build produksi
npm run build

# Preview hasil build
npm run preview
```

Setelah `npm run dev`, buka browser ke alamat yang ditampilkan (biasanya `http://localhost:5173`).

## Cara Melakukan Pengujian

### Pengujian Otomatis

```bash
# Jalankan semua test sekali
npm test

# Mode watch (selama pengembangan)
npm run test:watch
```

Pengujian otomatis mencakup:
- **Perhitungan SUS** — contoh skor yang diketahui (0, 50, 85, 100), validasi input.
- **Penyimpanan & pemuatan** — respons SUS, sesi evaluasi, dan masalah usability.
- **Ekspor data** — format CSV dan JSON.
- **Filter dashboard** — filter kategori, pencarian, pesan data kosong, reset filter.
- **Navigasi & rendering** — judul halaman, stat card, kontrol filter, grafik.

### Pengujian Usability Manual

1. Buka halaman **Dashboard** dan kenali antarmuka.
2. Buka halaman **Evaluasi Usability**:
   - Isi nama dan peran responden.
   - Pilih fase (Sebelum/Sesudah perancangan ulang).
   - Untuk setiap tugas, catat status penyelesaian, waktu (jika diukur), dan catatan.
   - Berikan penilaian aspek usability (1–5) dan komentar umum.
   - Klik **Simpan Sesi Evaluasi**.
3. Buka halaman **Kuesioner SUS**:
   - Isi nama dan peran responden.
   - Pilih fase.
   - Jawab semua 10 pernyataan (skala 1–5).
   - Klik **Kirim Kuesioner** — skor dihitung otomatis.
4. Ulangi langkah 2–3 untuk fase **Setelah Perancangan Ulang** setelah mempelajari rancangan baru di halaman **Perancangan Ulang**.
5. Buka halaman **Hasil Evaluasi** untuk melihat ringkasan dan ekspor data.

> **Catatan:** Waktu penyelesaian tugas hanya diisi jika benar-benar diukur selama sesi pengujian. Jangan mengarang data waktu atau hasil pengujian.

## Cara Mengekspor Data

Di halaman **Hasil Evaluasi**, tersedia tombol ekspor:

| Tombol | Format | Isi |
|--------|--------|-----|
| SUS → CSV | CSV | Semua respons SUS (nama, peran, fase, Q1–Q10, skor, grade, label) |
| SUS → JSON | JSON | Respons SUS dengan field `grade` dan `label` yang ditambahkan |
| Masalah → CSV | CSV | Daftar masalah usability (kategori, keparahan, deskripsi, rekomendasi) |
| Masalah → JSON | JSON | Daftar masalah usability dalam format JSON terstruktur |
| Laporan Lengkap | JSON | Gabungan respons SUS + masalah + timestamp ekspor |

File ekspor diunduh melalui browser (Blob API) dan tersimpan di folder unduhan pengguna.

## Keterbatasan

- Aplikasi menggunakan **localStorage** sehingga data tidak persisten antar perangkat atau browser.
- Data dashboard adalah **data demonstrasi fiktif**, bukan data perusahaan nyata.
- Skor SUS hanya bermakna statistis jika dikumpulkan dari cukup banyak responden (disarankan minimal 5–8 responden per Nielsen, 1993).
- Tidak ada autentikasi pengguna; semua data tersimpan secara lokal di browser.
- Perbandingan sebelum/sesudah memerlukan kondisi pengujian yang setara untuk dapat diinterpretasikan dengan valid.
- Radar chart aspek usability menggunakan nilai contoh dan belum terhubung penuh ke data sesi evaluasi tersimpan.
- Aplikasi tidak menyimpulkan desain baru lebih baik hanya berdasarkan tampilan; kesimpulan harus didukung data pengujian.

## Referensi

1. Brooke, J. (1996). SUS: A "quick and dirty" usability scale. Dalam P. W. Jordan et al. (Eds.), *Usability Evaluation in Industry* (hal. 189–194). Taylor & Francis.
2. Bangor, A., Kortum, P. T., & Miller, J. T. (2008). An Empirical Evaluation of the System Usability Scale. *International Journal of Human-Computer Interaction*, 24(6), 574–594.
3. Nielsen, J. (1993). *Usability Engineering*. Academic Press.
4. ISO 9241-210 (2019). *Ergonomics of Human-System Interaction — Part 210: Human-Centred Design for Interactive Systems*. International Organization for Standardization.

---

**Versi:** 1.0.0 · **Lisensi:** MIT · **Bahasa:** Bahasa Indonesia
