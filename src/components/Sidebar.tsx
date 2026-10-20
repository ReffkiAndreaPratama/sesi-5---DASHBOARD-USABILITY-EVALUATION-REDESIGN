import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  FileQuestion,
  Layers,
  BarChart3,
  Info,
  Menu,
  X,
  FlaskConical,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard',           icon: LayoutDashboard },
  { to: '/evaluasi',    label: 'Evaluasi Usability',  icon: ClipboardCheck  },
  { to: '/sus',         label: 'Kuesioner SUS',        icon: FileQuestion    },
  { to: '/perancangan', label: 'Perancangan Ulang',    icon: Layers          },
  { to: '/hasil',       label: 'Hasil Evaluasi',       icon: BarChart3       },
  { to: '/tentang',     label: 'Tentang Proyek',       icon: Info            },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm lg:hidden"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed z-40 h-full w-64 bg-white border-r border-gray-200 flex flex-col
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white shrink-0">
            <FlaskConical size={18} />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 leading-tight">UsabilityLab</p>
            <p className="text-xs text-gray-500">Dashboard Evaluation</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto" aria-label="Navigasi utama">
          <ul className="space-y-0.5 px-3">
            {NAV_ITEMS.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100
                     ${isActive
                       ? 'bg-primary-50 text-primary-700'
                       : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                     }`
                  }
                >
                  <item.icon size={18} className="shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Data demonstrasi — bukan data nyata.
          </p>
          <p className="text-xs text-gray-400 mt-0.5">v1.0.0 · 2024</p>
        </div>
      </aside>
    </>
  )
}
