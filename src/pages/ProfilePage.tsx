import { useEffect, useState, type FormEvent } from 'react'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { PasswordInput } from '../components/PasswordInput'
import { HelpIcon } from '../components/icons/HelpIcon'
import '../styles/pages/ProfilePage.css'

const genderOptions = [
  { value: '', label: 'Select' },
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say' },
]

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('hadi')
  const [lastName, setLastName] = useState('arbabi')
  const [email, setEmail] = useState('hadimojak@gmail.com')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    document.title = 'My Account | BloomNation'
  }, [])

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="profile-page">
      <Header userName="hadi" />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <div className="profile-content">
            <section className="profile-section" aria-labelledby="personal-profile-title">
              <h2 id="personal-profile-title">Personal Profile</h2>
              <form className="profile-card" onSubmit={handleProfileSubmit}>
                <div className="profile-card__grid">
                  <div className="profile-fields">
                    <label className="profile-field">
                      <span>First Name</span>
                      <input
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="profile-field">
                      <span>Last Name</span>
                      <input
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        autoComplete="family-name"
                      />
                    </label>
                    <label className="profile-field">
                      <span>Email Address</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                      />
                    </label>
                    <label className="profile-field">
                      <span>Phone Number (Optional)</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        autoComplete="tel"
                      />
                    </label>
                    <label className="profile-field">
                      <span>Gender (Optional)</span>
                      <select
                        value={gender}
                        onChange={(event) => setGender(event.target.value)}
                      >
                        {genderOptions.map((option) => (
                          <option key={option.value || 'empty'} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <p className="profile-help">
                      <HelpIcon size={15} />
                      <span>
                        We use this information for analysis and will never share it with others.
                      </span>
                    </p>
                  </div>

                  <aside className="profile-member">
                    <img src="/profile/floral.png" alt="" />
                    <p>
                      BloomNation member since
                      <br />
                      <strong>July 1, 2026</strong>
                    </p>
                  </aside>
                </div>

                <div className="profile-card__actions">
                  <button className="profile-button" type="submit">
                    Update Profile
                  </button>
                </div>
              </form>
            </section>

            <section className="profile-section" aria-labelledby="password-title">
              <h2 id="password-title">Password</h2>
              <form className="profile-card" onSubmit={handlePasswordSubmit}>
                <div className="profile-field profile-field--password">
                  <label htmlFor="current-password">Enter Current Password</label>
                  <PasswordInput
                    id="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <div className="profile-field profile-field--password">
                  <label htmlFor="new-password">Enter New Password</label>
                  <PasswordInput
                    id="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="profile-requirements">
                  <p>Your Password:</p>
                  <ul>
                    <li>Must be at least 6 characters</li>
                    <li>
                      Should contain at least one upper case letter [A-Z] and one numeric character
                      [0-9]
                    </li>
                  </ul>
                </div>

                <div className="profile-card__actions">
                  <button className="profile-button" type="submit">
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
