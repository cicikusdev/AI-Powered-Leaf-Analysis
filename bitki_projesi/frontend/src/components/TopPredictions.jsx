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
        >
          <div className="prediction-info">
            <span className="prediction-name">
              {language === 'en' && pred.class_name_en ? pred.class_name_en : pred.class_name}
            </span>
            <div className="prediction-bar-container">
              <div
                className="prediction-bar"
                style={{ width: `${pred.confidence}%` }}
              />
            </div>
          </div>
          <span className="prediction-value">%{pred.confidence.toFixed(1)}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default TopPredictions
