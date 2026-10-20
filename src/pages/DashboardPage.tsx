import { useState, useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  ShoppingCart, TrendingUp, Package, MapPin,
  Search, Filter, Download, Info,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import ChartPanel from '../components/ChartPanel'
import DataTable from '../components/DataTable'
import type { Column } from '../components/DataTable'
import { DEMO_SALES, MONTHLY_TREND, CATEGORIES, REGIONS } from '../data/demoData'

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function fmt(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`
  return `Rp ${n}`
}

// ─── Row type for DataTable (must extend Record<string,unknown>) ──────────────
interface SaleRow {
  id: string
  date: string
  category: string
  product: string
  revenue: number
  units: number
  region: string
  [key: string]: unknown
}

export default function DashboardPage() {
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState('2024-06-30')
  const [category, setCategory] = useState('Semua')
  const [region, setRegion] = useState('Semua')
  const [search, setSearch] = useState('')

  // Filtered records
  const filtered: SaleRow[] = useMemo(() => {
    return DEMO_SALES.filter(r => {
      if (r.date < dateFrom || r.date > dateTo) return false
      if (category !== 'Semua' && r.category !== category) return false
      if (region !== 'Semua' && r.region !== region) return false
      if (search) {
        const q = search.toLowerCase()
        if (!r.product.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q)) return false
      }
      return true
    }) as SaleRow[]
  }, [dateFrom, dateTo, category, region, search])

  // KPI stats
  const totalRevenue = useMemo(() => filtered.reduce((s, r) => s + r.revenue, 0), [filtered])
  const totalUnits = useMemo(() => filtered.reduce((s, r) => s + r.units, 0), [filtered])
  const uniqueProducts = useMemo(() => new Set(filtered.map(r => r.product)).size, [filtered])
  const activeRegions = useMemo(() => new Set(filtered.map(r => r.region)).size, [filtered])

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = new Map<string, { revenue: number; units: number }>()
    filtered.forEach(r => {
      const cur = map.get(r.category) ?? { revenue: 0, units: 0 }
      map.set(r.category, { revenue: cur.revenue + r.revenue, units: cur.units + r.units })
    })
    const totalRev = Array.from(map.values()).reduce((s, v) => s + v.revenue, 0)
    return Array.from(map.entries()).map(([cat, data]) => ({
      category: cat,
      revenue: data.revenue,
      units: data.units,
      share: totalRev > 0 ? Math.round((data.revenue / totalRev) * 100) : 0,
    })).sort((a, b) => b.revenue - a.revenue)
  }, [filtered])

  // Bar chart data
  const barData = useMemo(() => categoryData.map(c => ({
    name: c.category,
    Pendapatan: c.revenue,
  })), [categoryData])

  // Trend data
  const trendData = useMemo(() => {
    return MONTHLY_TREND.map(m => {
      const monthRevenue = filtered
        .filter(r => {
          const d = new Date(r.date)
          const label = `${d.toLocaleString('id-ID', { month: 'short' })} ${d.getFullYear()}`
          return m.month.toLowerCase().startsWith(label.split(' ')[0].toLowerCase())
        })
        .reduce((s, r) => s + r.revenue, 0)
      return {
        month: m.month,
        revenue: monthRevenue > 0 ? monthRevenue : m.revenue,
        target: m.target,
      }
    })
  }, [filtered])

  // Scatter data
  const scatterData = useMemo(() =>
    filtered.map(r => ({ product: r.product, revenue: r.revenue, units: r.units, category: r.category })),
  [filtered])

  // Table columns
  const columns: Column<SaleRow>[] = [
    { key: 'date', label: 'Tanggal', sortable: true },
    { key: 'product', label: 'Produk', sortable: true },
    {
      key: 'category', label: 'Kategori', sortable: true,
      render: (v) => <span className="badge bg-primary-50 text-primary-700">{String(v)}</span>,
    },
    { key: 'region', label: 'Wilayah', sortable: true },
    {
      key: 'units', label: 'Unit', sortable: true, className: 'text-right',
      render: (v) => <span className="tabular-nums">{Number(v).toLocaleString('id-ID')}</span>,
    },
    {
      key: 'revenue', label: 'Pendapatan', sortable: true, className: 'text-right',
      render: (v) => <span className="tabular-nums font-medium">{fmt(Number(v))}</span>,
    },
  ]

  function resetFilters() {
    setDateFrom('2024-01-01'); setDateTo('2024-06-30')
    setCategory('Semua'); setRegion('Semua'); setSearch('')
  }

  const isFiltered = category !== 'Semua' || region !== 'Semua' || search !== ''

  return (
    <div className="p-6 space-y-6 lg:pl-8">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Penjualan</h1>
            <p className="text-sm text-gray-500 mt-1">
              Data demonstrasi — bukan data perusahaan nyata.
              Periode: {dateFrom} s/d {dateTo}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs">
            <Info size={13} />
            <span>Data contoh untuk keperluan evaluasi usability</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
          <Filter size={15} />
          <span>Filter Data</span>
          {isFiltered && (
            <button onClick={resetFilters} className="ml-auto text-xs text-primary-600 hover:underline">
              Reset filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label htmlFor="filter-from" className="form-label">Tanggal Mulai</label>
            <input id="filter-from" type="date" className="form-input" value={dateFrom}
              onChange={e => setDateFrom(e.target.value)} min="2024-01-01" max={dateTo} />
          </div>
          <div>
            <label htmlFor="filter-to" className="form-label">Tanggal Akhir</label>
            <input id="filter-to" type="date" className="form-input" value={dateTo}
              onChange={e => setDateTo(e.target.value)} min={dateFrom} max="2024-12-31" />
          </div>
          <div>
            <label htmlFor="filter-cat" className="form-label">Kategori</label>
            <select id="filter-cat" className="form-select" value={category}
              onChange={e => setCategory(e.target.value)}>
              <option value="Semua">Semua Kategori</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-region" className="form-label">Wilayah</label>
            <select id="filter-region" className="form-select" value={region}
              onChange={e => setRegion(e.target.value)}>
              <option value="Semua">Semua Wilayah</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-search" className="form-label">Cari Produk</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="filter-search" type="text" placeholder="Ketik nama produk…" className="form-input pl-9"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pendapatan" value={fmt(totalRevenue)}
          subtitle={`${filtered.length} transaksi`}
          icon={<TrendingUp size={20} />} colorClass="text-primary-600" />
        <StatCard title="Total Unit Terjual" value={totalUnits.toLocaleString('id-ID')}
          subtitle="unit produk"
          icon={<ShoppingCart size={20} />} colorClass="text-emerald-600" />
        <StatCard title="Variasi Produk" value={uniqueProducts}
          subtitle="jenis produk"
          icon={<Package size={20} />} colorClass="text-amber-600" />
        <StatCard title="Wilayah Aktif" value={activeRegions}
          subtitle="dari 5 wilayah"
          icon={<MapPin size={20} />} colorClass="text-purple-600" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ChartPanel
          title="Tren Pendapatan Bulanan"
          subtitle="Line chart — cocok untuk data temporal"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}jt`} tick={{ fontSize: 11 }} width={48} />
              <Tooltip formatter={(v: number) => [fmt(v), '']} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5}
                dot={{ r: 4 }} name="Pendapatan" />
              <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={1.5}
                strokeDasharray="5 5" dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Proporsi Kategori" subtitle="Donut chart — hanya untuk komposisi">
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-gray-400 text-sm">
              Tidak ada data untuk ditampilkan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} dataKey="revenue" nameKey="category"
                  cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [fmt(v), 'Pendapatan']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartPanel title="Perbandingan Pendapatan per Kategori" subtitle="Bar chart — cocok untuk perbandingan nilai">
          {barData.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
              Tidak ada data untuk ditampilkan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}jt`} tick={{ fontSize: 11 }} width={44} />
                <Tooltip formatter={(v: number) => [fmt(v), 'Pendapatan']} />
                <Bar dataKey="Pendapatan" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>

        <ChartPanel title="Hubungan Pendapatan vs Unit" subtitle="Scatter plot — menampilkan korelasi antar variabel">
          {scatterData.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
              Tidak ada data untuk ditampilkan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <ScatterChart margin={{ top: 4, right: 8, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="units" name="Unit" tick={{ fontSize: 11 }}
                  label={{ value: 'Unit', position: 'insideBottom', offset: -10, fontSize: 11 }} />
                <YAxis dataKey="revenue" name="Pendapatan"
                  tickFormatter={v => `${(v / 1_000_000).toFixed(0)}jt`} tick={{ fontSize: 11 }} width={44} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload as { product: string; category: string; revenue: number; units: number }
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg p-2 text-xs shadow">
                        <p className="font-medium">{d.product}</p>
                        <p className="text-gray-500">{d.category}</p>
                        <p>Pendapatan: {fmt(d.revenue)}</p>
                        <p>Unit: {d.units}</p>
                      </div>
                    )
                  }}
                />
                <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>

      {/* Category Summary */}
      <ChartPanel title="Ringkasan Kategori" subtitle="Diurutkan berdasarkan pendapatan tertinggi">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm" aria-label="Ringkasan kategori">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Pendapatan</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Unit</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Porsi</th>
                <th className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Bar</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                  Tidak ada data sesuai filter.
                </td></tr>
              ) : (
                categoryData.map((c, i) => (
                  <tr key={c.category} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-800">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                        {c.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">{fmt(c.revenue)}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{c.units.toLocaleString('id-ID')}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-gray-500">{c.share}%</td>
                    <td className="py-2 px-3 w-32">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${c.share}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ChartPanel>

      {/* Detail Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Tabel Detail Transaksi</h3>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} record ditemukan</p>
          </div>
          <button className="btn-secondary text-xs"
            onClick={() => alert('Fitur ekspor lengkap tersedia di halaman Hasil Evaluasi.')}>
            <Download size={13} /> Ekspor CSV
          </button>
        </div>
        <DataTable
          data={filtered}
          columns={columns}
          pageSize={8}
          emptyMessage="Tidak ada data sesuai filter yang dipilih."
          aria-label="Tabel detail transaksi"
        />
      </div>
    </div>
  )
}
