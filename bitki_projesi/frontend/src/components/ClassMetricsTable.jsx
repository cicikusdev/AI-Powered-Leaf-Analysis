import React, { useState, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'

function ClassMetricsTable({ perClass }) {
  const { t, language } = useLanguage()
  const [sortConfig, setSortConfig] = useState({ key: 'f1_score', direction: 'descending' })
  const [searchTerm, setSearchTerm] = useState('')

  if (!perClass || perClass.length === 0) return null

  // Sort and filter data
  const sortedData = useMemo(() => {
    let sortableItems = [...perClass]
    
    // Filter
    if (searchTerm) {
      sortableItems = sortableItems.filter(
        item => 
          item.class_name_tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.class_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [perClass, sortConfig, searchTerm])

  const requestSort = (key) => {
    let direction = 'descending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending'
    }
    setSortConfig({ key, direction })
  }

  // Get color class based on score
  const getScoreColor = (score) => {
    if (score >= 0.90) return 'score-good'
    if (score >= 0.70) return 'score-warning'
    return 'score-poor'
  }

  return (
    <div className="class-metrics-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder={t('search_placeholder')}
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="result-count">{sortedData.length} {t('showing_results')}</span>
      </div>

      <div className="table-responsive">
        <table className="metrics-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('class_name_tr')} className={sortConfig?.key === 'class_name_tr' ? 'active-sort' : ''}>
                {t('tbl_class')} {sortConfig?.key === 'class_name_tr' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('precision')} className={sortConfig?.key === 'precision' ? 'active-sort' : ''}>
                {t('tbl_precision')} {sortConfig?.key === 'precision' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('recall')} className={sortConfig?.key === 'recall' ? 'active-sort' : ''}>
                {t('tbl_recall')} {sortConfig?.key === 'recall' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('f1_score')} className={sortConfig?.key === 'f1_score' ? 'active-sort' : ''}>
                {t('tbl_f1')} {sortConfig?.key === 'f1_score' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('support')} className={sortConfig?.key === 'support' ? 'active-sort' : ''}>
                {t('tbl_support')} {sortConfig?.key === 'support' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((cls, idx) => (
              <tr key={idx}>
                <td title={cls.class_name} className="class-name-cell">
                  {language === 'en' ? cls.class_name : cls.class_name_tr}
                </td>
                <td className={getScoreColor(cls.precision)}>{cls.precision.toFixed(4)}</td>
                <td className={getScoreColor(cls.recall)}>{cls.recall.toFixed(4)}</td>
                <td className={getScoreColor(cls.f1_score)}><strong>{cls.f1_score.toFixed(4)}</strong></td>
                <td>{cls.support}</td>
              </tr>
            ))}
            {sortedData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">{t('no_search_result')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassMetricsTable
