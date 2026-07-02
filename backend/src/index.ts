import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { query } from './db/pool.js'
import { seed } from './db/seed.js'
import { startEscalationService } from './services/escalation.js'
import authRoutes from './routes/auth.js'
import patientRoutes from './routes/patients.js'
import alertRoutes from './routes/alerts.js'
import dashboardRoutes from './routes/dashboard.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

async function start() {
  try {
    await query('SELECT 1')
    console.log('[DB] Connected successfully')

    const schema = await import('node:fs').then(f =>
      f.readFileSync(new URL('./db/schema.sql', import.meta.url), 'utf-8')
    )
    await query(schema)
    console.log('[DB] Schema applied')

    await seed()

    startEscalationService()

    app.listen(PORT, () => {
      console.log(`[SERVER] CarePulse AI backend running on http://localhost:${PORT}`)
      console.log(`[SERVER] Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (err) {
    console.error('[STARTUP] Failed:', err)
    process.exit(1)
  }
}

start()
