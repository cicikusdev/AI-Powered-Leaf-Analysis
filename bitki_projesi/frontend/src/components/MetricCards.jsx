import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Target, Crosshair, Eye, Activity, TrendingDown, AreaChart } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function AnimatedNumber({ value, suffix = '%', decimals = 1 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1200
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = start + (end - start) * eased
      setDisplay(current)
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span>{display.toFixed(decimals)}{suffix}</span>
  )
}

const getCardConfigs = (t) => [
  {
    key: 'accuracy',
    label: t('accuracy_label'),
    sublabel: 'Overall Accuracy',
    color: 'green',
    icon: Target,
    getValue: (m) => m?.overall_accuracy ?? m?.weighted_recall,
  },
  {
    key: 'precision',
    label: t('precision_label'),
    sublabel: 'Weighted Precision',
    color: 'blue',
    icon: Crosshair,
    getValue: (m) => m?.weighted_precision ?? m?.macro_precision,
  },
  {
    key: 'recall',
    label: t('recall_label'),
    sublabel: 'Weighted Recall',
    color: 'purple',
    icon: Eye,
    getValue: (m) => m?.weighted_recall ?? m?.macro_recall,
  },
  {
    key: 'f1',
    label: t('f1_label'),
    sublabel: 'Weighted F1',
    color: 'orange',
    icon: Activity,
    getValue: (m) => m?.weighted_f1 ?? m?.macro_f1,
  },
  {
    key: 'wmape',
    label: t('wmape_label'),
    sublabel: 'Ağırlıklı Hata',
    color: 'red',
    icon: TrendingDown,
    getValue: (m) => m?.wmape,
  },
  {
    key: 'auc',
    label: 'AUC',
    sublabel: 'Macro AUC',
    color: 'teal',
    icon: AreaChart,
    getValue: (m) => m?.roc_data?.macro_auc,
  },
]

function MetricCards({ metrics }) {
  const { t } = useLanguage()
  
  if (!metrics) return null

  const cardConfigs = getCardConfigs(t)

  return (
    <div className="metric-cards-grid">
      {cardConfigs.map((config, index) => {
        const Icon = config.icon
        const rawValue = config.getValue(metrics)
        const isWmape = config.key === 'wmape'
        const displayValue = rawValue != null
          ? (isWmape ? rawValue * 100 : rawValue * 100)
          : null

        return (
          <motion.div
            key={config.key}
            className={`metric-card ${config.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
          >
            <div className="metric-card-icon">
              <Icon size={20} />
            </div>
            <div className="metric-value">
              {displayValue != null ? (
                <AnimatedNumber value={displayValue} />
              ) : (
                '—'
              )}
            </div>
            <div className="metric-label">{config.label}</div>
            <div className="metric-sublabel">{config.sublabel}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default MetricCards
