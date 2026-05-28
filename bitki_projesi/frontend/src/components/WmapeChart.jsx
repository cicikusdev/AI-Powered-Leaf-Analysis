import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useLanguage } from '../context/LanguageContext'

function WmapeChart({ perClass }) {
  const { t, language } = useLanguage()
  const chartData = useMemo(() => {
    if (!perClass || perClass.length === 0) return []
    
    // Calculate error rate (1 - F1 score) for each class
    const data = perClass.map(cls => ({
      name: language === 'en' ? cls.class_name : cls.class_name_tr,
      fullName: cls.class_name,
      errorRate: (1 - cls.f1_score) * 100, // as percentage
      f1: cls.f1_score * 100
    }))
    
    // Sort by error rate descending and take top 15
    return data.sort((a, b) => b.errorRate - a.errorRate).slice(0, 15)
  }, [perClass, language])

  if (!chartData || chartData.length === 0) return null

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{data.name}</p>
          <p style={{ margin: 0, color: '#ef4444' }}>{t('error_rate')}: {data.errorRate.toFixed(2)}%</p>
          <p style={{ margin: 0, color: '#10b981' }}>{t('f1_label')}: {data.f1.toFixed(2)}%</p>
        </div>
      )
    }
    return null
  }

  // Get color based on error rate (higher error = redder)
  const getColor = (errorRate) => {
    if (errorRate > 20) return '#ef4444' // red-500
    if (errorRate > 10) return '#f97316' // orange-500
    if (errorRate > 5) return '#f59e0b'  // amber-500
    return '#10b981'                     // emerald-500
  }

  return (
    <div className="wmape-chart-container">
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150} 
              tick={{ fontSize: 11 }} 
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="errorRate" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.errorRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-footer">
        <p className="text-sm text-gray-500 mt-2">
          {t('chart_wmape_footer')}
        </p>
      </div>
    </div>
  )
}

export default WmapeChart
