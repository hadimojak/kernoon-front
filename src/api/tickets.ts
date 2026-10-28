import { apiRequest } from './client'

export type TicketKind = 'product' | 'general'
export type TicketStatus = 'open' | 'answered' | 'closed'

export type Ticket = {
  id: string
  kind: TicketKind
  status: TicketStatus
  subject: string
  body: string
  customerId: string
  customerName: string
  productId: string | null
  productName: string
  sellerId: string | null
  masterSellerId: string | null
  createdAt: string
  updatedAt: string
}

export type TicketMessage = {
  id: string
  ticketId: string
  senderId: string
  senderRole: 'customer' | 'seller' | 'masterSeller'
  senderName: string
  body: string
  createdAt: string
}

export type TicketDetail = Ticket & { messages: TicketMessage[] }

export function getTicketWidget() {
  return apiRequest<{ enabled: boolean }>('/tickets/widget', {
    method: 'GET',
    auth: false,
  })
}

export function getTicketWidgetSettings() {
  return apiRequest<{ enabled: boolean; masterSellerId: string }>(
    '/tickets/widget/settings',
    { method: 'GET' },
  )
}

export function setTicketWidget(enabled: boolean) {
  return apiRequest<{ enabled: boolean; masterSellerId: string }>(
    '/tickets/widget',
    { method: 'PATCH', body: { enabled } },
  )
}

export function listTickets() {
  return apiRequest<Ticket[]>('/tickets', { method: 'GET' })
}

export function getTicket(id: string) {
  return apiRequest<TicketDetail>(`/tickets/${id}`, { method: 'GET' })
}

export function createTicket(body: {
  kind: TicketKind
  subject: string
  body: string
  productId?: string
  customerName?: string
}) {
  return apiRequest<{ ticket: Ticket; message: TicketMessage }>('/tickets', {
    body,
  })
}

export function sendTicketMessage(id: string, body: string, senderName?: string) {
  return apiRequest<{ ticket: Ticket; message: TicketMessage }>(
    `/tickets/${id}/messages`,
    { body: { body, senderName } },
  )
}

export function updateTicketStatus(id: string, status: TicketStatus) {
  return apiRequest<Ticket>(`/tickets/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}

export function ticketsWsUrl() {
  return import.meta.env.VITE_TICKETS_WS_URL ?? 'http://localhost:3010'
}
