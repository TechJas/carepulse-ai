import { Router } from 'express'
import { authRequired, type AuthRequest } from '../middleware/auth.js'
import { getDashboardSummary, getTopCritical, getRecentActivity } from '../services/dashboard.js'

const router = Router()

router.get('/summary', authRequired, async (_req: AuthRequest, res) => {
  try {
    const summary = await getDashboardSummary()
    res.json(summary)
  } catch (err) {
    console.error('[DASHBOARD] Summary error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/top-critical', authRequired, async (req: AuthRequest, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4
    const patients = await getTopCritical(limit)
    res.json({ patients })
  } catch (err) {
    console.error('[DASHBOARD] Top critical error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/activity', authRequired, async (req: AuthRequest, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
    const activity = await getRecentActivity(limit)
    res.json({ activity })
  } catch (err) {
    console.error('[DASHBOARD] Activity error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
