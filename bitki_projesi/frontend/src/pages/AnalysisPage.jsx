import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ImageUpload from '../components/ImageUpload'
import AnalysisResult from '../components/AnalysisResult'
import { predictImage } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

function AnalysisPage() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageSelect = async (file) => {
    setSelectedImage(file)
    setResult(null)
    setError(null)

    if (!file) return

    setLoading(true)
    try {
      // Default to best_model_v4 for predictions
      const data = await predictImage(file, 'best_model_v4')
      setResult(data)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err.response?.data?.error || 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      className="analysis-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header text-center">
        <h1 className="page-title">
          <span className="gradient-text">{t('page_title_gradient')}</span> {t('page_title_main')}
        </h1>
        <p className="page-subtitle">
          {t('page_subtitle')}
        </p>
      </div>

      <div className="analysis-grid">
        <div className="analysis-column left-column">
          <ImageUpload 
            onImageSelect={handleImageSelect} 
            selectedImage={selectedImage} 
          />
          
          {error && (
            <motion.div 
              className="error-message mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <strong>{t('error_title')}</strong> {error}
            </motion.div>
          )}
        </div>

        <div className="analysis-column right-column">
          <AnalysisResult 
            result={result} 
            loading={loading} 
          />
        </div>
      </div>
    </motion.div>
  )
}

export default AnalysisPage
