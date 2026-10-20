import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  loginWithEmail,
  loginWithPassword,
  loginWithPhone,
  requestEmailCode,
  requestPhoneCode,
} from '../api/account'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { useI18n } from '../i18n/useI18n'

type LoginMethod = 'phone' | 'email' | 'username'

const methods: { id: LoginMethod; label: 'auth.methodPhone' | 'auth.methodEmail' | 'auth.methodUser' }[] = [
  { id: 'phone', label: 'auth.methodPhone' },
  { id: 'email', label: 'auth.methodEmail' },
  { id: 'username', label: 'auth.methodUser' },
]

export default function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [method, setMethod] = useState<LoginMethod>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  function chooseMethod(next: LoginMethod) {
    setMethod(next)
    setCode('')
    setCodeSent(false)
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      if (method === 'username') {
        const session = await loginWithPassword(username, password)
        localStorage.setItem('kernoon-session', JSON.stringify(session))
        navigate('/home')
        return
      }

      if (!codeSent) {
        if (method === 'phone') await requestPhoneCode(phone)
        else await requestEmailCode(email)
        setCodeSent(true)
        return
      }

      const session =
        method === 'phone'
          ? await loginWithPhone(phone, code)
          : await loginWithEmail(email, code)
      localStorage.setItem('kernoon-session', JSON.stringify(session))
      navigate('/home')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('auth.loginError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout title={t('auth.welcome')} subtitle={t('auth.loginLead')}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-methods" role="tablist" aria-label={t('auth.methods')}>
          {methods.map((item) => (
            <button
              key={item.id}
              className={item.id === method ? 'auth-methods__option is-selected' : 'auth-methods__option'}
              type="button"
              role="tab"
              aria-selected={item.id === method}
              onClick={() => chooseMethod(item.id)}
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        {method === 'phone' ? (
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="phone">
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
        ) : null}

        {method === 'email' ? (
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
              required
            />
          </div>
        ) : null}

        {method === 'username' ? (
          <>
            <div className="auth-field">
              <label className="auth-field__label" htmlFor="username">
                {t('auth.username')}
              </label>
              <input
                className="auth-field__input"
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder={t('auth.username')}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
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
                required
              />
            </div>
          </>
        ) : null}

        {method !== 'username' && codeSent ? (
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="code">
              {t('auth.code')}
            </label>
            <input
              className="auth-field__input"
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              placeholder={t('auth.code')}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
            <p className="auth-form__note">
              {method === 'phone' ? t('auth.codeSentPhone') : t('auth.codeSentEmail')}
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="auth-submit" type="submit" disabled={pending}>
          {method !== 'username' && !codeSent ? t('auth.sendCode') : t('auth.login')}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">{t('auth.forgot')}</Link>
          <Link to="/signup">{t('auth.signupLink')}</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
