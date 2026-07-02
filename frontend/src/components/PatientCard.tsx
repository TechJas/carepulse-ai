import type { PatientAlert } from '../types'
import { Badge } from './Badge'

interface PatientCardProps {
  patient: PatientAlert
  onClick: (patient: PatientAlert) => void
}

const priorityOrder = { high: 0, medium: 1, low: 2, info: 3 }

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const { riskScore, currentVitals, bedId, id, assignedNurse, activeAlert } = patient
  const isHigh = riskScore.priority === 'high'
  const isMedium = riskScore.priority === 'medium'
  const isInfo = riskScore.priority === 'info'

  const borderColor = isInfo
    ? 'border-risk-info dark:border-risk-info-dark'
    : isHigh
    ? 'border-risk-high dark:border-risk-high-dark'
    : isMedium
    ? 'border-risk-medium dark:border-risk-medium-dark'
    : 'border-risk-low dark:border-risk-low-dark'

  const bgColor = activeAlert.status === 'escalated'
    ? 'bg-red-50 dark:bg-red-950/40'
    : activeAlert.status === 'resolved'
    ? 'opacity-60'
    : 'bg-white dark:bg-surface-dark'

  const vitalsText = `${currentVitals.hr} HR · ${currentVitals.spo2}% SpO₂ · ${currentVitals.systolicBp}/${currentVitals.diastolicBp} BP`

  return (
    <button
      onClick={() => onClick(patient)}
      className={`w-full rounded-lg border-2 p-4 text-left transition hover:shadow-md ${borderColor} ${bgColor}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              {id}
            </span>
            <span className="text-sm text-text-secondary dark:text-text-secondary-dark">{bedId}</span>
            <span className="text-xs text-text-secondary dark:text-text-secondary-dark">{patient.diagnosis}</span>
          </div>
          <p className="mt-1 text-xs text-text-secondary dark:text-text-secondary-dark">{vitalsText}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-extrabold ${
            isInfo
              ? 'text-risk-info dark:text-risk-info-dark'
              : isHigh
              ? 'text-risk-high dark:text-risk-high-dark'
              : isMedium
              ? 'text-risk-medium dark:text-risk-medium-dark'
              : 'text-risk-low dark:text-risk-low-dark'
          }`}>
            {riskScore.priority === 'info' ? '--' : `${riskScore.score}%`}
          </p>
          <Badge variant={
            activeAlert.status === 'escalated' ? 'escalated'
            : activeAlert.status === 'in_progress' ? 'in_progress'
            : activeAlert.status === 'resolved' ? 'resolved'
            : riskScore.priority === 'info' ? 'info'
            : riskScore.priority
          }>
            {riskScore.priority === 'info' ? 'Sensor' : riskScore.priority}
          </Badge>
        </div>
      </div>
      <p className="mt-2 text-sm text-text-primary dark:text-text-primary-dark line-clamp-1">
        {riskScore.explanation}
      </p>
      <div className="mt-2 flex items-center justify-between text-xs text-text-secondary dark:text-text-secondary-dark">
        <span>Status: {activeAlert.status.replace('_', ' ')}</span>
        {assignedNurse && <span>Nurse: {assignedNurse}</span>}
      </div>
    </button>
  )
}
