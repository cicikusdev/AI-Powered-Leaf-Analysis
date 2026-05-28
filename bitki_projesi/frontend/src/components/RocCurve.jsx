import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useLanguage } from '../context/LanguageContext'

function RocCurve({ rocData }) {
  const { t } = useLanguage()

  const { chartData, selectedClasses } = useMemo(() => {
    if (!rocData || !rocData.per_class) return { chartData: null, selectedClasses: [] }

    const classes = Object.keys(rocData.per_class)
      .sort((a, b) => rocData.per_class[b].auc - rocData.per_class[a].auc)

    const selected = [
      ...classes.slice(0, 3),
      ...classes.slice(-3)
    ].filter((v, i, a) => a.indexOf(v) === i)

    const perClassData = {}
    selected.forEach(clsIdx => {
      const { fpr, tpr } = rocData.per_class[clsIdx]
      perClassData[clsIdx] = fpr.map((f, i) => ({ fpr: f, tpr: tpr[i] }))
    })

    return { chartData: { perClassData }, selectedClasses: selected }
  }, [rocData])

  if (!chartData) {
    return <div className="no-data">{t('no_data')}</div>
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            type="number" 
            dataKey="fpr" 
            domain={[0, 1]} 
            label={{ value: t('chart_roc_fpr'), position: 'bottom', offset: 0 }} 
          />
          <YAxis 
            type="number" 
            domain={[0, 1.05]} 
            label={{ value: t('chart_roc_tpr'), angle: -90, position: 'insideLeft', offset: -10 }} 
          />
          <Tooltip 
            formatter={(value, name) => [`${(value * 100).toFixed(2)}%`, name]}
            labelFormatter={() => 'FPR'}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {selectedClasses.map((clsIdx, i) => (
            <Line 
              key={`roc-${clsIdx}`}
              type="monotone" 
              data={chartData.perClassData[clsIdx]} 
              dataKey="tpr" 
              name={`${t('chart_roc_class')} ${clsIdx} (AUC = ${rocData.per_class[clsIdx]?.auc?.toFixed(2)})`}
              stroke={`hsl(${(i * 137.5) % 360}, 70%, 50%)`}
              strokeWidth={1.5}
              dot={false}
              opacity={0.6}
            />
          ))}
          
          <Line 
            type="linear" 
            data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} 
            dataKey="tpr" 
            stroke="#94a3b8" 
            strokeDasharray="5 5" 
            dot={false}
            name={t('random_classifier')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RocCurve
