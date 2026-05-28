import React, { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts'
import { useLanguage } from '../context/LanguageContext'

function ModelComparison({ allModels }) {
  const { t } = useLanguage()
  const comparisonData = useMemo(() => {
    if (!allModels) return { barData: [], radarData: [] }
    
    const barData = []
    
    // Define metrics for radar
    const metricsForRadar = [
      { name: t('accuracy_label'), key: 'overall_accuracy' },
      { name: t('precision_label'), key: 'macro_precision' },
      { name: t('recall_label'), key: 'macro_recall' },
      { name: t('f1_label'), key: 'macro_f1' },
      { name: 'AUC', key: (m) => m.roc_data?.macro_auc || 0 }
    ]
    
    // Initialize radar data with metric names
    const radarData = metricsForRadar.map(m => ({ metric: m.name }))
    
    // Process each model
    Object.entries(allModels).forEach(([modelName, metrics]) => {
      // Bar data
      barData.push({
        name: modelName.replace('best_model', 'Model').replace('_', ' '),
        [t('accuracy_label')]: metrics.overall_accuracy * 100,
        [t('precision_label')]: metrics.macro_precision * 100,
        [t('recall_label')]: metrics.macro_recall * 100,
        [t('f1_label')]: metrics.macro_f1 * 100,
        'WMAPE': metrics.wmape * 100
      })
      
      // Radar data
      metricsForRadar.forEach((m, idx) => {
        const val = typeof m.key === 'function' ? m.key(metrics) : metrics[m.key]
        radarData[idx][modelName] = val * 100
      })
    })
    
    return { barData, radarData }
  }, [allModels, t])

  if (!allModels || Object.keys(allModels).length === 0) return null

  // Format tooltip values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p className="label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: 0 }}>
              {`${entry.name}: ${entry.value.toFixed(2)}%`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Model colors
  const colors = {
    'best_model': '#94a3b8',
    'best_model_v2': '#3b82f6',
    'best_model_v3': '#8b5cf6',
    'best_model_v4': '#16a34a'
  }

  const modelKeys = Object.keys(allModels)

  return (
    <div className="model-comparison-container">
      <div className="comparison-charts-grid">
        {/* Bar Chart */}
        <div className="chart-box">
          <h4 className="chart-subtitle">{t('chart_bar_title')}</h4>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={comparisonData.barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey={t('accuracy_label')} fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey={t('f1_label')} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="WMAPE" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="chart-box">
          <h4 className="chart-subtitle">{t('chart_radar_title')}</h4>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={comparisonData.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {modelKeys.map(key => (
                  <Radar
                    key={key}
                    name={key.replace('best_model', 'Model').replace('_', ' ')}
                    dataKey={key}
                    stroke={colors[key] || '#8884d8'}
                    fill={colors[key] || '#8884d8'}
                    fillOpacity={0.3}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelComparison
