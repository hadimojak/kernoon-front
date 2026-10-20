import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAsSeller } from '../api/account'
import { canOpenSellerPanel } from '../auth/session'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { useI18n } from '../i18n/useI18n'

export default function SellerLoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    document.title = `${t('seller.loginTitle')} | ${t('brand.name')}`
  }, [t])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const session = await loginAsSeller(email, password)
      if (!canOpenSellerPanel(session.user.role)) {
        setError(t('auth.loginError'))
        return
      }
      localStorage.setItem('kernoon-session', JSON.stringify(session))
      navigate('/seller-panel')
    } catch {
      setError(t('auth.loginError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout title={t('seller.loginTitle')} subtitle={t('seller.loginLead')}>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="seller-email">
            {t('auth.email')}
          </label>
          <input
            className="auth-field__input"
            id="seller-email"
            placeholder={t('auth.email')}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="seller-password">
            {t('auth.password')}
          </label>
          <PasswordInput
            className="auth-field__input"
            id="seller-password"
            placeholder={t('auth.password')}
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="auth-submit" type="submit" disabled={pending}>
          {t('auth.login')}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">{t('auth.forgot')}</Link>
          <Link to="/sell">{t('seller.become')}</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
