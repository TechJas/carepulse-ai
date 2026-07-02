import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('error', (err) => {
  console.error('Unexpected database pool error', err)
  process.exit(1)
})

export async function query(text: string, params?: unknown[]) {
  const start = Date.now()
  const result = await pool.query(text, params)
  const duration = Date.now() - start
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[DB] ${duration}ms | ${text.slice(0, 80)}...`)
  }
  return result
}

export async function getClient() {
  const client = await pool.connect()
  return client
}
