export interface Patient {
  id: number
  department_id: number
  bed_id: string
  name: string
  age: number
  diagnosis: string
  admit_date: string
  status: 'active' | 'discharged'
}

export interface VitalSign {
  id: number
  patient_id: number
  timestamp: string
  hr: number
  spo2: number
  systolic_bp: number
  diastolic_bp: number
  rr: number
  temperature: number
}

export interface Alert {
  id: number
  patient_id: number
  type: 'physiological' | 'technical' | 'advisory'
  parameter: string
  value: number
  threshold: number
  timestamp: string
  status: 'waiting' | 'in_progress' | 'resolved' | 'escalated'
}

export interface RiskScore {
  id: number
  alert_id: number
  score: number
  confidence: number
  priority: 'high' | 'medium' | 'low' | 'info'
  explanation: string
  created_at: string
}

export interface Nurse {
  id: number
  name: string
  email: string
  role: 'nurse' | 'charge_nurse'
}

export interface Assignment {
  id: number
  alert_id: number
  nurse_id: number
  accepted_at: string | null
  resolved_at: string | null
  status: 'active' | 'resolved'
}

export interface DashboardSummary {
  total_patients: number
  high_priority: number
  medium_priority: number
  low_priority: number
  unacknowledged: number
  in_progress: number
}

export interface PatientWithAlert extends Patient {
  current_vitals: VitalSign | null
  vitals_trend: { hr: number[]; spo2: number[]; systolic_bp: number[] }
  active_alert: Alert | null
  risk_score: RiskScore | null
  assigned_nurse: string | null
}

export interface AuthPayload {
  userId: number
  role: 'nurse' | 'charge_nurse'
}
