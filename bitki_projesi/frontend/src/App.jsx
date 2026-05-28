import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import AnalysisPage from './pages/AnalysisPage'
import MetricsPage from './pages/MetricsPage'
import { LanguageProvider } from './context/LanguageContext'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <LanguageProvider>
      <Navbar />
      <div className="page-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnalysisPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </LanguageProvider>
  )
}

export default App
