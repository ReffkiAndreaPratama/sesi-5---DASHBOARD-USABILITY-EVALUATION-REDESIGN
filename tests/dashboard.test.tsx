import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import DashboardPage from '../src/pages/DashboardPage'
import { DEMO_SALES, CATEGORIES } from '../src/data/demoData'

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  )
}

describe('DashboardPage', () => {
  it('renders page title', () => {
    renderDashboard()
    expect(screen.getByText('Dashboard Penjualan')).toBeInTheDocument()
  })

  it('renders demo data notice', () => {
    renderDashboard()
    expect(screen.getByText(/data demonstrasi/i)).toBeInTheDocument()
  })

  it('renders stat cards', () => {
    renderDashboard()
    expect(screen.getByText('Total Pendapatan')).toBeInTheDocument()
    expect(screen.getByText('Total Unit Terjual')).toBeInTheDocument()
    expect(screen.getByText('Variasi Produk')).toBeInTheDocument()
    expect(screen.getByText('Wilayah Aktif')).toBeInTheDocument()
  })

  it('renders filter controls', () => {
    renderDashboard()
    expect(screen.getByLabelText('Tanggal Mulai')).toBeInTheDocument()
    expect(screen.getByLabelText('Tanggal Akhir')).toBeInTheDocument()
    // Use exact match for 'Kategori' label (filter select)
    expect(screen.getByRole('combobox', { name: 'Kategori' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Wilayah' })).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderDashboard()
    expect(screen.getByPlaceholderText(/ketik nama produk/i)).toBeInTheDocument()
  })

  it('filters data by category', () => {
    renderDashboard()
    const categorySelect = screen.getByRole('combobox', { name: 'Kategori' })
    fireEvent.change(categorySelect, { target: { value: 'Elektronik' } })
    const elektronikCount = DEMO_SALES.filter(s => s.category === 'Elektronik').length
    expect(screen.getByText(new RegExp(`${elektronikCount} record`, 'i'))).toBeInTheDocument()
  })

  it('shows all categories in dropdown', () => {
    renderDashboard()
    const categorySelect = screen.getByRole('combobox', { name: 'Kategori' })
    CATEGORIES.forEach(cat => {
      expect(within(categorySelect).getByRole('option', { name: cat })).toBeInTheDocument()
    })
  })

  it('filters by search term', () => {
    renderDashboard()
    const searchInput = screen.getByPlaceholderText(/ketik nama produk/i)
    fireEvent.change(searchInput, { target: { value: 'Laptop' } })
    expect(screen.getByText(/1 record/i)).toBeInTheDocument()
  })

  it('shows no data message when filters yield empty result', () => {
    renderDashboard()
    const searchInput = screen.getByPlaceholderText(/ketik nama produk/i)
    fireEvent.change(searchInput, { target: { value: 'produk_yang_tidak_ada_xyz_123' } })
    // Multiple empty-state messages may appear; assert at least one
    const messages = screen.getAllByText(/tidak ada data sesuai filter/i)
    expect(messages.length).toBeGreaterThanOrEqual(1)
  })

  it('shows reset filter button when filter is active', () => {
    renderDashboard()
    const categorySelect = screen.getByRole('combobox', { name: 'Kategori' })
    fireEvent.change(categorySelect, { target: { value: 'Elektronik' } })
    expect(screen.getByText(/reset filter/i)).toBeInTheDocument()
  })

  it('resets filters correctly', () => {
    renderDashboard()
    const categorySelect = screen.getByRole('combobox', { name: 'Kategori' })
    fireEvent.change(categorySelect, { target: { value: 'Elektronik' } })
    const resetBtn = screen.getByText(/reset filter/i)
    fireEvent.click(resetBtn)
    expect(screen.getByDisplayValue('Semua Kategori')).toBeInTheDocument()
  })

  it('renders detail transaction table', () => {
    renderDashboard()
    expect(screen.getByText(/tabel detail transaksi/i)).toBeInTheDocument()
  })

  it('renders chart panel titles', () => {
    renderDashboard()
    expect(screen.getByText(/tren pendapatan bulanan/i)).toBeInTheDocument()
    expect(screen.getByText(/proporsi kategori/i)).toBeInTheDocument()
    expect(screen.getByText(/perbandingan pendapatan per kategori/i)).toBeInTheDocument()
  })
})
