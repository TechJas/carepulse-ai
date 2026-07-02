import { query } from '../db/pool.js'
import type { Patient, VitalSign, PatientWithAlert } from '../types/index.js'

export async function getAllPatients(): Promise<Patient[]> {
  const result = await query('SELECT * FROM patients WHERE status = $1 ORDER BY id', ['active'])
  return result.rows
}

export async function getPatientById(id: number): Promise<Patient | null> {
  const result = await query('SELECT * FROM patients WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function getLatestVitals(patientId: number): Promise<VitalSign | null> {
  const result = await query(
    'SELECT * FROM vital_signs WHERE patient_id = $1 ORDER BY timestamp DESC LIMIT 1',
    [patientId]
  )
  return result.rows[0] || null
}

export async function getVitalsTrend(patientId: number, minutes = 60): Promise<VitalSign[]> {
  const result = await query(
    'SELECT * FROM vital_signs WHERE patient_id = $1 AND timestamp > NOW() - ($2 || \' minutes\')::INTERVAL ORDER BY timestamp ASC',
    [patientId, minutes]
  )
  return result.rows
}

export async function getPatientWithAlert(patientId: number): Promise<PatientWithAlert | null> {
  const patient = await getPatientById(patientId)
  if (!patient) return null

  const vitals = await getLatestVitals(patientId)
  const trend = await getVitalsTrend(patientId)

  const alertResult = await query(
    `SELECT * FROM alerts WHERE patient_id = $1 AND status IN ('waiting', 'in_progress') ORDER BY timestamp DESC LIMIT 1`,
    [patientId]
  )
  const activeAlert = alertResult.rows[0] || null

  let riskScore = null
  if (activeAlert) {
    const rs = await query('SELECT * FROM risk_scores WHERE alert_id = $1', [activeAlert.id])
    riskScore = rs.rows[0] || null
  }

  let assignedNurse = null
  if (activeAlert) {
    const as = await query(
      `SELECT n.name FROM assignments a JOIN nurses n ON n.id = a.nurse_id WHERE a.alert_id = $1 AND a.status = 'active'`,
      [activeAlert.id]
    )
    if (as.rows.length > 0) assignedNurse = as.rows[0].name
  }

  const emptyTrend = { hr: [] as number[], spo2: [] as number[], systolic_bp: [] as number[] }
  const vitalsTrend: PatientWithAlert['vitals_trend'] = trend.length > 0
    ? {
        hr: trend.map(v => v.hr),
        spo2: trend.map(v => Number(v.spo2)),
        systolic_bp: trend.map(v => v.systolic_bp),
      }
    : emptyTrend

  return {
    ...patient,
    current_vitals: vitals,
    vitals_trend: vitalsTrend,
    active_alert: activeAlert,
    risk_score: riskScore,
    assigned_nurse: assignedNurse,
  }
}
