import { getTimedOutAlerts } from './alert.js'
import { query } from '../db/pool.js'

const CHECK_INTERVAL_MS = 60_000
let timer: ReturnType<typeof setInterval> | null = null

export function startEscalationService() {
  const timeoutMinutes = Number(process.env.ESCALATION_TIMEOUT_MINUTES) || 5
  console.log(`[ESCALATION] Monitoring every ${CHECK_INTERVAL_MS / 1000}s (timeout: ${timeoutMinutes}min)`)

  timer = setInterval(async () => {
    try {
      const timedOut = await getTimedOutAlerts(timeoutMinutes)
      for (const alert of timedOut) {
        await query("UPDATE alerts SET status = 'escalated' WHERE id = $1 AND status = 'waiting'", [alert.id])
        console.log(`[ESCALATION] Alert ${alert.id} escalated (patient ${alert.patient_id})`)

        const chargeNurses = await query("SELECT id FROM nurses WHERE role = 'charge_nurse'")
        for (const cn of chargeNurses.rows) {
          await query(
            "INSERT INTO audit_logs (nurse_id, action, details) VALUES ($1, 'escalation_auto', $2)",
            [cn.id, JSON.stringify({ alert_id: alert.id, reason: 'timeout', patient_id: alert.patient_id })]
          )
        }
      }
    } catch (err) {
      console.error('[ESCALATION] Error during check:', err)
    }
  }, CHECK_INTERVAL_MS)
}

export function stopEscalationService() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
