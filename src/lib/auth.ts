import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const encodedKey = new TextEncoder().encode(secretKey)

export interface TokenPayload {
  userId: string
  email: string
  role: string
  escolaIds?: string[]
  exp?: number
}

export async function createToken(payload: Omit<TokenPayload, 'exp'>, expiresIn: string = '24h') {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey)
    return payload as TokenPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) return null
  
  return verifyToken(token)
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

export function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs')
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = require('bcryptjs')
  return bcrypt.compare(password, hashedPassword)
}
