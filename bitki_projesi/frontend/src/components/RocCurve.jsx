import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="fpr"
              domain={[0, 1]}
              tickCount={6}
              label={{ value: t('chart_roc_fpr'), position: 'bottom', offset: 10, fontSize: 11, fill: '#94a3b8' }}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis
              type="number"
              domain={[0, 1.05]}
              tickCount={6}
              label={{ value: t('chart_roc_tpr'), angle: -90, position: 'insideLeft', offset: -5, fontSize: 11, fill: '#94a3b8' }}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <Tooltip
              formatter={(value, name) => [`${(value * 100).toFixed(1)}%`, name]}
              labelFormatter={() => 'FPR'}
              contentStyle={{ fontSize: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />

            {selectedClasses.map((clsIdx, i) => (
              <Line
                key={`roc-${clsIdx}`}
                type="monotone"
                data={chartData.perClassData[clsIdx]}
                dataKey="tpr"
                name={`Sınıf ${clsIdx}`}
                stroke={`hsl(${(i * 137.5) % 360}, 65%, 50%)`}
                strokeWidth={2}
                dot={false}
                opacity={0.85}
              />
            ))}

            <Line
              type="linear"
              data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]}
              dataKey="tpr"
              stroke="#cbd5e1"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={false}
              name={t('random_classifier')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '16px',
        justifyContent: 'center',
        padding: '0 8px'
      }}>
        {selectedClasses.map((clsIdx, i) => (
          <div key={clsIdx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            color: '#475569'
          }}>
            <div style={{
              width: '18px',
              height: '3px',
              background: `hsl(${(i * 137.5) % 360}, 65%, 50%)`,
              borderRadius: '2px',
              flexShrink: 0
            }} />
            <span>Sınıf {clsIdx} (AUC={rocData.per_class[clsIdx]?.auc?.toFixed(2)})</span>
          </div>
        ))}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.72rem',
          color: '#94a3b8'
        }}>
          <div style={{
            width: '18px',
            height: '2px',
            background: 'repeating-linear-gradient(90deg, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)',
            flexShrink: 0
          }} />
          <span>{t('random_classifier')}</span>
        </div>
      </div>
    </div>
  )
}

export default RocCurve
