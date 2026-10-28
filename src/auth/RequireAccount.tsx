import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { canOpenAccount } from './session'

export function RequireAccount({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!canOpenAccount()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }
  return children
}
