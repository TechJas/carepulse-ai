import { Router } from 'express'
import { authRequired, type AuthRequest } from '../middleware/auth.js'
import { getAllPatients, getPatientWithAlert, getLatestVitals, getVitalsTrend } from '../services/patient.js'
import { getAlertsForPatient } from '../services/alert.js'

const router = Router()

router.get('/', authRequired, async (_req: AuthRequest, res) => {
  try {
    const patients = await getAllPatients()
    const enriched = await Promise.all(
      patients.map(p => getPatientWithAlert(p.id))
    )
    res.json({ patients: enriched.filter(Boolean) })
  } catch (err) {
    console.error('[PATIENTS] List error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', authRequired, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid patient ID' })
      return
    }
    const patient = await getPatientWithAlert(id)
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' })
      return
    }
    res.json(patient)
  } catch (err) {
    console.error('[PATIENTS] Detail error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id/vitals', authRequired, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid patient ID' })
      return
    }
    const latest = await getLatestVitals(id)
    const trend = await getVitalsTrend(id)
    res.json({ latest: latest, trend })
  } catch (err) {
    console.error('[PATIENTS] Vitals error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id/alerts', authRequired, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid patient ID' })
      return
    }
    const alerts = await getAlertsForPatient(id)
    res.json({ alerts })
  } catch (err) {
    console.error('[PATIENTS] Alert history error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
