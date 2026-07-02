import { Router } from 'express'
import { authRequired, type AuthRequest } from '../middleware/auth.js'
import {
  getAlerts,
  getAlertById,
  acknowledgeAlert,
  resolveAlert,
  escalateAlert,
} from '../services/alert.js'

const router = Router()

router.get('/', authRequired, async (req: AuthRequest, res) => {
  try {
    const { status, priority, limit } = req.query
    const alerts = await getAlerts({
      status: status as string | undefined,
      priority: priority as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    })
    const high = alerts.filter(a => a.risk_priority === 'high').length
    const medium = alerts.filter(a => a.risk_priority === 'medium').length
    const low = alerts.filter(a => a.risk_priority === 'low').length
    res.json({ alerts, total: alerts.length, high, medium, low })
  } catch (err) {
    console.error('[ALERTS] List error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', authRequired, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid alert ID' })
      return
    }
    const alert = await getAlertById(id)
    if (!alert) {
      res.status(404).json({ error: 'Alert not found' })
      return
    }
    res.json(alert)
  } catch (err) {
    console.error('[ALERTS] Detail error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/:id/acknowledge', authRequired, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid alert ID' })
      return
    }
    const assignment = await acknowledgeAlert(id, req.user!.userId)
    res.json({
      id,
      status: 'in_progress',
      assigned_to: { id: req.user!.userId },
      acknowledged_at: assignment.accepted_at,
    })
  } catch (err: any) {
    if (err.message === 'Alert already acknowledged by another nurse') {
      res.status(409).json({ error: err.message })
      return
    }
    console.error('[ALERTS] Acknowledge error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/:id/resolve', authRequired, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid alert ID' })
      return
    }
    await resolveAlert(id, req.user!.userId)
    res.json({ id, status: 'resolved' })
  } catch (err) {
    console.error('[ALERTS] Resolve error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/:id/escalate', authRequired, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid alert ID' })
      return
    }
    await escalateAlert(id, req.user!.userId)
    res.json({ id, status: 'escalated' })
  } catch (err) {
    console.error('[ALERTS] Escalate error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
