import { api } from './client'

export interface AlertItem {
  id: number
  patient_id: number
  patient_name: string | null
  bed_id: string | null
  type: string
  parameter: string
  value: number | null
  threshold: number | null
  timestamp: string
  status: string
  risk_score: number | null
  priority: string | null
  explanation: string | null
  assigned_to: { id: number; name: string } | null
}

export interface AlertListResponse {
  alerts: AlertItem[]
  total: number
  high: number
  medium: number
  low: number
}

export interface AlertActionResponse {
  id: number
  status: string
  message?: string
  assigned_to?: { id: number; name: string }
  acknowledged_at?: string
}

export async function getAlerts(params?: {
  status?: string
  priority?: string
  limit?: number
}): Promise<AlertListResponse> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.priority) qs.set('priority', params.priority)
  if (params?.limit) qs.set('limit', String(params.limit))
  const query = qs.toString()
  return api<AlertListResponse>(`/api/alerts${query ? `?${query}` : ''}`)
}

export async function acknowledgeAlert(alertId: number): Promise<AlertActionResponse> {
  return api<AlertActionResponse>(`/api/alerts/${alertId}/acknowledge`, { method: 'POST' })
}

export async function resolveAlert(alertId: number): Promise<AlertActionResponse> {
  return api<AlertActionResponse>(`/api/alerts/${alertId}/resolve`, { method: 'POST' })
}

export async function escalateAlert(alertId: number): Promise<AlertActionResponse> {
  return api<AlertActionResponse>(`/api/alerts/${alertId}/escalate`, { method: 'POST' })
}
