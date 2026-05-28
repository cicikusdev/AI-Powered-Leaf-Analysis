import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUpload from '../components/ImageUpload'
import AnalysisResult from '../components/AnalysisResult'
import { predictImage } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const DECO_ICONS = ['🍎', '🍅', '🥔', '🌽', '🍇', '🍓', '🍑', '🫑', '🌿', '🍃', '🌱', '🍀', '🥦', '🥕', '🫐', '🍋']

const DECO_POSITIONS = [
  { top: '8%', left: '2%', size: '2rem', rotate: -20, delay: 0 },
  { top: '15%', right: '3%', size: '2.5rem', rotate: 15, delay: 0.3 },
  { top: '35%', left: '1%', size: '1.8rem', rotate: 10, delay: 0.6 },
  { top: '55%', right: '2%', size: '2rem', rotate: -15, delay: 0.9 },
  { top: '70%', left: '3%', size: '2.2rem', rotate: 25, delay: 0.4 },
  { top: '85%', right: '4%', size: '1.6rem', rotate: -10, delay: 0.7 },
  { top: '25%', left: '5%', size: '1.4rem', rotate: 30, delay: 1.0 },
  { top: '60%', right: '5%', size: '1.8rem', rotate: -25, delay: 0.2 },
]

const SUPPORTED_PLANTS = [
  { emoji: '🍎', name: 'Elma', diseases: ['Karaleke', 'Kara Çürüklük', 'Sedir Pası', 'Sağlıklı'] },
  { emoji: '🫐', name: 'Yaban Mersini', diseases: ['Sağlıklı'] },
  { emoji: '🍒', name: 'Kiraz', diseases: ['Küllü Mildiyö', 'Sağlıklı'] },
  { emoji: '🌽', name: 'Mısır', diseases: ['Cercospora', 'Yaygın Pas', 'Kuzey Yaprak Yanıklığı', 'Sağlıklı'] },
  { emoji: '🍇', name: 'Üzüm', diseases: ['Kara Çürüklük', 'Esca', 'Yaprak Yanıklığı', 'Sağlıklı'] },
  { emoji: '🍊', name: 'Portakal', diseases: ['Huanglongbing'] },
  { emoji: '🍑', name: 'Şeftali', diseases: ['Bakteriyel Leke', 'Sağlıklı'] },
  { emoji: '🫑', name: 'Biber', diseases: ['Bakteriyel Leke', 'Sağlıklı'] },
  { emoji: '🥔', name: 'Patates', diseases: ['Erken Yanıklık', 'Geç Yanıklık', 'Sağlıklı'] },
  { emoji: '🫐', name: 'Ahududu', diseases: ['Sağlıklı'] },
  { emoji: '🌱', name: 'Soya Fasulyesi', diseases: ['Sağlıklı'] },
  { emoji: '🎃', name: 'Kabak', diseases: ['Küllü Mildiyö'] },
  { emoji: '🍓', name: 'Çilek', diseases: ['Yaprak Yanması', 'Sağlıklı'] },
  { emoji: '🍅', name: 'Domates', diseases: ['Bakteriyel Leke', 'Erken Yanıklık', 'Geç Yanıklık', 'Yaprak Küfü', 'Septoria', 'Kırmızı Örümcek', 'Hedef Leke', 'Sarı Yaprak Kıvırcıklık Virüsü', 'Mozaik Virüsü', 'Sağlıklı'] },
]

