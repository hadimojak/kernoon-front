import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export default function FloristLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    document.title = 'Florist Login | BloomNation'
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/home')
  }

  return (
    <AuthLayout title="Florist Login" subtitle="Sign in to your florist dashboard">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="florist-email">
            Email
          </label>
          <input
            className="auth-field__input"
            id="florist-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="florist-password">
            Password
          </label>
          <input
            className="auth-field__input"
            id="florist-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <label className="auth-checkbox">
          <input
            className="auth-checkbox__input"
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          <span>Show Password</span>
        </label>

        <button className="auth-submit" type="submit">
          Login
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot your password?</Link>
          <Link to="/florist">Become a florist</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
