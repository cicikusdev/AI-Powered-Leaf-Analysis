import { NavLink } from 'react-router-dom'
import { Upload, BarChart3, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="navbar-brand-icon">🌿</span>
        <span className="navbar-brand-text">LeafScan</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          <Upload className="nav-icon" />
          {t('nav_analysis')}
        </NavLink>
        <NavLink
          to="/metrics"
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          <BarChart3 className="nav-icon" />
          {t('nav_metrics')}
        </NavLink>
      </div>
      
      <div className="navbar-actions">
        <button onClick={toggleLanguage} className="lang-toggle-btn">
          <Globe className="nav-icon" style={{width: 16, height: 16, marginRight: 6}} />
          {t('lang_btn')}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
