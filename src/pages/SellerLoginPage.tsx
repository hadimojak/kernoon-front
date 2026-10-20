import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { useI18n } from '../i18n/useI18n'

export default function SellerLoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    document.title = `${t('seller.loginTitle')} | ${t('brand.name')}`
  }, [t])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/seller-panel')
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
            autoComplete="username"
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

        <button className="auth-submit" type="submit">
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
