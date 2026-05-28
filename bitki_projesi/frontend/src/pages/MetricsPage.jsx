import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMetrics } from '../services/api'
import MetricCards from '../components/MetricCards'
import ModelComparison from '../components/ModelComparison'
import TrainingChart from '../components/TrainingChart'
import ConfusionMatrix from '../components/ConfusionMatrix'
import RocCurve from '../components/RocCurve'
import ClassMetricsTable from '../components/ClassMetricsTable'
import WmapeChart from '../components/WmapeChart'
import { useLanguage } from '../context/LanguageContext'

function MetricsPage() {
  const { t, language } = useLanguage()
  const [metricsData, setMetricsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedModel, setSelectedModel] = useState('best_model_v6')

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics()
        if (data.status === 'not_ready') {
          setError(data.message)
        } else {
          setMetricsData(data)
          // Mevcut modeli otomatik seç
          if (data.models) {
            const models = Object.keys(data.models)
            if (models.length > 0 && !models.includes('best_model_v6')) {
              setSelectedModel(models[models.length - 1])
            }
          }
        }
      } catch (err) {
        console.error('Error fetching metrics:', err)
        setError('Metrik verileri alınamadı. Backend bağlantısını kontrol edin.')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="metrics-page flex-center min-h-screen">
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text mt-4">{t('loading_metrics')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="metrics-page flex-center min-h-screen">
        <div className="error-card glass-panel">
          <h3>{t('data_not_ready')}</h3>
          <p>{error === 'Metrikler henüz hesaplanmadı. evaluate_models.py scriptini çalıştırın.' ? t('no_metrics_message') : error}</p>
          <p className="mt-4 text-sm text-gray-500">
            {t('data_not_ready_desc')}
          </p>
        </div>
      </div>
    )
  }

  if (!metricsData || !metricsData.models) return null

  const availableModels = Object.keys(metricsData.models)
  const currentMetrics = metricsData.models[selectedModel] || metricsData.models[availableModels[0]]

  if (!currentMetrics) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      className="metrics-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="metrics-header flex justify-between items-end mb-8">
        <div>
          <h1 className="page-title mb-2">{t('metrics_page_title')}</h1>
          <p className="page-subtitle mb-0">
            {t('metrics_dataset')} ({metricsData.num_classes} {t('metrics_classes')}) • {t('metrics_eval')}: {metricsData.evaluation_date}
          </p>
        </div>
        
        <div className="model-selector-container">
          <label className="text-sm font-medium text-gray-600 mr-3">{t('model_select_label')}</label>
          <div className="custom-select-wrapper">
            <select 
              className="model-selector"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {availableModels.map(model => (
                <option key={model} value={model}>
                  {model.replace('best_model', 'Model').replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="mb-8">
        <MetricCards metrics={currentMetrics} />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <ModelComparison allModels={metricsData.models} />
      </motion.div>

      {currentMetrics.training_history && (
        <motion.div variants={itemVariants} className="mb-8 chart-container glass-panel">
          <div className="chart-header">
            <h3 className="chart-title">{t('chart_training_history')}</h3>
            <p className="chart-desc">{t('chart_th_desc')}</p>
          </div>
          <TrainingChart trainingHistory={currentMetrics.training_history} />
        </motion.div>
      )}

      <div className="mb-8" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
        <motion.div variants={itemVariants} className="chart-container glass-panel">
          <div className="chart-header">
            <h3 className="chart-title">{t('chart_confusion_matrix')}</h3>
            <p className="chart-desc">{t('chart_cm_desc')}</p>
          </div>
          <ConfusionMatrix 
            matrix={currentMetrics.confusion_matrix} 
            classNames={language === 'en' && metricsData.class_names ? metricsData.class_names : metricsData.class_names_tr} 
          />
        </motion.div>

        <motion.div variants={itemVariants} className="chart-container glass-panel">
          <div className="chart-header">
            <h3 className="chart-title">{t('chart_roc_curve')}</h3>
            <p className="chart-desc">{t('chart_roc_desc')} (AUC: {currentMetrics.roc_data?.macro_auc})</p>
          </div>
          <RocCurve rocData={currentMetrics.roc_data} />
        </motion.div>
      </div>

      <div className="metrics-grid-2col mb-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <motion.div variants={itemVariants} className="chart-container glass-panel">
          <div className="chart-header">
            <h3 className="chart-title">{t('chart_wmape_title')}</h3>
            <p className="chart-desc">{t('chart_wmape_desc')}</p>
          </div>
          <WmapeChart perClass={currentMetrics.per_class} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="chart-container glass-panel" style={{ overflow: 'hidden' }}>
          <div className="chart-header">
            <h3 className="chart-title">{t('chart_tbl_title')}</h3>
            <p className="chart-desc">{t('chart_tbl_desc')}</p>
          </div>
          <ClassMetricsTable perClass={currentMetrics.per_class} />
        </motion.div>
      </div>

    </motion.div>
  )
}

export default MetricsPage
