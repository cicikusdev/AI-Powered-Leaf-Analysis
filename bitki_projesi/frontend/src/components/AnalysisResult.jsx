import { motion, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import ConfidenceBar from './ConfidenceBar'
import TopPredictions from './TopPredictions'
import { useLanguage } from '../context/LanguageContext'

function AnalysisResult({ result, loading }) {
  const { t, language } = useLanguage()
  const resultRef = useRef(null)

  const handlePrint = () => {
    window.print()
  }

  const handleSave = () => {
    if (!result) return
    const content = `
LeafScan - Analiz Sonucu
========================
Bitki: ${result.plant || result.plant_en}
Durum: ${result.is_healthy ? 'Sağlıklı' : 'Hastalık Tespit Edildi'}
${!result.is_healthy ? `Hastalık: ${result.disease || result.disease_en}` : ''}
Model Güveni: %${result.confidence?.toFixed(1)}
${result.description ? `\nAçıklama: ${result.description}` : ''}
${result.recommendation ? `\nÖneri: ${result.recommendation}` : ''}

Tarih: ${new Date().toLocaleString('tr-TR')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leafscan-analiz-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="result-panel" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'scan-leaf 1.5s ease-in-out infinite' }}>🍃</div>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>
            {t('analyzing_text')}
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '8px' }}>
            Yapay zeka analiz ediyor...
          </p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="result-panel">
        <div className="instructions">
          <h3 className="instructions-title">🔬 {t('inst_title')}</h3>
          <div className="instructions-steps">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="instruction-step">
                <div className="step-number">{n}</div>
                <div className="step-content">
                  <h4>{t(`inst_step${n}_title`)}</h4>
                  <p>{t(`inst_step${n}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="result-panel"
        ref={resultRef}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        style={{
          border: result.is_healthy
            ? '1.5px solid rgba(22,163,74,0.2)'
            : '1.5px solid rgba(239,68,68,0.2)',
        }}
      >
        <motion.div
          className="result-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Durum Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            {result.is_healthy ? (
              <div className="result-badge healthy" style={{ fontSize: '1rem', padding: '12px 24px' }}>
                ✅ {t('badge_healthy')}
              </div>
            ) : (
              <div className="result-badge diseased" style={{ fontSize: '1rem', padding: '12px 24px' }}>
                ⚠️ {t('badge_diseased')}
              </div>
            )}
          </motion.div>

          {/* Bitki & Hastalık */}
          <div className="result-detail-row">
            <span className="result-detail-label">{t('plant_label')}</span>
            <span className="result-detail-value">🌱 {language === 'en' ? result.plant_en : result.plant || '—'}</span>
          </div>

          {!result.is_healthy && (
            <motion.div
              className="result-detail-row"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{ background: 'rgba(239,68,68,0.04)', borderLeft: '3px solid #ef4444' }}
            >
              <span className="result-detail-label">{t('disease_label')}</span>
              <span className="result-detail-value" style={{ color: '#dc2626' }}>
                🦠 {language === 'en' ? result.disease_en : result.disease || '—'}
              </span>
            </motion.div>
          )}

          {/* Güven */}
          <ConfidenceBar confidence={result.confidence} />

          {/* Top Tahminler */}
          {result.top_predictions?.length > 0 && (
            <TopPredictions predictions={result.top_predictions} />
          )}

          {/* Açıklama */}
          {result.description && (
            <motion.div
              className="info-card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="info-card-title">📋 {t('about_disease')}</div>
              <p className="info-card-text">{result.description}</p>
            </motion.div>
          )}

          {/* Öneri */}
          {!result.is_healthy && result.recommendation && (
            <motion.div
              className="info-card recommendation"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="info-card-title">💊 {t('recommendation')}</div>
              <p className="info-card-text">{result.recommendation}</p>
            </motion.div>
          )}

          {/* Kaydet / Yazdır Butonları */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '10px', marginTop: '8px' }}
          >
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(22,163,74,0.2)',
                background: 'rgba(22,163,74,0.06)',
                color: 'var(--green-700)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(22,163,74,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(22,163,74,0.06)'}
            >
              💾 Kaydet
            </button>
            <button
              onClick={handlePrint}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'var(--slate-50)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--slate-50)'}
            >
              🖨️ Yazdır
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AnalysisResult
