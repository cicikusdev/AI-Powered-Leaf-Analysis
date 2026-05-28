import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useLanguage } from '../context/LanguageContext'

function TrainingChart({ trainingHistory }) {
  const { t } = useLanguage()
  if (!trainingHistory || !trainingHistory.epochs || trainingHistory.epochs.length === 0) {
    return (
      <div className="no-data">
        {t('no_training_data')}
      </div>
    )
  }

  const { epochs, train_acc, val_acc, train_loss, val_loss } = trainingHistory
  
  // Format data for Recharts
  const data = epochs.map((epoch, i) => ({
    epoch,
    train_acc: train_acc ? train_acc[i] : null,
    val_acc: val_acc ? val_acc[i] : null,
    train_loss: train_loss ? train_loss[i] : null,
    val_loss: val_loss ? val_loss[i] : null,
  }))

  return (
    <div className="training-charts-grid">
      {/* Accuracy Chart */}
      <div className="chart-box">
        <h4 className="chart-subtitle">{t('accuracy')}</h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="epoch" label={{ value: t('chart_th_epoch'), position: 'bottom', offset: -5 }} />
              <YAxis domain={['auto', 'auto']} tickFormatter={(v) => v.toFixed(2)} />
              <Tooltip formatter={(value) => Number(value).toFixed(4)} />
              <Legend />
              {train_acc && <Line type="monotone" dataKey="train_acc" name={t('train_lbl')} stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
              {val_acc && <Line type="monotone" dataKey="val_acc" name={t('val_lbl')} stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loss Chart */}
      <div className="chart-box">
        <h4 className="chart-subtitle">{t('loss')}</h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="epoch" label={{ value: t('chart_th_epoch'), position: 'bottom', offset: -5 }} />
              <YAxis domain={['auto', 'auto']} tickFormatter={(v) => v.toFixed(2)} />
              <Tooltip formatter={(value) => Number(value).toFixed(4)} />
              <Legend />
              {train_loss && <Line type="monotone" dataKey="train_loss" name={t('train_lbl')} stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
              {val_loss && <Line type="monotone" dataKey="val_loss" name={t('val_lbl')} stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default TrainingChart
