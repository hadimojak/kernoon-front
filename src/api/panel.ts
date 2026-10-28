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
  toman: number
  category: string
  sizes: string[]
  stock: number
  image: string
}

export type PanelCustomer = {
  id: string
  name: string
  phone: string
  province: string
  city: string
}

export function panelDashboard() {
  return apiRequest<PanelDashboard>('/panel/dashboard', { method: 'GET' })
}

export function panelProducts() {
  return apiRequest<PanelProduct[]>('/panel/products', { method: 'GET' })
}

export function addPanelProduct(body: {
  name: string
  nameFa: string
  toman: number
  category: string
  sizes: string[]
  stock: number
  image?: string
}) {
  return apiRequest<PanelProduct>('/panel/products', { body })
}

export function panelCustomers() {
  return apiRequest<PanelCustomer[]>('/panel/customers', { method: 'GET' })
}

export function panelOrders() {
  return apiRequest<unknown[]>('/panel/orders', { method: 'GET' })
}
