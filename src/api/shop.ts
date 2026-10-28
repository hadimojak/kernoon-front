import { apiRequest } from './client'

export type CatalogProduct = {
  id: string
  name: string
  nameFa: string
  usd: number
  toman: number
  image: string
  category: string
  sizes: string[]
  stock: number
  description: string
}

export type ShopOrder = {
  id: string
  status: string
  totalToman: number
  createdAt: string
  items: { name: string; quantity: number; lineToman: number }[]
}

export function listProducts(category?: string, size?: string) {
  const query = new URLSearchParams()
  if (category) query.set('category', category)
  if (size) query.set('size', size)
  const suffix = query.toString() ? `?${query}` : ''
  return apiRequest<CatalogProduct[]>(`/products${suffix}`, {
    method: 'GET',
    auth: false,
  })
}

export function getProduct(id: string) {
  return apiRequest<CatalogProduct>(`/products/${id}`, {
    method: 'GET',
    auth: false,
  })
}

export function listOrders() {
  return apiRequest<ShopOrder[]>('/orders', { method: 'GET' })
}

export type AddressInput = {
  fullName: string
  phone: string
  province: string
  city: string
  postalCode: string
  street: string
  plaque?: string
  unit?: string
  isDefault?: boolean
}

export type Address = AddressInput & {
  id: string
  userId: string
  country?: string
}

export function listAddresses() {
  return apiRequest<Address[]>('/addresses', { method: 'GET' })
}

export function addAddress(body: AddressInput) {
  return apiRequest<Address>('/addresses', { body })
}

export function removeAddress(id: string) {
  return apiRequest<{ deleted: boolean }>(`/addresses/${id}`, {
    method: 'DELETE',
  })
}

export type PaymentInput = {
  holderName: string
  bank: string
  last4: string
  expMonth: number
  expYear: number
  isDefault?: boolean
}

export type PaymentMethod = PaymentInput & {
  id: string
  userId: string
  brand?: string
}

export function listPaymentMethods() {
  return apiRequest<PaymentMethod[]>('/payment-methods', { method: 'GET' })
}

export function addPaymentMethod(body: PaymentInput) {
  return apiRequest<PaymentMethod>('/payment-methods', { body })
}

export function removePaymentMethod(id: string) {
  return apiRequest<{ deleted: boolean }>(`/payment-methods/${id}`, {
    method: 'DELETE',
  })
}

export type Profile = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  gender: string
  role: string
  createdAt: string
}

export function getProfile() {
  return apiRequest<Profile>('/profile', { method: 'GET' })
}

export function updateProfile(body: {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  phone?: string
  gender?: string
}) {
  return apiRequest<Profile>('/profile', { method: 'PATCH', body })
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<{ updated: boolean }>('/profile/password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
  })
}

export function applyAsSeller(body: {
  shop: string
  name: string
  email: string
  phone?: string
  province?: string
  city: string
}) {
  return apiRequest('/sellers/applications', { body, auth: false })
}

export type CartItem = {
  id: string
  productId: string
  size: string
  tier: string
  quantity: number
}

export type Cart = {
  items: CartItem[]
}

export function getCart() {
  return apiRequest<Cart>('/cart', { method: 'GET' })
}

export function addCartItem(body: {
  productId: string
  size: string
  tier: string
  quantity: number
}) {
  return apiRequest<Cart>('/cart/items', { body })
}

export function removeCartItem(id: string) {
  return apiRequest<Cart>(`/cart/items/${id}`, { method: 'DELETE' })
}

export function checkoutOrder(body: { addressId: string; paymentMethodId: string }) {
  return apiRequest('/checkout', { body })
}
