import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addPaymentMethod } from '../api/shop'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { bankLabels, iranianBanks } from '../data/iran'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/PaymentMethodsPage.css'

export default function PaymentFormPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [holderName, setHolderName] = useState('')
  const [bank, setBank] = useState<(typeof iranianBanks)[number]>('melli')
  const [last4, setLast4] = useState('')
  const [expMonth, setExpMonth] = useState('1')
  const [expYear, setExpYear] = useState(String(new Date().getFullYear()))
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    document.title = `${t('account.addCard')} | ${t('brand.name')}`
  }, [t])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      await addPaymentMethod({
        holderName: holderName.trim(),
        bank,
        last4: last4.replace(/\D/g, '').slice(-4),
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        isDefault: true,
      })
      navigate('/payment-methods')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="profile-page payment-methods-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="payment-panel" aria-labelledby="add-card-title">
            <div className="payment-panel__header">
              <h2 id="add-card-title">{t('account.addCard')}</h2>
              <Link className="payment-add-link" to="/payment-methods">
                {t('account.back')}
              </Link>
            </div>

            <form className="profile-card account-form" onSubmit={handleSubmit}>
              <label className="profile-field">
                <span>{t('account.cardHolder')}</span>
                <input
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  required
                />
              </label>
              <label className="profile-field">
                <span>{t('account.bank')}</span>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value as typeof bank)}
                  required
                >
                  {iranianBanks.map((id) => (
                    <option key={id} value={id}>
                      {bankLabels[id][lang]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="profile-field">
                <span>{t('account.cardLast4')}</span>
                <input
                  value={last4}
                  onChange={(e) => setLast4(e.target.value)}
                  inputMode="numeric"
                  maxLength={4}
                  required
                />
              </label>
              <label className="profile-field">
                <span>{t('account.expMonth')}</span>
                <input
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                  inputMode="numeric"
                  min={1}
                  max={12}
                  required
                />
              </label>
              <label className="profile-field">
                <span>{t('account.expYear')}</span>
                <input
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                  inputMode="numeric"
                  required
                />
              </label>
              {error ? <p className="account-form__error">{error}</p> : null}
              <div className="profile-card__actions">
                <button className="profile-button" type="submit" disabled={pending}>
                  {pending ? t('account.saving') : t('account.saveCard')}
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
