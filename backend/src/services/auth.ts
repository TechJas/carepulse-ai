import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../db/pool.js'
import type { AuthPayload } from '../types/index.js'

const JWT_SECRET: string = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES_SECONDS = 8 * 60 * 60 // 8 hours

export async function login(email: string, password: string) {
  const result = await query('SELECT id, name, email, password_hash, role FROM nurses WHERE email = $1', [email])
  if (result.rows.length === 0) return null

  const nurse = result.rows[0]
  const valid = await bcrypt.compare(password, nurse.password_hash)
  if (!valid) return null

  const payload: AuthPayload = { userId: nurse.id, role: nurse.role }
  const token = jwt.sign(payload as object, JWT_SECRET, { expiresIn: JWT_EXPIRES_SECONDS })

  return {
    token,
    user: { id: nurse.id, name: nurse.name, email: nurse.email, role: nurse.role },
  }
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    return null
  }
}
