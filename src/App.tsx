import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import UsabilityPage from './pages/UsabilityPage'
import SusPage from './pages/SusPage'
import RedesignPage from './pages/RedesignPage'
import ResultsPage from './pages/ResultsPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/evaluasi" element={<UsabilityPage />} />
            <Route path="/sus" element={<SusPage />} />
            <Route path="/perancangan" element={<RedesignPage />} />
            <Route path="/hasil" element={<ResultsPage />} />
            <Route path="/tentang" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
