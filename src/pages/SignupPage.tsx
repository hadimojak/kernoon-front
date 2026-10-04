import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import './SignupPage.css'

export default function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout title="Create an Account">
      <form className="auth-form signup-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="sr-only" htmlFor="firstName">
            First Name
          </label>
          <input
            className="auth-field__input"
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="auth-field__input"
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="email">
            Email Address
          </label>
          <input
            className="auth-field__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="sr-only" htmlFor="password">
            Password
          </label>
          <input
            className="auth-field__input"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
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
          Create an Account
        </button>

        <p className="signup-form__existing">
          Already on BloomNation?{' '}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  )
}