const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export type SignupInput = {
  firstName: string
  lastName: string
  username: string
  phone: string
  email?: string
  password: string
}

export type AccountRole = 'customer' | 'seller' | 'masterSeller'

type SessionResponse = {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    firstName: string
    lastName: string
    username: string
    email: string
    phone: string
    role: AccountRole
  }
}

export async function signup(input: SignupInput) {
  return request<SessionResponse>('/auth/signup', input)
}

export function requestPhoneCode(phone: string) {
  return request<{ sent: boolean }>('/auth/phone/code', { phone })
}

export function loginWithPhone(phone: string, code: string) {
  return request<SessionResponse>('/auth/phone/login', { phone, code })
}

export function requestEmailCode(email: string) {
  return request<{ sent: boolean }>('/auth/email/code', { email })
}

export function loginWithEmail(email: string, code: string) {
  return request<SessionResponse>('/auth/email/login', { email, code })
}

export function loginWithPassword(username: string, password: string) {
  return request<SessionResponse>('/auth/login', { username, password })
}

export function loginAsSeller(email: string, password: string) {
  return request<SessionResponse>('/auth/seller/login', { email, password })
}

async function request<T>(path: string, body: unknown) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await response.json().catch(() => null)) as
    | T
    | { message?: string | string[] }
    | null
  if (!response.ok) {
    const message = data && typeof data === 'object' && 'message' in data ? data.message : undefined
    throw new Error(Array.isArray(message) ? message.join(' ') : message || 'Request failed')
  }
  return data as T
}
