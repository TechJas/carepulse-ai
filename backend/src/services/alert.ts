import { query } from '../db/pool.js'
import type { Alert, RiskScore } from '../types/index.js'

export async function getAlerts(filters?: {
  status?: string
  priority?: string
  limit?: number
}) {
  let sql = `
    SELECT a.*, rs.score as risk_score, rs.priority as risk_priority,
           rs.explanation, rs.confidence, p.bed_id, p.name as patient_name
    FROM alerts a
    LEFT JOIN risk_scores rs ON rs.alert_id = a.id
    JOIN patients p ON p.id = a.patient_id
    WHERE 1=1
  `
  const params: unknown[] = []
  let idx = 1

  if (filters?.status) {
    sql += ` AND a.status = $${idx++}`
    params.push(filters.status)
  }
  if (filters?.priority) {
    sql += ` AND rs.priority = $${idx++}`
    params.push(filters.priority)
  }

  sql += ' ORDER BY rs.score DESC NULLS LAST, a.timestamp DESC'

  if (filters?.limit) {
    sql += ` LIMIT $${idx++}`
    params.push(filters.limit)
  }

  const result = await query(sql, params)
  return result.rows
}

export async function getAlertById(id: number): Promise<Alert | null> {
  const result = await query('SELECT * FROM alerts WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function acknowledgeAlert(alertId: number, nurseId: number) {
  const existing = await query(
    'SELECT id FROM assignments WHERE alert_id = $1 AND status = $2',
    [alertId, 'active']
  )
  if (existing.rows.length > 0) {
    throw new Error('Alert already acknowledged by another nurse')
  }

  await query('UPDATE alerts SET status = $1 WHERE id = $2', ['in_progress', alertId])

  const result = await query(
    `INSERT INTO assignments (alert_id, nurse_id, accepted_at, status)
     VALUES ($1, $2, NOW(), 'active')
     RETURNING *`,
    [alertId, nurseId]
  )

  await logAudit(nurseId, 'alert_acknowledged', { alert_id: alertId })
  return result.rows[0]
}

export async function resolveAlert(alertId: number, nurseId: number) {
  await query('UPDATE alerts SET status = $1 WHERE id = $2', ['resolved', alertId])
  await query(
    `UPDATE assignments SET status = 'resolved', resolved_at = NOW()
     WHERE alert_id = $1 AND status = 'active'`,
    [alertId]
  )
  await logAudit(nurseId, 'alert_resolved', { alert_id: alertId })
}

export async function escalateAlert(alertId: number, nurseId: number) {
  await query('UPDATE alerts SET status = $1 WHERE id = $2', ['escalated', alertId])
  await logAudit(nurseId, 'alert_escalated', { alert_id: alertId })
}

export async function getAlertsForPatient(patientId: number) {
  const result = await query(
    `SELECT a.*, rs.score as risk_score, rs.priority as risk_priority,
            rs.explanation, a2.name as assigned_nurse
     FROM alerts a
     LEFT JOIN risk_scores rs ON rs.alert_id = a.id
     LEFT JOIN assignments ass ON ass.alert_id = a.id AND ass.status = 'active'
     LEFT JOIN nurses a2 ON a2.id = ass.nurse_id
     WHERE a.patient_id = $1
     ORDER BY a.timestamp DESC
     LIMIT 50`,
    [patientId]
  )
  return result.rows
}

export async function getTimedOutAlerts(minutes: number) {
  const result = await query(
    `SELECT a.*, rs.priority as risk_priority
     FROM alerts a
     JOIN risk_scores rs ON rs.alert_id = a.id
     WHERE a.status = 'waiting'
       AND rs.priority IN ('high', 'medium')
       AND a.timestamp < NOW() - ($1 || ' minutes')::INTERVAL
     ORDER BY a.timestamp ASC`,
    [minutes]
  )
  return result.rows
}

async function logAudit(nurseId: number, action: string, details: Record<string, unknown>) {
  await query(
    'INSERT INTO audit_logs (nurse_id, action, details) VALUES ($1, $2, $3)',
    [nurseId, action, JSON.stringify(details)]
  )
}
