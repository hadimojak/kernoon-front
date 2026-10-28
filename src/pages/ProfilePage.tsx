import { useEffect, useState, type FormEvent } from 'react'
import { persistSession } from '../api/client'
import {
  changePassword,
  getProfile,
  updateProfile,
} from '../api/shop'
import { readSession, readSessionUser } from '../auth/session'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { PasswordInput } from '../components/PasswordInput'
import { HelpIcon } from '../components/icons/HelpIcon'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/ProfilePage.css'

const genderOptions: { value: string; label: MessageKey }[] = [
  { value: '', label: 'account.genderSelect' },
  { value: 'female', label: 'account.genderFemale' },
  { value: 'male', label: 'account.genderMale' },
  { value: 'nonbinary', label: 'account.genderNonbinary' },
  { value: 'prefer_not', label: 'account.genderPreferNot' },
]

export default function ProfilePage() {
  const { t, lang } = useI18n()
  const sessionUser = readSessionUser()
  const [firstName, setFirstName] = useState(sessionUser?.firstName ?? '')
  const [lastName, setLastName] = useState(sessionUser?.lastName ?? '')
  const [username, setUsername] = useState(sessionUser?.username ?? '')
  const [email, setEmail] = useState(sessionUser?.email ?? '')
  const [phone, setPhone] = useState(sessionUser?.phone ?? '')
  const [gender, setGender] = useState('')
  const [memberSince, setMemberSince] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [profileNotice, setProfileNotice] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [pendingProfile, setPendingProfile] = useState(false)
  const [pendingPassword, setPendingPassword] = useState(false)

  useEffect(() => {
    document.title = `${t('account.title')} | ${t('brand.name')}`
  }, [t])

  useEffect(() => {
    let alive = true
    getProfile()
      .then((profile) => {
        if (!alive) return
        setFirstName(profile.firstName)
        setLastName(profile.lastName)
        setUsername(profile.username)
        setEmail(profile.email)
        setPhone(profile.phone)
        setGender(profile.gender || '')
        setMemberSince(
          new Date(profile.createdAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        )
      })
      .catch(() => {
        /* keep session values */
      })
    return () => {
      alive = false
    }
  }, [lang])

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileError('')
    setProfileNotice('')
    setPendingProfile(true)
    try {
      const profile = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim(),
        gender,
      })
      const session = readSession()
      if (session?.accessToken && session.refreshToken && session.expiresIn) {
        persistSession({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          expiresIn: session.expiresIn,
          user: {
            id: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            username: profile.username,
            email: profile.email,
            phone: profile.phone,
            role: profile.role as 'customer' | 'seller' | 'masterSeller',
          },
        })
      }
      setProfileNotice(t('account.profileSaved'))
    } catch (caught) {
      setProfileError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPendingProfile(false)
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordError('')
    setPasswordNotice('')
    setPendingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setPasswordNotice(t('account.passwordSaved'))
    } catch (caught) {
      setPasswordError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPendingPassword(false)
    }
  }

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <div className="profile-content">
            <section className="profile-section" aria-labelledby="personal-profile-title">
              <h2 id="personal-profile-title">{t('account.personal')}</h2>
              <form className="profile-card" onSubmit={handleProfileSubmit}>
                <div className="profile-card__grid">
                  <div className="profile-fields">
                    <label className="profile-field">
                      <span>{t('account.firstName')}</span>
                      <input
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('account.lastName')}</span>
                      <input
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        autoComplete="family-name"
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('auth.username')}</span>
                      <input
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('account.email')}</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('account.phoneOptional')}</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        autoComplete="tel"
                      />
                    </label>
                    <label className="profile-field">
                      <span>{t('account.genderOptional')}</span>
                      <select value={gender} onChange={(event) => setGender(event.target.value)}>
                        {genderOptions.map((option) => (
                          <option key={option.value || 'empty'} value={option.value}>
                            {t(option.label)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <p className="profile-help">
                      <HelpIcon size={15} />
                      <span>{t('account.privacyNote')}</span>
                    </p>
                  </div>

                  <aside className="profile-member">
                    <img src="/profile/member.png" alt="" />
                    <p>
                      {t('account.memberSince')}
                      <br />
                      <strong>{memberSince || '—'}</strong>
                    </p>
                  </aside>
                </div>

                {profileError ? <p className="account-form__error">{profileError}</p> : null}
                {profileNotice ? <p className="account-form__notice">{profileNotice}</p> : null}

                <div className="profile-card__actions">
                  <button className="profile-button" type="submit" disabled={pendingProfile}>
                    {pendingProfile ? t('account.saving') : t('account.updateProfile')}
                  </button>
                </div>
              </form>
            </section>

            <section className="profile-section" aria-labelledby="password-title">
              <h2 id="password-title">{t('account.password')}</h2>
              <form className="profile-card" onSubmit={handlePasswordSubmit}>
                <div className="profile-field profile-field--password">
                  <label htmlFor="current-password">{t('account.currentPassword')}</label>
                  <PasswordInput
                    id="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <div className="profile-field profile-field--password">
                  <label htmlFor="new-password">{t('account.newPassword')}</label>
                  <PasswordInput
                    id="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="profile-requirements">
                  <p>{t('account.passwordRules')}</p>
                  <ul>
                    <li>{t('account.passwordRule1')}</li>
                    <li>{t('account.passwordRule2')}</li>
                  </ul>
                </div>

                {passwordError ? <p className="account-form__error">{passwordError}</p> : null}
                {passwordNotice ? <p className="account-form__notice">{passwordNotice}</p> : null}

                <div className="profile-card__actions">
                  <button className="profile-button" type="submit" disabled={pendingPassword}>
                    {pendingPassword ? t('account.saving') : t('account.updatePassword')}
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
