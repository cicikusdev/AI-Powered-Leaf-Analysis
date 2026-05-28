import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

function ConfidenceBar({ confidence = 0 }) {
  const { t } = useLanguage()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(confidence), 100)
    return () => clearTimeout(timer)
  }, [confidence])

  const getLevel = () => {
    if (confidence >= 70) return 'high'
    if (confidence >= 50) return 'medium'
    return 'low'
  }

  return (
    <div className="confidence-container">
      <div className="confidence-label">
        <span className="confidence-label-text">{t('model_confidence')}</span>
        <motion.span
          className="confidence-label-value"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          %{confidence.toFixed(1)}
        </motion.span>
      </div>
      <div className="confidence-bar-bg">
        <div
          className={`confidence-bar-fill ${getLevel()}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export default ConfidenceBar
