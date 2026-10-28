import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPaymentMethods, removePaymentMethod, type PaymentMethod } from '../api/shop'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { AddCircleIcon } from '../components/icons/AddCircleIcon'
import { bankLabels } from '../data/iran'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/PaymentMethodsPage.css'

export default function PaymentMethodsPage() {
  const { t, lang } = useI18n()
  const [cards, setCards] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = `${t('account.payments')} | ${t('brand.name')}`
  }, [t])

  useEffect(() => {
    let alive = true
    listPaymentMethods()
      .then((rows) => {
        if (alive) setCards(rows)
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
      await removePaymentMethod(id)
      setCards((current) => current.filter((row) => row.id !== id))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    }
  }

  return (
    <div className="profile-page payment-methods-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="payment-panel" aria-labelledby="payment-methods-title">
            <div className="payment-panel__header">
              <h2 id="payment-methods-title">{t('account.cards')}</h2>
              <Link className="payment-add-link" to="/payment-methods/new">
                <AddCircleIcon size={18} />
                <span>{t('account.addCard')}</span>
              </Link>
            </div>

            {error ? <p className="account-form__error">{error}</p> : null}
            {loading ? <p>{t('account.loading')}</p> : null}

            {!loading && cards.length === 0 ? (
              <div className="payment-empty">
                <h3>{t('account.noPayments')}</h3>
                <img
                  className="payment-empty__art"
                  src="/payment/icons/00-empty-art.svg"
                  alt=""
                  width={180}
                  height={180}
                />
                <p>{t('account.noPaymentsLead')}</p>
                <Link className="payment-add-button" to="/payment-methods/new">
                  {t('account.addCard')}
                </Link>
              </div>
            ) : null}

            {!loading && cards.length > 0 ? (
              <ul className="account-list">
                {cards.map((card) => (
                  <li key={card.id} className="account-list__item">
                    <div>
                      <strong>{card.holderName}</strong>
                      <p>
                        {bankLabels[card.bank as keyof typeof bankLabels]?.[lang] ?? card.bank} ·····
                        {card.last4}
                      </p>
                      <p>
                        {String(card.expMonth).padStart(2, '0')}/{card.expYear}
                      </p>
                    </div>
                    <button type="button" onClick={() => handleRemove(card.id)}>
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