function AnalysisPage() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewBase64, setPreviewBase64] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [showPlants, setShowPlants] = useState(false)

  const handleImageSelect = (file) => {
    setSelectedImage(file)
    setResult(null)
    setError(null)

    if (!file) {
      setPreviewBase64(null)
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      setPreviewBase64(base64)

      setLoading(true)
      try {
        const data = await predictImage(file, 'best_model_v6')
        setResult(data)

        setHistory(prev => [{
          id: Date.now(),
          preview: url,
          plant: data.plant,
          disease: data.disease,
          isHealthy: data.is_healthy,
          confidence: data.confidence,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }, ...prev].slice(0, 5))
      } catch (err) {
        console.error('Prediction error:', err)
        setError(err.response?.data?.error || 'Analiz sırasında bir hata oluştu.')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      className="analysis-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'relative' }}
    >
      {DECO_POSITIONS.map((pos, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: pos.delay, duration: 0.5 }}
          style={{
            position: 'fixed', top: pos.top, left: pos.left, right: pos.right,
            fontSize: pos.size, transform: `rotate(${pos.rotate}deg)`,
            opacity: 0.07, pointerEvents: 'none', userSelect: 'none', zIndex: 0, filter: 'blur(0.5px)',
          }}
        >
          {DECO_ICONS[i % DECO_ICONS.length]}
        </motion.span>
      ))}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-header text-center">
          <h1 className="page-title">
            <span className="gradient-text">{t('page_title_gradient')}</span> {t('page_title_main')}
          </h1>
          <p className="page-subtitle">{t('page_subtitle')}</p>
        </div>

        <div className="analysis-grid">
          <div className="analysis-column left-column">
            <ImageUpload onImageSelect={handleImageSelect} selectedImage={selectedImage} loading={loading} />
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ marginTop: '16px', padding: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', color: '#dc2626', fontSize: '0.875rem' }}>
                <strong>{t('error_title')}</strong> {error}
              </motion.div>
            )}
          </div>
          <div className="analysis-column right-column">
            <AnalysisResult result={result} loading={loading} previewImage={previewUrl} previewBase64={previewBase64} />
          </div>
        </div>

        {/* DESTEKLENEn BİTKİLER PANELİ */}
        <div style={{ marginTop: '40px' }}>
          <button
            onClick={() => setShowPlants(!showPlants)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.2)',
              background: showPlants ? 'rgba(22,163,74,0.08)' : 'white',
              color: 'var(--green-700)', fontWeight: 600, fontSize: '0.9rem',
              cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <span>🌿 Desteklenen Bitkiler ve Hastalıklar</span>
            <span style={{ transition: 'transform 0.3s ease', transform: showPlants ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '0.8rem' }}>▼</span>
            <span style={{ marginLeft: 'auto', background: 'rgba(22,163,74,0.1)', color: 'var(--green-700)', borderRadius: '9999px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
              14 Bitki · 38 Sınıf
            </span>
          </button>

          <AnimatePresence>
            {showPlants && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: '12px', padding: '24px', background: 'white',
                  borderRadius: '16px', border: '1px solid rgba(22,163,74,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '16px',
                  }}>
                    {SUPPORTED_PLANTS.map((plant, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          padding: '14px 16px', borderRadius: '12px',
                          background: 'var(--slate-50)', border: '1px solid rgba(22,163,74,0.08)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(22,163,74,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--slate-50)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '1.4rem' }}>{plant.emoji}</span>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{plant.name}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {plant.diseases.map((d, j) => (
                            <span key={j} style={{
                              fontSize: '0.68rem', padding: '2px 8px', borderRadius: '9999px',
                              background: d === 'Sağlıklı' ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.08)',
                              color: d === 'Sağlıklı' ? 'var(--green-700)' : '#dc2626',
                              fontWeight: 500,
                            }}>
                              {d}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ANALİZ GEÇMİŞİ */}
        {history.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🕐 Son Analizler
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {history.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ translateY: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                  style={{
                    background: 'white', borderRadius: '16px', overflow: 'hidden',
                    border: `1px solid ${item.isHealthy ? 'rgba(22,163,74,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ height: '100px', overflow: 'hidden', position: 'relative' }}>
                    <img src={item.preview} alt={item.plant} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: item.isHealthy ? 'rgba(22,163,74,0.9)' : 'rgba(239,68,68,0.9)',
                      color: 'white', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700
                    }}>
                      {item.isHealthy ? '✅ Sağlıklı' : '⚠️ Hastalık'}
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{item.plant}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                      {item.isHealthy ? 'Sağlıklı' : item.disease}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--green-600)', fontWeight: 600 }}>%{item.confidence.toFixed(1)}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{item.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default AnalysisPage
