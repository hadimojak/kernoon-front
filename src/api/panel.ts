import { apiRequest } from './client'

export type PanelDashboard = {
  products: number
  customers: number
  orders: number
  revenueToman: number
}

export type PanelProduct = {
  id: string
  name: string
  nameFa: string
  usd: number
  toman: number
  category: string
  sizes: string[]
  stock: number
  image: string
  images: string[]
  description: string
  sellerId?: string
  masterSellerId?: string
}

export type PanelCustomer = {
  id: string
  name: string
  phone: string
  province: string
  city: string
}

export type SellerProductInput = {
  name: string
  nameFa: string
  toman: number
  usd?: number
  category: string
  sizes: string[]
  stock: number
  description: string
  image?: string
  images?: string[]
}

export function panelDashboard() {
  return apiRequest<PanelDashboard>('/panel/dashboard', { method: 'GET' })
}

export function panelProducts() {
  return apiRequest<PanelProduct[]>('/panel/products', { method: 'GET' })
}

export function addPanelProduct(body: SellerProductInput) {
  return apiRequest<PanelProduct>('/panel/products', { body })
}

export function updatePanelProduct(id: string, body: SellerProductInput) {
  return apiRequest<PanelProduct>(`/panel/products/${id}`, {
    method: 'PATCH',
    body,
  })
}

export function removePanelProduct(id: string) {
  return apiRequest<{ deleted: boolean }>(`/panel/products/${id}`, {
    method: 'DELETE',
  })
}

export function panelCustomers() {
  return apiRequest<PanelCustomer[]>('/panel/customers', { method: 'GET' })
}

export function panelOrders() {
  return apiRequest<unknown[]>('/panel/orders', { method: 'GET' })
}
