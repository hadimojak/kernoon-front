import type { AccountRole } from '../api/account'

const SESSION_KEY = 'kernoon-session'

export type SessionUser = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  role: AccountRole
}

type StoredSession = {
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  accessExpiresAt?: number
  user?: Partial<SessionUser> & { role?: AccountRole }
}

export function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredSession
  } catch {
    return null
  }
}

export function readSessionUser(): SessionUser | null {
  const session = readSession()
  const role = session?.user?.role
  if (role !== 'customer' && role !== 'seller' && role !== 'masterSeller') {
    return null
  }
  return {
    id: session?.user?.id ?? '',
    firstName: session?.user?.firstName ?? '',
    lastName: session?.user?.lastName ?? '',
    username: session?.user?.username ?? '',
    email: session?.user?.email ?? '',
    phone: session?.user?.phone ?? '',
    role,
  }
}

export function readSessionRole(): AccountRole | null {
  return readSessionUser()?.role ?? null
}

export function sessionDisplayName(user: SessionUser | null = readSessionUser()) {
  if (!user) return null
  const name = user.firstName.trim() || user.username.trim() || user.email.trim()
  return name || null
}

export function isLoggedIn() {
  return Boolean(readSessionUser())
}

export function canOpenSellerPanel(role: AccountRole | null = readSessionRole()) {
  return role === 'seller' || role === 'masterSeller'
}

export function canOpenAccount(role: AccountRole | null = readSessionRole()) {
  return role === 'customer' || role === 'seller' || role === 'masterSeller'
}

export function saveSession(session: unknown) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('kernoon-session'))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('kernoon-session'))
}
