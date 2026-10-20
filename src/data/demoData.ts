/**
 * Data demonstrasi — bukan data perusahaan nyata.
 * Digunakan hanya untuk keperluan pengujian dan demonstrasi antarmuka.
 */

import type { SalesRecord, MonthlyTrend, UsabilityTask, SusItem } from '../types'

// ─── Sales Records ─────────────────────────────────────────────────────────

export const CATEGORIES = ['Elektronik', 'Pakaian', 'Makanan', 'Olahraga', 'Buku']
export const REGIONS = ['Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali']

export const DEMO_SALES: SalesRecord[] = [
  // Januari
  { id: 's001', date: '2024-01-05', category: 'Elektronik', product: 'Laptop Pro X', revenue: 12500000, units: 5, region: 'Jawa' },
  { id: 's002', date: '2024-01-08', category: 'Pakaian', product: 'Jaket Casual', revenue: 850000, units: 34, region: 'Jawa' },
  { id: 's003', date: '2024-01-12', category: 'Makanan', product: 'Snack Premium', revenue: 320000, units: 80, region: 'Sumatera' },
  { id: 's004', date: '2024-01-15', category: 'Olahraga', product: 'Sepatu Lari', revenue: 1200000, units: 12, region: 'Jawa' },
  { id: 's005', date: '2024-01-18', category: 'Buku', product: 'Novel Bestseller', revenue: 180000, units: 60, region: 'Kalimantan' },
  { id: 's006', date: '2024-01-22', category: 'Elektronik', product: 'Headphone BT', revenue: 750000, units: 20, region: 'Sulawesi' },
  { id: 's007', date: '2024-01-25', category: 'Pakaian', product: 'Kaos Polos', revenue: 450000, units: 90, region: 'Bali' },
  { id: 's008', date: '2024-01-28', category: 'Makanan', product: 'Kopi Arabika', revenue: 210000, units: 70, region: 'Sumatera' },
  // Februari
  { id: 's009', date: '2024-02-03', category: 'Elektronik', product: 'Smartphone A1', revenue: 8900000, units: 9, region: 'Jawa' },
  { id: 's010', date: '2024-02-07', category: 'Olahraga', product: 'Raket Badminton', revenue: 650000, units: 13, region: 'Jawa' },
  { id: 's011', date: '2024-02-11', category: 'Buku', product: 'Buku Desain UI', revenue: 220000, units: 45, region: 'Sulawesi' },
  { id: 's012', date: '2024-02-14', category: 'Pakaian', product: 'Gaun Pesta', revenue: 1100000, units: 22, region: 'Bali' },
  { id: 's013', date: '2024-02-18', category: 'Makanan', product: 'Teh Herbal', revenue: 150000, units: 100, region: 'Kalimantan' },
  { id: 's014', date: '2024-02-22', category: 'Elektronik', product: 'Tablet Z2', revenue: 5600000, units: 7, region: 'Sumatera' },
  { id: 's015', date: '2024-02-26', category: 'Olahraga', product: 'Matras Yoga', revenue: 380000, units: 19, region: 'Jawa' },
  // Maret
  { id: 's016', date: '2024-03-02', category: 'Buku', product: 'Kamus Bahasa', revenue: 195000, units: 52, region: 'Jawa' },
  { id: 's017', date: '2024-03-06', category: 'Elektronik', product: 'Kamera Mirrorless', revenue: 18000000, units: 3, region: 'Bali' },
  { id: 's018', date: '2024-03-10', category: 'Pakaian', product: 'Celana Jeans', revenue: 720000, units: 36, region: 'Sulawesi' },
  { id: 's019', date: '2024-03-14', category: 'Makanan', product: 'Cokelat Premium', revenue: 280000, units: 56, region: 'Jawa' },
  { id: 's020', date: '2024-03-18', category: 'Olahraga', product: 'Dumbbell Set', revenue: 950000, units: 10, region: 'Kalimantan' },
  { id: 's021', date: '2024-03-22', category: 'Elektronik', product: 'Monitor 4K', revenue: 7200000, units: 6, region: 'Jawa' },
  { id: 's022', date: '2024-03-26', category: 'Pakaian', product: 'Kemeja Formal', revenue: 580000, units: 29, region: 'Sumatera' },
  // April
  { id: 's023', date: '2024-04-01', category: 'Makanan', product: 'Susu Almond', revenue: 190000, units: 95, region: 'Jawa' },
  { id: 's024', date: '2024-04-05', category: 'Buku', product: 'Komik Manga', revenue: 120000, units: 120, region: 'Bali' },
  { id: 's025', date: '2024-04-09', category: 'Elektronik', product: 'Smartwatch S3', revenue: 3200000, units: 16, region: 'Jawa' },
  { id: 's026', date: '2024-04-13', category: 'Olahraga', product: 'Trekking Pole', revenue: 520000, units: 26, region: 'Sulawesi' },
  { id: 's027', date: '2024-04-17', category: 'Pakaian', product: 'Sepatu Sneaker', revenue: 890000, units: 44, region: 'Jawa' },
  { id: 's028', date: '2024-04-21', category: 'Makanan', product: 'Granola Bar', revenue: 165000, units: 82, region: 'Kalimantan' },
  { id: 's029', date: '2024-04-25', category: 'Elektronik', product: 'Power Bank 20K', revenue: 420000, units: 42, region: 'Sumatera' },
  // Mei
  { id: 's030', date: '2024-05-03', category: 'Buku', product: 'Ensiklopedia Sains', revenue: 340000, units: 34, region: 'Jawa' },
  { id: 's031', date: '2024-05-07', category: 'Olahraga', product: 'Bola Basket', revenue: 480000, units: 16, region: 'Bali' },
  { id: 's032', date: '2024-05-11', category: 'Pakaian', product: 'Jaket Hoodie', revenue: 760000, units: 38, region: 'Sulawesi' },
  { id: 's033', date: '2024-05-15', category: 'Elektronik', product: 'Speaker Bluetooth', revenue: 680000, units: 34, region: 'Jawa' },
  { id: 's034', date: '2024-05-19', category: 'Makanan', product: 'Madu Hutan', revenue: 240000, units: 60, region: 'Sumatera' },
  { id: 's035', date: '2024-05-23', category: 'Elektronik', product: 'USB Hub 7-Port', revenue: 350000, units: 50, region: 'Kalimantan' },
  // Juni
  { id: 's036', date: '2024-06-02', category: 'Pakaian', product: 'Rok Maxi', revenue: 620000, units: 31, region: 'Jawa' },
  { id: 's037', date: '2024-06-06', category: 'Olahraga', product: 'Sarung Tinju', revenue: 290000, units: 29, region: 'Sumatera' },
  { id: 's038', date: '2024-06-10', category: 'Buku', product: 'Atlas Dunia', revenue: 175000, units: 35, region: 'Bali' },
  { id: 's039', date: '2024-06-14', category: 'Makanan', product: 'Keripik Tempe', revenue: 95000, units: 190, region: 'Jawa' },
  { id: 's040', date: '2024-06-18', category: 'Elektronik', product: 'Webcam HD', revenue: 580000, units: 29, region: 'Sulawesi' },
  { id: 's041', date: '2024-06-22', category: 'Olahraga', product: 'Celana Olahraga', revenue: 320000, units: 64, region: 'Kalimantan' },
  { id: 's042', date: '2024-06-26', category: 'Elektronik', product: 'SSD External 1TB', revenue: 1100000, units: 11, region: 'Jawa' },
]

