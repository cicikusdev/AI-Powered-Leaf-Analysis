import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

function TopPredictions({ predictions = [] }) {
  const { t, language } = useLanguage()
  const top5 = predictions.slice(0, 5)
  if (top5.length === 0) return null

  return (
    <div className="top-predictions">
      <h4 className="top-predictions-title">{t('top_5_predictions')}</h4>
      {top5.map((pred, index) => (
        <motion.div
          key={index}
          className="prediction-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}>
              {language === 'en' && pred.class_name_en ? pred.class_name_en : pred.class_name}
            </span>
            <div style={{
              height: '6px',
              background: 'var(--slate-100)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pred.confidence}%`,
                background: 'linear-gradient(90deg, #16a34a, #059669)',
                borderRadius: '9999px',
              }} />
            </div>
          </div>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            minWidth: '42px',
            textAlign: 'right',
            flexShrink: 0,
          }}>
            %{pred.confidence.toFixed(1)}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export default TopPredictions
