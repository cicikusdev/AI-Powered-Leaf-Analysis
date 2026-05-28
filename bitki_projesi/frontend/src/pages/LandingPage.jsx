import './LandingPage.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🔬',
    title: 'Derin Öğrenme',
    desc: 'MobileNetV2 mimarisi ve transfer learning ile %98 doğrulukla hastalık tespiti.',
    color: '#16a34a',
  },
  {
    icon: '🌿',
    title: '38 Hastalık Sınıfı',
    desc: '14 farklı bitkiye ait 38 hastalık sınıfını tanıyabilen kapsamlı model.',
    color: '#059669',
  },
  {
    icon: '⚡',
    title: 'Anlık Analiz',
    desc: 'Yaprak fotoğrafınızı yükleyin, saniyeler içinde sonucu alın.',
    color: '#0d9488',
  },
  {
    icon: '💊',
    title: 'Tedavi Önerisi',
    desc: 'Tespit edilen hastalık için detaylı açıklama ve tedavi önerisi.',
    color: '#15803d',
  },
]

const steps = [
  { num: '01', icon: '📸', title: 'Fotoğraf Yükle', desc: 'Hastalıklı olduğunu düşündüğünüz yaprağın net bir fotoğrafını yükleyin.' },
  { num: '02', icon: '✂️', title: 'Yaprağı Kırp', desc: 'Makas ikonu ile yaprağı çerçeve içine alarak modelin doğruluğunu artırın.' },
  { num: '03', icon: '🤖', title: 'Analiz Et', desc: 'Yapay zeka modelimiz yaprağı analiz ederek bitki türü ve hastalığını belirler.' },
  { num: '04', icon: '💡', title: 'Öneri Al', desc: 'Hastalık açıklaması ve tedavi önerisiyle bitkini korumaya başla.' },
]

const stats = [
  { value: '%98', label: 'Model Doğruluğu' },
  { value: '38', label: 'Hastalık Sınıfı' },
  { value: '14', label: 'Bitki Türü' },
  { value: '54K+', label: 'Eğitim Görseli' },
]

const plants = ['🍎', '🍅', '🥔', '🌽', '🍇', '🍓', '🍑', '🫑']

export default function LandingPage() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)

  return (
    <div className={`lp ${dark ? 'lp-dark' : 'lp-light'}`}>

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <span className="lp-nav-leaf">🌿</span>
          <span className="lp-nav-name">LeafScan</span>
        </div>
        <div className="lp-nav-actions">
          <button className="lp-theme-toggle" onClick={() => setDark(!dark)} title="Tema Değiştir">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="lp-nav-btn-ghost" onClick={() => navigate('/metrics')}>Metrikler</button>
          <button className="lp-nav-btn-primary" onClick={() => navigate('/analyze')}>Analiz Başlat →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-deco lp-deco-1">🍃</div>
        <div className="lp-deco lp-deco-2">🌿</div>
        <div className="lp-deco lp-deco-3">🍀</div>
        <div className="lp-deco lp-deco-4">🌱</div>

        <div className="lp-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lp-hero-left"
          >
            <div className="lp-pill">
              <span className="lp-pill-dot" />
              Yapay Zeka Destekli · %98 Doğruluk
            </div>

            <h1 className="lp-hero-title">
              Bitkinin sağlığını<br />
              <span className="lp-hero-accent">anında öğren</span>
            </h1>

            <p className="lp-hero-desc">
              Yaprak fotoğrafı yükle, LeafScan bitki türünü ve hastalığını
              saniyeler içinde tespit etsin. 14 bitki, 38 hastalık sınıfı.
            </p>

            <div className="lp-hero-btns">
              <button className="lp-btn-primary" onClick={() => navigate('/analyze')}>
                🔍 Analizi Başlat
              </button>
              <button className="lp-btn-outline" onClick={() => navigate('/metrics')}>
                📊 Model Metrikleri
              </button>
            </div>

            <div className="lp-stats">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="lp-stat"
                >
                  <span className="lp-stat-val">{s.value}</span>
                  <span className="lp-stat-label">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lp-hero-right"
          >
            <div className="lp-mockup">
              <div className="lp-mockup-header">
                <div className="lp-mockup-dots">
                  <span className="dot-red" /><span className="dot-yellow" /><span className="dot-green" />
                </div>
                <span className="lp-mockup-title">LeafScan Analizi</span>
              </div>

              <div className="lp-mockup-img">
                <div className="lp-mockup-leaf-wrap">
                  <span className="lp-mockup-leaf">🍃</span>
                  <div className="lp-mockup-scan" />
                </div>
              </div>

              <div className="lp-mockup-result">
                <div className="lp-mockup-badge">✅ Sağlıklı Yaprak</div>
                <div className="lp-mockup-row">
                  <span>Bitki</span>
                  <strong>🍎 Elma</strong>
                </div>
                <div className="lp-mockup-row">
                  <span>Güven</span>
                  <strong className="lp-mockup-conf">%99.2</strong>
                </div>
                <div className="lp-mockup-bar">
                  <motion.div
                    className="lp-mockup-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: '99.2%' }}
                    transition={{ duration: 1.5, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>
              </div>
            </div>

            <div className="lp-plants">
              {plants.map((p, i) => (
                <motion.span
                  key={i}
                  className="lp-plant-icon"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, type: 'spring' }}
                >
                  {p}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features">
        <div className="lp-section-wrap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-section-head"
          >
            <span className="lp-tag">Neden LeafScan?</span>
            <h2 className="lp-section-title">Akıllı Bitki Sağlığı</h2>
            <p className="lp-section-sub">Gelişmiş yapay zeka ile bitkilerinizi koruyun.</p>
          </motion.div>

          <div className="lp-features-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="lp-feature-card"
                style={{ '--accent': f.color }}
              >
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how">
        <div className="lp-section-wrap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-section-head"
          >
            <span className="lp-tag">Nasıl Çalışır?</span>
            <h2 className="lp-section-title">4 Adımda Tespit</h2>
            <p className="lp-section-sub">Birkaç saniye içinde bitkinin sağlık durumunu öğren.</p>
          </motion.div>

          <div className="lp-steps">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="lp-step"
              >
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="lp-how-cta"
          >
            <button className="lp-btn-primary" onClick={() => navigate('/analyze')}>
              🚀 Hemen Dene
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span>🌿</span>
            <span className="lp-footer-name">LeafScan</span>
          </div>
          <p className="lp-footer-copy">
            LeafScan v2.0 · MobileNetV2 + Transfer Learning · PlantVillage & PlantDoc · 2026
          </p>
          <button className="lp-footer-btn" onClick={() => navigate('/analyze')}>
            Analiz Başlat →
          </button>
        </div>
      </footer>
    </div>
  )
}
