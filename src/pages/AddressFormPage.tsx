import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addAddress } from '../api/shop'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { iranProvinces, normalizeIranPhone, provinceLabels } from '../data/iran'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/AddressesPage.css'

export default function AddressFormPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState<(typeof iranProvinces)[number]>('tehran')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [street, setStreet] = useState('')
  const [plaque, setPlaque] = useState('')
  const [unit, setUnit] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    document.title = `${t('account.addAddress')} | ${t('brand.name')}`
  }, [t])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      await addAddress({
        fullName: fullName.trim(),
        phone: normalizeIranPhone(phone),
        province,
        city: city.trim(),
        postalCode: postalCode.replace(/\D/g, ''),
        street: street.trim(),
        plaque: plaque.trim() || undefined,
        unit: unit.trim() || undefined,
        isDefault: true,
      })
      navigate('/addresses')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="profile-page addresses-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="addresses-panel" aria-labelledby="add-address-title">
            <div className="addresses-panel__header">
              <h2 id="add-address-title">{t('account.addAddress')}</h2>
              <Link className="addresses-add-link" to="/addresses">
                {t('account.back')}
              </Link>
            </div>

            <form className="profile-card account-form" onSubmit={handleSubmit}>
              <label className="profile-field">
                <span>{t('account.fullName')}</span>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </label>
              <label className="profile-field">
                <span>{t('account.phone')}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xxxxxxxxx"
                  required
                />
              </label>
              <label className="profile-field">
                <span>{t('account.province')}</span>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as typeof province)}
                  required
                >
                  {iranProvinces.map((id) => (
                    <option key={id} value={id}>
                      {provinceLabels[id][lang]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="profile-field">
                <span>{t('account.city')}</span>
                <input value={city} onChange={(e) => setCity(e.target.value)} required />
              </label>
              <label className="profile-field">
                <span>{t('account.postalCode')}</span>
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
              </label>
              <label className="profile-field">
                <span>{t('account.street')}</span>
                <input value={street} onChange={(e) => setStreet(e.target.value)} required />
              </label>
              <label className="profile-field">
                <span>{t('account.plaque')}</span>
                <input value={plaque} onChange={(e) => setPlaque(e.target.value)} />
              </label>
              <label className="profile-field">
                <span>{t('account.unit')}</span>
                <input value={unit} onChange={(e) => setUnit(e.target.value)} />
              </label>
              {error ? <p className="account-form__error">{error}</p> : null}
              <div className="profile-card__actions">
                <button className="profile-button" type="submit" disabled={pending}>
                  {pending ? t('account.saving') : t('account.saveAddress')}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
