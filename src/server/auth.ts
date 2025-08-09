import jwt from 'jsonwebtoken'
import type { Context, Next } from 'hono'
import { ERROR_CODES, createErrorResponse } from './errorCodes'
import logger from './logger'

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const authMiddleware = async (c: Context, next: Next) => {
  // Allow unauthenticated health checks
  const pathname = new URL(c.req.url).pathname
  if (pathname === '/api/health') {
    return next()
  }

  const token = c.req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return c.json(
      createErrorResponse(ERROR_CODES.AUTH_NO_TOKEN, 'No token provided'),
      401
    )
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    c.set('user', decoded)
    await next()
  } catch (error) {
    logger.error('Failed to verify token', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return c.json(
      createErrorResponse(ERROR_CODES.AUTH_INVALID_TOKEN, 'Invalid token'),
      401
    )
  }
}

export const generateToken = (userId: string, username: string): string => {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '24h' })
}
