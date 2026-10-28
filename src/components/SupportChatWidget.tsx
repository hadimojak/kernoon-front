import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  createTicket,
  getTicket,
  getTicketWidget,
  listTickets,
  sendTicketMessage,
  type Ticket,
  type TicketDetail,
  type TicketMessage,
} from '../api/tickets'
import { isLoggedIn, readSessionUser } from '../auth/session'
import { useTicketsSocket } from '../hooks/useTicketsSocket'
import { useI18n } from '../i18n/useI18n'
import '../styles/components/SupportChatWidget.css'

export function SupportChatWidget() {
  const { t, lang } = useI18n()
  const location = useLocation()
  const [params] = useSearchParams()
  const productId = location.pathname === '/product' ? params.get('item') || '' : ''

  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [active, setActive] = useState<TicketDetail | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [reply, setReply] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn())
  const user = useMemo(() => readSessionUser(), [loggedIn])

  const hideOnSeller = location.pathname.startsWith('/seller-panel')
  const { socket, ready } = useTicketsSocket(enabled && open && loggedIn && !hideOnSeller)

  useEffect(() => {
    function sync() {
      setLoggedIn(isLoggedIn())
    }
    window.addEventListener('kernoon-session', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('kernoon-session', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    let alive = true

    function refreshWidget() {
      getTicketWidget()
        .then((status) => {
          if (!alive) return
          setEnabled(status.enabled)
          if (!status.enabled) setOpen(false)
        })
        .catch(() => {
          if (alive) setEnabled(false)
        })
    }

    refreshWidget()
    const timer = window.setInterval(refreshWidget, 12_000)
    window.addEventListener('focus', refreshWidget)
    document.addEventListener('visibilitychange', refreshWidget)
    return () => {
      alive = false
      window.clearInterval(timer)
      window.removeEventListener('focus', refreshWidget)
      document.removeEventListener('visibilitychange', refreshWidget)
    }
  }, [location.pathname])

  useEffect(() => {
    const sock = socket.current
    if (!sock || !ready) return

    function onWidget(payload: { enabled: boolean }) {
      setEnabled(payload.enabled)
      if (!payload.enabled) setOpen(false)
    }

    function onCreated(payload: { ticket: Ticket; message: TicketMessage }) {
      setTickets((current) => {
        if (current.some((row) => row.id === payload.ticket.id)) return current
        return [payload.ticket, ...current]
      })
    }

    function onMessage(payload: { ticket: Ticket; message: TicketMessage }) {
      setTickets((current) =>
        current.map((row) => (row.id === payload.ticket.id ? payload.ticket : row)),
      )
      setActive((current) => {
        if (!current || current.id !== payload.ticket.id) return current
        if (current.messages.some((row) => row.id === payload.message.id)) return current
        return {
          ...payload.ticket,
          messages: [...current.messages, payload.message],
        }
      })
    }

    sock.on('widget:updated', onWidget)
    sock.on('ticket:created', onCreated)
    sock.on('message:new', onMessage)
    return () => {
      sock.off('widget:updated', onWidget)
      sock.off('ticket:created', onCreated)
      sock.off('message:new', onMessage)
    }
  }, [socket, ready])

  useEffect(() => {
    if (!open || !loggedIn || user?.role !== 'customer') return
    let alive = true
    listTickets()
      .then((rows) => {
        if (alive) setTickets(rows)
      })
      .catch(() => {
        if (alive) setTickets([])
      })
    return () => {
      alive = false
    }
  }, [open, loggedIn, user?.role])

  if (hideOnSeller || !enabled) return null

  async function openTicket(id: string) {
    setError('')
    try {
      const detail = await getTicket(id)
      setActive(detail)
      socket.current?.emit('ticket:join', { ticketId: id })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('ticket.error'))
    }
  }

  async function startTicket(event: FormEvent) {
    event.preventDefault()
    if (!subject.trim() || !body.trim()) return
    setPending(true)
    setError('')
    try {
      const kind = productId ? 'product' : 'general'
      const created = await createTicket({
        kind,
        subject: subject.trim(),
        body: body.trim(),
        ...(productId ? { productId } : {}),
        customerName:
          user?.firstName || user?.username || user?.email || undefined,
      })
      setTickets((current) => [created.ticket, ...current])
      setActive({ ...created.ticket, messages: [created.message] })
      setSubject('')
      setBody('')
      socket.current?.emit('ticket:join', { ticketId: created.ticket.id })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('ticket.error'))
    } finally {
      setPending(false)
    }
  }

  async function sendReply(event: FormEvent) {
    event.preventDefault()
    if (!active || !reply.trim()) return
    setPending(true)
    setError('')
    try {
      const result = await sendTicketMessage(
        active.id,
        reply.trim(),
        user?.firstName || user?.username || undefined,
      )
      setActive({
        ...result.ticket,
        messages: [...active.messages, result.message],
      })
      setReply('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('ticket.error'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="support-widget">
      {open ? (
        <div className="support-widget__panel" role="dialog" aria-label={t('ticket.title')}>
          <header className="support-widget__head">
            <div>
              <strong>{t('ticket.title')}</strong>
              <p>
                {productId ? t('ticket.aboutProduct') : t('ticket.general')}
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t('ticket.close')}>
              ×
            </button>
          </header>

          {!loggedIn || user?.role !== 'customer' ? (
            <div className="support-widget__gate">
              <p>{t('ticket.loginNeeded')}</p>
              <Link to="/login" state={{ from: location.pathname + location.search }}>
                {t('header.login')}
              </Link>
            </div>
          ) : active ? (
            <div className="support-widget__chat">
              <button
                className="support-widget__back"
                type="button"
                onClick={() => setActive(null)}
              >
                ← {t('ticket.back')}
              </button>
              <h3>{active.subject}</h3>
              {active.productName ? (
                <p className="support-widget__meta">{active.productName}</p>
              ) : null}
              <ul className="support-widget__messages">
                {active.messages.map((message) => (
                  <li
                    key={message.id}
                    className={
                      message.senderRole === 'customer'
                        ? 'is-mine'
                        : 'is-theirs'
                    }
                  >
                    <p>{message.body}</p>
                    <time>
                      {new Date(message.createdAt).toLocaleString(
                        lang === 'fa' ? 'fa-IR' : 'en-US',
                      )}
                    </time>
                  </li>
                ))}
              </ul>
              <form onSubmit={sendReply}>
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder={t('ticket.replyPlaceholder')}
                  rows={3}
                  required
                />
                <button type="submit" disabled={pending}>
                  {t('ticket.send')}
                </button>
              </form>
            </div>
          ) : (
            <div className="support-widget__home">
              <form onSubmit={startTicket}>
                <label>
                  {t('ticket.subject')}
                  <input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    required
                    minLength={3}
                  />
                </label>
                <label>
                  {t('ticket.message')}
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={4}
                    required
                  />
                </label>
                <button type="submit" disabled={pending}>
                  {productId ? t('ticket.startProduct') : t('ticket.startGeneral')}
                </button>
              </form>

              <div className="support-widget__list">
                <h3>{t('ticket.yours')}</h3>
                {tickets.length === 0 ? (
                  <p>{t('ticket.empty')}</p>
                ) : (
                  <ul>
                    {tickets.map((ticket) => (
                      <li key={ticket.id}>
                        <button type="button" onClick={() => void openTicket(ticket.id)}>
                          <strong>{ticket.subject}</strong>
                          <span>{ticket.status}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {error ? <p className="support-widget__error">{error}</p> : null}
        </div>
      ) : null}

      <button
        className="support-widget__fab"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {open ? t('ticket.close') : t('ticket.open')}
      </button>
    </div>
  )
}
