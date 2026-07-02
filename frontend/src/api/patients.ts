import { api } from './client'

export interface PatientResponse {
  id: number
  bed_id: string | null
  name: string | null
  age: number | null
  diagnosis: string | null
  admit_date: string | null
  status: string
}

export interface PatientDetailResponse {
  id: number
  bed_id: string | null
  name: string | null
  age: number | null
  diagnosis: string | null
  admit_date: string | null
  status: string
  current_vitals: {
    hr: number | null
    spo2: number | null
    systolic_bp: number | null
    diastolic_bp: number | null
    rr: number | null
    temperature: number | null
  } | null
  vitals_trend: {
    hr: number[]
    spo2: number[]
    systolic_bp: number[]
  } | null
  active_alert: {
    id: number
    risk_score: number | null
    priority: string | null
    explanation: string | null
  } | null
}

export async function getPatients(): Promise<PatientResponse[]> {
  return api<PatientResponse[]>('/api/patients')
}

export async function getPatientDetail(patientId: number): Promise<PatientDetailResponse> {
  return api<PatientDetailResponse>(`/api/patients/${patientId}`)
}

export async function getPatientAlerts(patientId: number): Promise<unknown[]> {
  return api(`/api/patients/${patientId}/alerts`)
}
