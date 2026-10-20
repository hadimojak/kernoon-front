import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/account'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/SignupPage.css'

export default function SignupPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const session = await signup({
        firstName,
        lastName,
        phone,
        password,
        ...(email.trim() ? { email: email.trim() } : {}),
      })
      localStorage.setItem('kernoon-session', JSON.stringify(session))
      navigate('/home')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('auth.signupError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout title={t('auth.create')}>
      <form className="auth-form signup-form" onSubmit={handleSubmit}>
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
            required
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
            required
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="phone">
            {t('auth.phone')}
          </label>
          <input
            className="auth-field__input"
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={t('auth.phone')}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="email">
            {t('auth.emailOptional')}
          </label>
          <input
            className="auth-field__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t('auth.emailOptional')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="password">
            {t('auth.password')}
          </label>
          <PasswordInput
            className="auth-field__input"
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="signup-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="auth-submit" type="submit" disabled={pending}>
          {t('auth.create')}
        </button>

        <p className="signup-form__existing">
          {t('auth.already')} <Link to="/login">{t('auth.login')}</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
