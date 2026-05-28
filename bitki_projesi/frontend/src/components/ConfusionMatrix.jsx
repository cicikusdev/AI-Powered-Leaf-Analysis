import React, { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

function ConfusionMatrix({ matrix, classNames }) {
  const { t } = useLanguage()
  const [hoveredCell, setHoveredCell] = useState(null)

  // Calculate max value for color scaling
  const maxVal = useMemo(() => {
    if (!matrix || matrix.length === 0) return 1
    return Math.max(...matrix.map(row => Math.max(...row)))
  }, [matrix])

  if (!matrix || matrix.length === 0 || !classNames) {
    return <div className="no-data">{t('no_data')}</div>
  }

  // Get color based on value (white to dark green)
  const getCellColor = (value) => {
    if (value === 0) return '#ffffff'
    // Scale opacity from 0.1 to 1 based on value
    const intensity = Math.max(0.1, value / maxVal)
    return `rgba(22, 163, 74, ${intensity})` // --green-600 with opacity
  }

  const getTextColor = (value) => {
    // Dark text for light background, white text for dark background
    return (value / maxVal > 0.5) ? '#ffffff' : '#1e293b'
  }

  // Truncate long class names for labels
  const truncate = (str, len = 15) => {
    if (str.length <= len) return str
    return str.substring(0, len) + '...'
  }

  return (
    <div className="confusion-matrix-wrapper">
      <div className="cm-axis-label y-axis-label">{t('chart_cm_true')}</div>
      <div className="confusion-matrix-container">
        <div className="cm-axis-label x-axis-label">{t('chart_cm_pred')}</div>
        <table className="cm-table">
          <thead>
            <tr>
              <th className="cm-corner">{t('chart_cm_true_pred_header')}</th>
              {classNames.map((name, i) => (
                <th key={`th-${i}`} title={name} className="cm-label-x">
                  <div className="vertical-text">{truncate(name, 12)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={`tr-${i}`}>
                <th title={classNames[i]} className="cm-label-y">
                  {truncate(classNames[i], 20)}
                </th>
                {row.map((val, j) => (
                  <td 
                    key={`td-${i}-${j}`} 
                    className="cm-cell"
                    style={{ 
                      backgroundColor: getCellColor(val),
                      color: getTextColor(val)
                    }}
                    onMouseEnter={() => setHoveredCell({ actual: classNames[i], predicted: classNames[j], count: val })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Tooltip */}
      <div className="cm-tooltip" style={{ opacity: hoveredCell ? 1 : 0 }}>
        {hoveredCell ? (
          <>
            <div><strong>Gerçek:</strong> {hoveredCell.actual}</div>
            <div><strong>Tahmin:</strong> {hoveredCell.predicted}</div>
            <div className="cm-tooltip-count"><strong>Sayı:</strong> {hoveredCell.count}</div>
          </>
        ) : (
          <div>Detay görmek için hücrelerin üzerine gelin</div>
        )}
      </div>
    </div>
  )
}

export default ConfusionMatrix