// ─── Monthly Trend ──────────────────────────────────────────────────────────

export const MONTHLY_TREND: MonthlyTrend[] = [
  { month: 'Jan 2024', revenue: 16260000, units: 371, target: 15000000 },
  { month: 'Feb 2024', revenue: 17000000, units: 215, target: 16000000 },
  { month: 'Mar 2024', revenue: 27925000, units: 192, target: 22000000 },
  { month: 'Apr 2024', revenue: 5487000,  units: 425, target: 18000000 },
  { month: 'Mei 2024', revenue: 10508000, units: 232, target: 19000000 },
  { month: 'Jun 2024', revenue: 9460000,  units: 389, target: 20000000 },
]

// ─── Usability Tasks ────────────────────────────────────────────────────────

export const USABILITY_TASKS: UsabilityTask[] = [
  {
    id: 't1',
    title: 'Menemukan kategori terlaris',
    description: 'Identifikasi kategori produk dengan total pendapatan tertinggi.',
    steps: [
      'Buka halaman Dashboard.',
      'Perhatikan grafik perbandingan atau ringkasan kategori.',
      'Tentukan kategori mana yang memiliki nilai pendapatan terbesar.',
    ],
  },
  {
    id: 't2',
    title: 'Melihat tren rentang tanggal',
    description: 'Gunakan filter tanggal untuk melihat tren bulan Februari–April 2024.',
    steps: [
      'Buka halaman Dashboard.',
      'Temukan kontrol filter tanggal.',
      'Atur tanggal awal ke 2024-02-01 dan tanggal akhir ke 2024-04-30.',
      'Amati perubahan pada grafik tren.',
    ],
  },
  {
    id: 't3',
    title: 'Menemukan nilai kategori tertentu',
    description: 'Temukan total pendapatan kategori "Olahraga".',
    steps: [
      'Buka halaman Dashboard.',
      'Gunakan filter kategori dan pilih "Olahraga".',
      'Baca nilai pendapatan total yang ditampilkan.',
    ],
  },
  {
    id: 't4',
    title: 'Menggunakan filter wilayah',
    description: 'Filter data hanya untuk wilayah "Jawa" dan perhatikan hasilnya.',
    steps: [
      'Buka halaman Dashboard.',
      'Temukan filter wilayah.',
      'Pilih "Jawa".',
      'Amati perubahan data di tabel dan grafik.',
    ],
  },
  {
    id: 't5',
    title: 'Mencari produk tertentu',
    description: 'Gunakan fitur pencarian untuk menemukan data produk "Laptop Pro X".',
    steps: [
      'Buka halaman Dashboard.',
      'Temukan kolom pencarian pada tabel detail.',
      'Ketikkan "Laptop" dan amati hasil pencarian.',
    ],
  },
  {
    id: 't6',
    title: 'Mengisi dan mengirim kuesioner SUS',
    description: 'Lengkapi kuesioner System Usability Scale dan lihat skor yang dihasilkan.',
    steps: [
      'Buka halaman Kuesioner SUS.',
      'Isi seluruh 10 pernyataan.',
      'Tekan tombol kirim.',
      'Baca skor SUS yang dihitung.',
    ],
  },
]

