import { type PatientAlert } from '../types'
import { Badge } from './Badge'

interface PatientDetailProps {
  patient: PatientAlert
  loading?: boolean
  onClose: () => void
  onAccept: (id: number) => void
  onResolve: (id: number) => void
  onEscalate: (id: number) => void
  patientVitals: Record<string, any> | null
  patientTrend: Record<string, any> | null
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return <span className="text-xs text-text-secondary">No data</span>
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 80
  const h = 24
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 2) - 1
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-6">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  )
}

export function PatientDetail({ patient, loading, onClose, onAccept, onResolve, onEscalate, patientVitals, patientTrend }: PatientDetailProps) {
  const { riskScore, activeAlert, assignedNurse } = patient
  const isHigh = riskScore.priority === 'high'
  const vitals = patientVitals ?? patient.currentVitals
  const trend = patientTrend ?? patient.vitalsTrend

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark shadow-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Loading patient data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border dark:border-border-dark px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">Patient {patient.id}</h2>
              <Badge variant={riskScore.priority}>{riskScore.priority === 'info' ? 'Sensor' : riskScore.priority}</Badge>
            </div>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{patient.bedId}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-2">Current Vitals</h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'HR', value: vitals?.hr, unit: 'bpm', dir: (vitals?.hr ?? 0) > 100 ? '▲' : '▼' },
                { label: 'SpO₂', value: vitals?.spo2, unit: '%', dir: (vitals?.spo2 ?? 100) < 90 ? '▼' : '▲' },
                { label: 'BP', value: vitals ? `${vitals.systolic_bp ?? '--'}/${vitals.diastolic_bp ?? '--'}` : '--', unit: 'mmHg', dir: (vitals?.systolic_bp ?? 0) < 90 ? '▼' : '▲' },
                { label: 'RR', value: vitals?.rr, unit: '/min', dir: (vitals?.rr ?? 0) > 20 ? '▲' : '▼' },
                { label: 'Temp', value: vitals?.temperature, unit: '°C', dir: (vitals?.temperature ?? 0) > 38 ? '▲' : '▼' },
              ].map(v => (
                <div key={v.label} className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2 text-center">
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">{v.label}</p>
                  <p className={`text-sm font-bold ${v.dir === '▲' ? 'text-risk-high dark:text-risk-high-dark' : 'text-risk-low dark:text-risk-low-dark'}`}>
                    {v.value ?? '--'} <span className="text-xs font-normal">{v.dir}</span>
                  </p>
                  <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark">{v.unit}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-2">Trends (60 min)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">HR</p>
                <Sparkline data={trend?.hr} color={isHigh ? '#ef4444' : '#3b82f6'} />
              </div>
              <div>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">SpO₂</p>
                <Sparkline data={trend?.spo2} color={isHigh ? '#ef4444' : '#22c55e'} />
              </div>
              <div>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">Systolic BP</p>
                <Sparkline data={trend?.systolic_bp} color={isHigh ? '#ef4444' : '#f59e0b'} />
              </div>
            </div>
          </section>

          <section className={`rounded-lg border-2 p-4 ${
            riskScore.priority === 'info'
              ? 'border-risk-info dark:border-risk-info-dark bg-gray-50 dark:bg-gray-900/30'
              : isHigh
              ? 'border-risk-high dark:border-risk-high-dark bg-red-50 dark:bg-red-950/20'
              : 'border-accent dark:border-accent-dark bg-blue-50 dark:bg-blue-950/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">AI Assessment</h3>
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Confidence: {riskScore.confidence}%</span>
            </div>
            <p className={`text-3xl font-extrabold ${
              riskScore.priority === 'info'
                ? 'text-risk-info dark:text-risk-info-dark'
                : isHigh
                ? 'text-risk-high dark:text-risk-high-dark'
                : 'text-accent dark:text-accent-dark'
            }`}>
              {riskScore.priority === 'info' ? 'Sensor Issue' : `${riskScore.score}% Risk`}
            </p>
            <p className="mt-2 text-sm text-text-primary dark:text-text-primary-dark">
              {riskScore.explanation}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-2">Actions</h3>
            <div className="flex gap-2">
              {activeAlert.status === 'waiting' && (
                <button onClick={() => onAccept(activeAlert.id)} className="flex-1 rounded-lg bg-accent dark:bg-accent-dark text-white px-4 py-2 text-sm font-medium hover:brightness-110 transition">
                  Accept
                </button>
              )}
              {activeAlert.status === 'in_progress' && (
                <button onClick={() => onResolve(activeAlert.id)} className="flex-1 rounded-lg bg-risk-low dark:bg-risk-low-dark text-white px-4 py-2 text-sm font-medium hover:brightness-110 transition">
                  Resolve
                </button>
              )}
              <button onClick={() => onEscalate(activeAlert.id)} className="rounded-lg border border-risk-high dark:border-risk-high-dark text-risk-high dark:text-risk-high-dark px-4 py-2 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition">
                Escalate
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-2">Alert Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Type</span><span className="text-text-primary dark:text-text-primary-dark capitalize">{activeAlert.type}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Parameter</span><span className="text-text-primary dark:text-text-primary-dark">{activeAlert.parameter}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Value</span><span className="text-text-primary dark:text-text-primary-dark">{activeAlert.value} (threshold: {activeAlert.threshold})</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Status</span><Badge variant={activeAlert.status as any}>{activeAlert.status.replace('_', ' ')}</Badge></div>
              {assignedNurse && <div className="flex justify-between"><span className="text-text-secondary">Assigned to</span><span className="text-text-primary dark:text-text-primary-dark">{assignedNurse}</span></div>}
              <div className="flex justify-between"><span className="text-text-secondary">Time</span><span className="text-text-primary dark:text-text-primary-dark">{new Date(activeAlert.timestamp).toLocaleTimeString()}</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
