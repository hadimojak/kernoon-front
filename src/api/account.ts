import { apiRequest, persistSession, type SessionResponse } from './client'
import { mergeGuestCart } from './shop'

export type SignupInput = {
  firstName: string
  lastName: string
  username: string
  phone: string
  email?: string
  password: string
}

export type AccountRole = 'customer' | 'seller' | 'masterSeller'

export type { SessionResponse }

async function authRequest(path: string, body: unknown) {
  const session = await apiRequest<SessionResponse>(path, {
    body,
    auth: false,
  })
  const stored = persistSession(session)
  try {
    await mergeGuestCart()
  } catch {
    /* guest cart may be empty or cart service briefly unavailable */
  }
  return stored
}

export async function signup(input: SignupInput) {
  return authRequest('/auth/signup', input)
}

export function requestPhoneCode(phone: string) {
  return apiRequest<{ sent: boolean }>('/auth/phone/code', {
    body: { phone },
    auth: false,
  })
}

export function loginWithPhone(phone: string, code: string) {
  return authRequest('/auth/phone/login', { phone, code })
}

export function requestEmailCode(email: string) {
  return apiRequest<{ sent: boolean }>('/auth/email/code', {
    body: { email },
    auth: false,
  })
}

export function loginWithEmail(email: string, code: string) {
  return authRequest('/auth/email/login', { email, code })
}

export function loginWithPassword(username: string, password: string) {
  return authRequest('/auth/login', { username, password })
}

export function requestSellerPhoneCode(phone: string) {
  return apiRequest<{ sent: boolean }>('/auth/seller/phone/code', {
    body: { phone },
    auth: false,
  })
}

export function loginSellerWithPhone(phone: string, code: string) {
  return authRequest('/auth/seller/phone/login', { phone, code })
}

export function requestSellerEmailCode(email: string) {
  return apiRequest<{ sent: boolean }>('/auth/seller/email/code', {
    body: { email },
    auth: false,
  })
}

export function loginSellerWithEmail(email: string, code: string) {
  return authRequest('/auth/seller/email/login', { email, code })
}

export function loginAsSeller(username: string, password: string) {
  return authRequest('/auth/seller/login', { username, password })
}
