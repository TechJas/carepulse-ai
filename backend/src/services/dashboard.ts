import { query } from '../db/pool.js'
import type { DashboardSummary } from '../types/index.js'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const counts = await query(`
    SELECT
      (SELECT COUNT(*) FROM patients WHERE status = 'active')::int AS total_patients,
      (SELECT COUNT(*) FROM alerts a JOIN risk_scores rs ON rs.alert_id = a.id
       WHERE a.status IN ('waiting', 'in_progress') AND rs.priority = 'high')::int AS high_priority,
      (SELECT COUNT(*) FROM alerts a JOIN risk_scores rs ON rs.alert_id = a.id
       WHERE a.status IN ('waiting', 'in_progress') AND rs.priority = 'medium')::int AS medium_priority,
      (SELECT COUNT(*) FROM alerts a JOIN risk_scores rs ON rs.alert_id = a.id
       WHERE a.status IN ('waiting', 'in_progress') AND rs.priority = 'low')::int AS low_priority,
      (SELECT COUNT(*) FROM alerts WHERE status = 'waiting')::int AS unacknowledged,
      (SELECT COUNT(*) FROM alerts WHERE status = 'in_progress')::int AS in_progress
  `)

  return counts.rows[0]
}

export async function getTopCritical(limit = 4) {
  const result = await query(`
    SELECT p.id, p.bed_id, p.name, p.diagnosis, p.age,
           a.id as alert_id, a.type, a.parameter, a.value, a.threshold, a.status as alert_status,
           rs.score, rs.priority, rs.explanation, rs.confidence,
           v.hr, v.spo2, v.systolic_bp, v.diastolic_bp, v.rr, v.temperature,
           n.name as assigned_nurse
    FROM patients p
    JOIN alerts a ON a.patient_id = p.id AND a.status IN ('waiting', 'in_progress')
    JOIN risk_scores rs ON rs.alert_id = a.id
    LEFT JOIN LATERAL (
      SELECT * FROM vital_signs WHERE patient_id = p.id ORDER BY timestamp DESC LIMIT 1
    ) v ON true
    LEFT JOIN assignments ass ON ass.alert_id = a.id AND ass.status = 'active'
    LEFT JOIN nurses n ON n.id = ass.nurse_id
    WHERE p.status = 'active'
    ORDER BY
      CASE rs.priority
        WHEN 'high' THEN 0
        WHEN 'medium' THEN 1
        WHEN 'low' THEN 2
        ELSE 3
      END,
      rs.score DESC NULLS LAST
    LIMIT $1
  `, [limit])

  return result.rows
}

export async function getRecentActivity(limit = 10) {
  const result = await query(`
    SELECT al.action, al.details, al.created_at, n.name as nurse_name
    FROM audit_logs al
    JOIN nurses n ON n.id = al.nurse_id
    ORDER BY al.created_at DESC
    LIMIT $1
  `, [limit])

  return result.rows
}
