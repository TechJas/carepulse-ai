import { api } from './client'

export interface DashboardSummary {
  total_patients: number
  high_priority: number
  medium_priority: number
  low_priority: number
  unacknowledged: number
  in_progress: number
}

export interface TopCriticalPatient {
  id: number
  bed_id: string | null
  name: string | null
  diagnosis: string | null
  risk_score: number | null
  priority: string | null
  explanation: string | null
  status: string
  assigned_nurse: string | null
}

export async function getSummary(): Promise<DashboardSummary> {
  return api<DashboardSummary>('/api/dashboard/summary')
}

export async function getTopCritical(): Promise<{ patients: TopCriticalPatient[] }> {
  return api<{ patients: TopCriticalPatient[] }>('/api/dashboard/top-critical')
}
