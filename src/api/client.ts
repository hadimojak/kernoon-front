import { clearSession, readSession, saveSession } from '../auth/session'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
const CART_KEY = 'kernoon-cart-id'

export function guestCartId() {
  try {
    const existing = localStorage.getItem(CART_KEY)
    if (existing && /^[a-zA-Z0-9-]{8,64}$/.test(existing)) return existing
    const next = crypto.randomUUID().replace(/-/g, '').slice(0, 24)
    localStorage.setItem(CART_KEY, next)
    return next
  } catch {
    return 'guest-local-cart-id'
  }
}

export type SessionResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    firstName: string
    lastName: string
    username: string
    email: string
    phone: string
    role: 'customer' | 'seller' | 'masterSeller'
  }
}

type StoredSession = SessionResponse & {
  accessExpiresAt?: number
}

let refreshInFlight: Promise<string | null> | null = null

export function persistSession(session: SessionResponse) {
  const stored: StoredSession = {
    ...session,
    accessExpiresAt: Date.now() + session.expiresIn * 1000,
  }
  saveSession(stored)
  return stored
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: string
    body?: unknown
    auth?: boolean
    retry?: boolean
  } = {},
) {
  const method = options.method ?? 'POST'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.auth !== false) {
    const token = await accessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  headers['x-cart-id'] = guestCartId()

  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 401 && options.auth !== false && options.retry !== false) {
    const next = await refreshAccessToken()
    if (next) {
      return apiRequest<T>(path, { ...options, retry: false })
    }
    clearSession()
    return apiRequest<T>(path, { ...options, auth: false, retry: false })
  }

  const data = (await response.json().catch(() => null)) as
    | T
    | { message?: string | string[] }
    | null

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data ? data.message : undefined
    throw new Error(
      Array.isArray(message) ? message.join(' ') : message || 'Request failed',
    )
  }

  return data as T
}

export async function getAccessToken() {
  const session = readSession() as StoredSession | null
  if (!session?.accessToken) return null
  const expiresAt = session.accessExpiresAt ?? 0
  if (expiresAt > Date.now() + 60_000) return session.accessToken
  return refreshAccessToken()
}

async function accessToken() {
  return getAccessToken()
}

async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight
  refreshInFlight = doRefresh().finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

async function doRefresh() {
  const session = readSession() as StoredSession | null
  if (!session?.refreshToken) return null
  try {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
    if (!response.ok) {
      clearSession()
      return null
    }
    const next = (await response.json()) as SessionResponse
    persistSession(next)
    return next.accessToken
  } catch {
    clearSession()
    return null
  }
}
