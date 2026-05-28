import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const features = [
  {
    icon: '🔬',
    title: 'Derin Öğrenme',
    desc: 'MobileNetV2 mimarisi ve transfer learning ile %98 doğrulukla hastalık tespiti.',
  },
  {
    icon: '🌿',
    title: '38 Hastalık Sınıfı',
    desc: '14 farklı bitkiye ait 38 hastalık sınıfını tanıyabilen kapsamlı model.',
  },
  {
    icon: '⚡',
    title: 'Anlık Analiz',
    desc: 'Yaprak fotoğrafınızı yükleyin, saniyeler içinde sonucu alın.',
  },
  {
    icon: '💊',
    title: 'Tedavi Önerisi',
    desc: 'Tespit edilen hastalık için detaylı açıklama ve tedavi önerisi.',
  },
]

const steps = [
  { num: '01', title: 'Fotoğraf Yükle', desc: 'Hastalıklı olduğunu düşündüğünüz yaprağın net bir fotoğrafını yükleyin.' },
  { num: '02', title: 'Yaprağı Kırp', desc: 'Makas ikonu ile yaprağı çerçeve içine alarak modelin doğruluğunu artırın.' },
  { num: '03', title: 'Analiz Et', desc: 'Yapay zeka modelimiz yaprağı analiz ederek bitki türü ve hastalığını belirler.' },
  { num: '04', title: 'Öneri Al', desc: 'Hastalık açıklaması ve tedavi önerisiyle bitkini korumaya başla.' },
]

const stats = [
  { value: '%98', label: 'Model Doğruluğu' },
  { value: '38', label: 'Hastalık Sınıfı' },
  { value: '14', label: 'Bitki Türü' },
  { value: '54K+', label: 'Eğitim Görseli' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hero-badge"
          >
            <span className="hero-badge-dot" />
            Yapay Zeka Destekli Bitki Analizi
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hero-title"
          >
            Bitkinin hastalığını
            <br />
            <span className="hero-title-accent">saniyeler içinde</span>
            <br />
            tespit et
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hero-desc"
          >
            LeafScan, derin öğrenme ile yaprak fotoğrafından bitki hastalığını tespit eder.
            <br />
            14 bitki türü, 38 hastalık sınıfı, %98 doğruluk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hero-actions"
          >
            <button className="hero-btn-primary" onClick={() => navigate('/analyze')}>
              <span>Analizi Başlat</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate('/metrics')}>
              Model Metrikleri
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hero-stats"
          >
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hero-visual"
        >
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="hero-card-dots">
                <span /><span /><span />
              </div>
              <span className="hero-card-title">LeafScan Analizi</span>
            </div>
            <div className="hero-card-img">
              <div className="hero-card-leaf">🍃</div>
            </div>
            <div className="hero-card-result">
              <div className="hero-card-badge healthy">✅ Sağlıklı Yaprak</div>
              <div className="hero-card-row">
                <span>Bitki</span>
                <strong>🍎 Elma</strong>
              </div>
              <div className="hero-card-row">
                <span>Model Güveni</span>
                <strong>%99.2</strong>
              </div>
              <div className="hero-card-progress">
                <div className="hero-card-progress-fill" style={{ width: '99.2%' }} />
              </div>
            </div>
          </div>

          {/* Floating tags */}
          <div className="hero-tag hero-tag-1">🌿 38 Hastalık Sınıfı</div>
          <div className="hero-tag hero-tag-2">⚡ Anlık Sonuç</div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="section-tag">Özellikler</span>
            <h2 className="section-title">Neden LeafScan?</h2>
            <p className="section-desc">Gelişmiş yapay zeka teknolojisi ile bitkilerinizi koruyun.</p>
          </motion.div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="feature-card"
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="section-tag">Nasıl Çalışır?</span>
            <h2 className="section-title">4 Adımda Hastalık Tespiti</h2>
            <p className="section-desc">Birkaç saniye içinde bitkinin sağlık durumunu öğren.</p>
          </motion.div>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="step-card"
              >
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="step-arrow">→</div>}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="how-cta"
          >
            <button className="hero-btn-primary" onClick={() => navigate('/analyze')}>
              <span>Hemen Dene</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-icon">🌿</span>
            <span className="footer-name">LeafScan</span>
          </div>
          <p className="footer-copy">LeafScan v2.0 · MobileNetV2 + Transfer Learning · PlantVillage & PlantDoc Dataset · 2026</p>
        </div>
      </footer>
    </div>
  )
}
