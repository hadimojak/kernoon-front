import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to continue">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="email">
            Email
          </label>
          <input
            className="auth-field__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="password">
            Password
          </label>
          <input
            className="auth-field__input"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Password"
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
          <span>Show Password</span>
        </label>

        <button className="auth-submit" type="submit">
          Login
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot your password?</Link>
          <Link to="/signup">Sign up for an account</Link>
        </div>
      </form>
    </AuthLayout>
  )
}