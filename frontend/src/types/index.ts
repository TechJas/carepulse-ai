export interface Patient {
  id: number
  bedId: string
  name: string
  age: number
  diagnosis: string
  admitDate: string
  status: 'active' | 'discharged'
}

export interface VitalSigns {
  hr: number
  spo2: number
  systolicBp: number
  diastolicBp: number
  rr: number
  temperature: number
}

export interface VitalsTrend {
  hr: number[]
  spo2: number[]
  systolicBp: number[]
}

export type AlertType = 'physiological' | 'technical' | 'advisory'
export type AlertStatus = 'waiting' | 'in_progress' | 'resolved' | 'escalated'
export type Priority = 'high' | 'medium' | 'low' | 'info'

export interface Alert {
  id: number
  patientId: number
  type: AlertType
  parameter: string
  value: number
  threshold: number
  timestamp: string
  status: AlertStatus
}

export interface RiskScore {
  alertId: number
  score: number
  confidence: number
  priority: Priority
  explanation: string
}

export interface PatientAlert extends Patient {
  currentVitals: VitalSigns
  vitalsTrend: VitalsTrend
  activeAlert: Alert
  riskScore: RiskScore
  assignedNurse?: string
}

export interface Nurse {
  id: number
  name: string
  email: string
  role: 'nurse' | 'charge_nurse'
}

export interface DashboardSummary {
  totalPatients: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  unacknowledged: number
  inProgress: number
}
