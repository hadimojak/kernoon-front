import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { useI18n } from '../i18n/useI18n'

export default function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/home')
  }

  return (
    <AuthLayout title={t('auth.welcome')} subtitle={t('auth.loginLead')}>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="email">
            {t('auth.email')}
          </label>
          <input
            className="auth-field__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="password">
            {t('auth.password')}
          </label>
          <PasswordInput
            className="auth-field__input"
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button className="auth-submit" type="submit">
          {t('auth.login')}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">{t('auth.forgot')}</Link>
          <Link to="/signup">{t('auth.signupLink')}</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
