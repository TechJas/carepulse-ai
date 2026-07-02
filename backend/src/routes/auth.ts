import { Router } from 'express'
import { login, verifyToken } from '../services/auth.js'
import type { AuthRequest } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' })
      return
    }

    const result = await login(email, password)
    if (!result) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    res.json(result)
  } catch (err) {
    console.error('[AUTH] Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/me', (req: AuthRequest, res) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const payload = verifyToken(header.slice(7))
  if (!payload) {
    res.status(401).json({ error: 'Invalid token' })
    return
  }

  res.json({ user_id: payload.userId, role: payload.role })
})

export default router
