import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAddresses, removeAddress, type Address } from '../api/shop'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { AddIcon } from '../components/icons/AddIcon'
import { EmptyAddressesIcon } from '../components/icons/EmptyAddressesIcon'
import { provinceLabels } from '../data/iran'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/AddressesPage.css'

export default function AddressesPage() {
  const { t, lang } = useI18n()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = `${t('account.deliveryAddresses')} | ${t('brand.name')}`
  }, [t])

  useEffect(() => {
    let alive = true
    listAddresses()
      .then((rows) => {
        if (alive) setAddresses(rows)
      })
      .catch((caught) => {
        if (alive) {
          setError(caught instanceof Error ? caught.message : t('account.loadError'))
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [t])

  async function handleRemove(id: string) {
    try {
      await removeAddress(id)
      setAddresses((current) => current.filter((row) => row.id !== id))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    }
  }

  return (
    <div className="profile-page addresses-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="addresses-panel" aria-labelledby="delivery-addresses-title">
            <div className="addresses-panel__header">
              <h2 id="delivery-addresses-title">{t('account.deliveryAddresses')}</h2>
              <Link className="addresses-add-link" to="/addresses/new">
                <AddIcon size={18} />
                <span>{t('account.addAddress')}</span>
              </Link>
            </div>

            {error ? <p className="account-form__error">{error}</p> : null}
            {loading ? <p>{t('account.loading')}</p> : null}

            {!loading && addresses.length === 0 ? (
              <div className="addresses-empty">
                <h3>{t('account.noAddresses')}</h3>
                <EmptyAddressesIcon size={180} className="addresses-empty__art" />
                <p>{t('account.noAddressesLead')}</p>
                <Link className="addresses-add-button" to="/addresses/new">
                  {t('account.addAddress')}
                </Link>
              </div>
            ) : null}

            {!loading && addresses.length > 0 ? (
              <ul className="account-list">
                {addresses.map((address) => (
                  <li key={address.id} className="account-list__item">
                    <div>
                      <strong>{address.fullName}</strong>
                      <p>
                        {address.street}
                        {address.plaque ? `، پلاک ${address.plaque}` : ''}
                        {address.unit ? `، واحد ${address.unit}` : ''}
                      </p>
                      <p>
                        {provinceLabels[address.province as keyof typeof provinceLabels]?.[lang] ??
                          address.province}
                        ، {address.city} — {address.postalCode}
                      </p>
                      <p>{address.phone}</p>
                    </div>
                    <button type="button" onClick={() => handleRemove(address.id)}>
                      {t('account.remove')}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
