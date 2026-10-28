import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { getAccessToken } from '../api/client'
import { ticketsWsUrl } from '../api/tickets'
import { isLoggedIn } from '../auth/session'

export function useTicketsSocket(enabled: boolean) {
  const socketRef = useRef<Socket | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled || !isLoggedIn()) {
      socketRef.current?.disconnect()
      socketRef.current = null
      setReady(false)
      return
    }

    let cancelled = false
    let socket: Socket | null = null

    void (async () => {
      const token = await getAccessToken()
      if (!token || cancelled) return
      socket = io(`${ticketsWsUrl()}/tickets`, {
        auth: { token },
        transports: ['websocket', 'polling'],
      })
      socketRef.current = socket
      socket.on('tickets:ready', () => {
        if (!cancelled) setReady(true)
      })
      socket.on('disconnect', () => {
        if (!cancelled) setReady(false)
      })
    })()

    return () => {
      cancelled = true
      socket?.disconnect()
      socketRef.current = null
      setReady(false)
    }
  }, [enabled])

  return { socket: socketRef, ready }
}
