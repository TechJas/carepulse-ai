import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/auth.js'

export interface AuthRequest extends Request {
  user?: { userId: number; role: string }
}

export function authRequired(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  const token = header.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return
  }

  req.user = payload
  next()
}

export function chargeNurseRequired(req: AuthRequest, res: Response, next: NextFunction) {
  authRequired(req, res, () => {
    if (req.user?.role !== 'charge_nurse') {
      res.status(403).json({ error: 'Charge nurse access required' })
      return
    }
    next()
  })
}
