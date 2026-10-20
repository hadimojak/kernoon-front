import type { AccountRole } from '../api/account'

const SESSION_KEY = 'kernoon-session'

type StoredSession = {
  user?: {
    role?: AccountRole
  }
}

export function readSessionRole(): AccountRole | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as StoredSession
    const role = session.user?.role
    if (role === 'customer' || role === 'seller' || role === 'masterSeller') return role
    return null
  } catch {
    return null
  }
}

export function canOpenSellerPanel(role: AccountRole | null = readSessionRole()) {
  return role === 'seller' || role === 'masterSeller'
}
