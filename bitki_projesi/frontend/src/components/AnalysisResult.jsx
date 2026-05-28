import { motion } from 'framer-motion'
import ConfidenceBar from './ConfidenceBar'
import TopPredictions from './TopPredictions'
import { useLanguage } from '../context/LanguageContext'

function AnalysisResult({ result, loading }) {
  const { t, language } = useLanguage()
  if (loading) {
    return (
      <div className="result-panel">
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">{t('analyzing_text')}</p>
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
            <div className="instruction-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>{t('inst_step1_title')}</h4>
                <p>{t('inst_step1_desc')}</p>
              </div>
            </div>
            <div className="instruction-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>{t('inst_step2_title')}</h4>
                <p>{t('inst_step2_desc')}</p>
              </div>
            </div>
            <div className="instruction-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>{t('inst_step3_title')}</h4>
                <p>{t('inst_step3_desc')}</p>
              </div>
            </div>
            <div className="instruction-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>{t('inst_step4_title')}</h4>
                <p>{t('inst_step4_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="result-panel">
      <motion.div
        className="result-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Status Badge */}
        <div>
          {result.is_healthy ? (
            <div className="result-badge healthy">✅ {t('badge_healthy')}</div>
          ) : (
            <div className="result-badge diseased">⚠️ {t('badge_diseased')}</div>
          )}
        </div>

        {/* Plant & Disease Info */}
        <div className="result-detail-row">
          <span className="result-detail-label">{t('plant_label')}</span>
          <span className="result-detail-value">🌱 {language === 'en' ? result.plant_en : result.plant || '—'}</span>
        </div>

        {!result.is_healthy && (
          <div className="result-detail-row">
            <span className="result-detail-label">{t('disease_label')}</span>
            <span className="result-detail-value">🦠 {language === 'en' ? result.disease_en : result.disease || '—'}</span>
          </div>
        )}

        {/* Confidence */}
        <ConfidenceBar confidence={result.confidence} />

        {/* Top Predictions */}
        {result.top_predictions && result.top_predictions.length > 0 && (
          <TopPredictions predictions={result.top_predictions} />
        )}

        {/* Description */}
        {result.description && (
          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="info-card-title">📋 {t('about_disease')}</div>
            <p className="info-card-text">{result.description}</p>
          </motion.div>
        )}

        {/* Recommendation */}
        {!result.is_healthy && result.recommendation && (
          <motion.div
            className="info-card recommendation"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <div className="info-card-title">💊 {t('recommendation')}</div>
            <p className="info-card-text">{result.recommendation}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default AnalysisResult
