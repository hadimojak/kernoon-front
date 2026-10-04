import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import './AuthLayout.css'

type AuthLayoutProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <Header />

      <main className="auth-hero">
        <section className="auth-card" aria-labelledby="auth-title">
          <h1 className="auth-card__title" id="auth-title">
            {title}
          </h1>
          {subtitle ? <p className="auth-card__subtitle">{subtitle}</p> : null}

          {children}
        </section>
      </main>

      <Footer />
    </div>
  )
}