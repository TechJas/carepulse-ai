import type { PatientAlert } from '../types'
import { Badge } from './Badge'

interface PatientTableProps {
  patients: PatientAlert[]
  onSelect: (patient: PatientAlert) => void
}

const priorityColors: Record<string, string> = {
  high: 'text-risk-high dark:text-risk-high-dark',
  medium: 'text-risk-medium dark:text-risk-medium-dark',
  low: 'text-risk-low dark:text-risk-low-dark',
  info: 'text-risk-info dark:text-risk-info-dark',
}

export function PatientTable({ patients, onSelect }: PatientTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border dark:border-border-dark text-left text-xs uppercase text-text-secondary dark:text-text-secondary-dark">
            <th className="pb-2 pr-4">ID</th>
            <th className="pb-2 pr-4">Bed</th>
            <th className="pb-2 pr-4">Risk</th>
            <th className="pb-2 pr-4">Reason</th>
            <th className="pb-2 pr-4">Status</th>
            <th className="pb-2 pr-4">Nurse</th>
            <th className="pb-2 pr-4">Vitals (HR/SpO₂/BP)</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr
              key={p.id}
              onClick={() => onSelect(p)}
              className="border-b border-border dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition"
            >
              <td className="py-3 pr-4 font-medium text-text-primary dark:text-text-primary-dark">{p.id}</td>
              <td className="py-3 pr-4 text-text-secondary dark:text-text-secondary-dark">{p.bedId}</td>
              <td className={`py-3 pr-4 font-bold ${priorityColors[p.riskScore.priority]}`}>
                {p.riskScore.priority === 'info' ? '--' : `${p.riskScore.score}%`}
              </td>
              <td className="py-3 pr-4 text-text-primary dark:text-text-primary-dark max-w-xs truncate">
                {p.riskScore.explanation}
              </td>
              <td className="py-3 pr-4">
                <Badge variant={
                  p.activeAlert.status === 'escalated' ? 'escalated'
                  : p.activeAlert.status === 'in_progress' ? 'in_progress'
                  : p.activeAlert.status === 'resolved' ? 'resolved'
                  : p.riskScore.priority === 'info' ? 'info'
                  : p.riskScore.priority
                }>
                  {p.riskScore.priority === 'info' ? 'Sensor' : p.activeAlert.status.replace('_', ' ')}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-text-secondary dark:text-text-secondary-dark">
                {p.assignedNurse || '--'}
              </td>
              <td className="py-3 pr-4 text-xs text-text-secondary dark:text-text-secondary-dark">
                {p.currentVitals.hr} / {p.currentVitals.spo2}% / {p.currentVitals.systolicBp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