// ─── SUS Items ──────────────────────────────────────────────────────────────

export const SUS_ITEMS: SusItem[] = [
  { number: 1, polarity: 'positive', text: 'Saya rasa saya akan sering menggunakan sistem ini.' },
  { number: 2, polarity: 'negative', text: 'Saya menemukan sistem ini terlalu rumit.' },
  { number: 3, polarity: 'positive', text: 'Saya rasa sistem ini mudah digunakan.' },
  { number: 4, polarity: 'negative', text: 'Saya membutuhkan bantuan orang teknis untuk menggunakan sistem ini.' },
  { number: 5, polarity: 'positive', text: 'Saya menemukan berbagai fungsi dalam sistem ini terintegrasi dengan baik.' },
  { number: 6, polarity: 'negative', text: 'Saya rasa ada terlalu banyak ketidakkonsistenan dalam sistem ini.' },
  { number: 7, polarity: 'positive', text: 'Saya bayangkan kebanyakan orang akan dengan mudah mempelajari sistem ini.' },
  { number: 8, polarity: 'negative', text: 'Saya merasa sistem ini sangat rumit untuk digunakan.' },
  { number: 9, polarity: 'positive', text: 'Saya sangat percaya diri menggunakan sistem ini.' },
  { number: 10, polarity: 'negative', text: 'Saya perlu belajar banyak hal terlebih dahulu sebelum menggunakan sistem ini.' },
]

// ─── UCD Issues (preloaded examples) ───────────────────────────────────────

export const EXAMPLE_ISSUES = [
  {
    id: 'i001',
    category: 'visualisasi' as const,
    severity: 'tinggi' as const,
    description: 'Grafik pie digunakan untuk menampilkan tren waktu, yang menyulitkan pembacaan perubahan.',
    recommendation: 'Ganti grafik pie dengan line chart untuk data tren temporal.',
    timestamp: '2024-06-01T09:00:00Z',
  },
  {
    id: 'i002',
    category: 'navigasi' as const,
    severity: 'sedang' as const,
    description: 'Tidak ada breadcrumb atau indikator halaman aktif di navigasi.',
    recommendation: 'Tambahkan indikator aktif pada menu navigasi dan breadcrumb di halaman detail.',
    timestamp: '2024-06-01T09:05:00Z',
  },
  {
    id: 'i003',
    category: 'keterbacaan' as const,
    severity: 'sedang' as const,
    description: 'Label grafik menggunakan font terlalu kecil dan sulit dibaca di layar kecil.',
    recommendation: 'Perbesar ukuran font label menjadi minimal 12px dan tambahkan tooltip interaktif.',
    timestamp: '2024-06-01T09:10:00Z',
  },
  {
    id: 'i004',
    category: 'konsistensi' as const,
    severity: 'rendah' as const,
    description: 'Warna tombol tidak konsisten antara halaman dashboard dan halaman evaluasi.',
    recommendation: 'Terapkan design token warna yang konsisten di seluruh halaman.',
    timestamp: '2024-06-01T09:15:00Z',
  },
]
