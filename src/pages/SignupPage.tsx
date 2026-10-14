import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useI18n } from '../i18n/LanguageProvider'
import '../styles/pages/SignupPage.css'

export default function SignupPage() {
  const { t } = useI18n()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout title={t('auth.create')}>
      <form className="auth-form signup-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="sr-only" htmlFor="firstName">
            {t('auth.first')}
          </label>
          <input
            className="auth-field__input"
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder={t('auth.first')}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="lastName">
            {t('auth.last')}
          </label>
          <input
            className="auth-field__input"
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder={t('auth.last')}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="email">
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
          <label className="sr-only" htmlFor="password">
            {t('auth.password')}
          </label>
          <input
            className="auth-field__input"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <label className="auth-checkbox">
          <input
            className="auth-checkbox__input"
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          <span>{t('auth.showPassword')}</span>
        </label>

        <button className="auth-submit" type="submit">
          {t('auth.create')}
        </button>

        <p className="signup-form__existing">
          {t('auth.already')} <Link to="/login">{t('auth.login')}</Link>
        </p>
      </form>
    </AuthLayout>
  )
}