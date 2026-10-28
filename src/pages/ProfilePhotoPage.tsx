import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getProfile,
  removeProfileImage,
  uploadProfileImage,
} from '../api/shop'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/ProfilePhotoPage.css'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_BYTES = 1_500_000

function readFileAsBase64(file: File) {
  return new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const comma = result.indexOf(',')
      resolve({
        base64: comma >= 0 ? result.slice(comma + 1) : result,
        mimeType: file.type,
      })
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

export default function ProfilePhotoPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState('/profile/member.png')
  const [hasAvatar, setHasAvatar] = useState(false)
  const [pendingFile, setPendingFile] = useState<{
    base64: string
    mimeType: string
    objectUrl: string
  } | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `${t('account.photo')} | ${t('brand.name')}`
  }, [t])

  useEffect(() => {
    let alive = true
    getProfile()
      .then((profile) => {
        if (!alive) return
        if (profile.avatarUrl) {
          setPreview(profile.avatarUrl)
          setHasAvatar(true)
        }
      })
      .catch(() => {
        /* keep placeholder */
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (pendingFile?.objectUrl) URL.revokeObjectURL(pendingFile.objectUrl)
    }
  }, [pendingFile])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    setError('')
    setNotice('')
    if (!file) return
    if (!ALLOWED.has(file.type)) {
      setError(t('account.photoTypeError'))
      return
    }
    if (file.size > MAX_BYTES) {
      setError(t('account.photoSizeError'))
      return
    }
    try {
      const { base64, mimeType } = await readFileAsBase64(file)
      if (pendingFile?.objectUrl) URL.revokeObjectURL(pendingFile.objectUrl)
      const objectUrl = URL.createObjectURL(file)
      setPendingFile({ base64, mimeType, objectUrl })
      setPreview(objectUrl)
    } catch {
      setError(t('account.saveError'))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!pendingFile) {
      setError(t('account.photoPickError'))
      return
    }
    setError('')
    setNotice('')
    setPending(true)
    try {
      const profile = await uploadProfileImage(pendingFile.base64, pendingFile.mimeType)
      if (pendingFile.objectUrl) URL.revokeObjectURL(pendingFile.objectUrl)
      setPendingFile(null)
      setPreview(profile.avatarUrl || '/profile/member.png')
      setHasAvatar(Boolean(profile.avatarUrl))
      setNotice(t('account.photoSaved'))
      navigate('/profile')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPending(false)
    }
  }

  async function handleRemove() {
    setError('')
    setNotice('')
    setPending(true)
    try {
      await removeProfileImage()
      if (pendingFile?.objectUrl) URL.revokeObjectURL(pendingFile.objectUrl)
      setPendingFile(null)
      setPreview('/profile/member.png')
      setHasAvatar(false)
      setNotice(t('account.photoRemoved'))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="profile-page profile-photo-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="profile-content" aria-labelledby="profile-photo-title">
            <div className="profile-photo-header">
              <h2 id="profile-photo-title">{t('account.photo')}</h2>
              <Link className="profile-photo-back" to="/profile">
                {t('account.back')}
              </Link>
            </div>

            {loading ? <p>{t('account.loading')}</p> : null}

            {!loading ? (
              <form className="profile-card profile-photo-card" onSubmit={handleSubmit}>
                <div className="profile-photo-preview">
                  <img src={preview} alt="" />
                </div>

                <p className="profile-photo-hint">{t('account.photoHint')}</p>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleFileChange}
                />

                <div className="profile-photo-actions">
                  <button
                    className="profile-button profile-button--secondary"
                    type="button"
                    disabled={pending}
                    onClick={() => inputRef.current?.click()}
                  >
                    {t('account.photoChoose')}
                  </button>
                  <button
                    className="profile-button"
                    type="submit"
                    disabled={pending || !pendingFile}
                  >
                    {pending ? t('account.saving') : t('account.photoSave')}
                  </button>
                  {hasAvatar || pendingFile ? (
                    <button
                      className="profile-button profile-button--ghost"
                      type="button"
                      disabled={pending}
                      onClick={handleRemove}
                    >
                      {t('account.photoRemove')}
                    </button>
                  ) : null}
                </div>

                {error ? <p className="account-form__error">{error}</p> : null}
                {notice ? <p className="account-form__notice">{notice}</p> : null}
              </form>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
