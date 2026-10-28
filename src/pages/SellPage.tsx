import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { applyAsSeller } from '../api/shop'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { iranProvinces, normalizeIranPhone, provinceLabels } from '../data/iran'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/SellPage.css'

const perks: { title: MessageKey; body: MessageKey }[] = [
  { title: 'seller.perk1.title', body: 'seller.perk1.body' },
  { title: 'seller.perk2.title', body: 'seller.perk2.body' },
  { title: 'seller.perk3.title', body: 'seller.perk3.body' },
]

export default function SellPage() {
  const { t, lang } = useI18n()
  const [shop, setShop] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState<(typeof iranProvinces)[number]>('tehran')
  const [city, setCity] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    document.title = `${t('seller.title')} | ${t('brand.name')}`
  }, [t])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const normalized = normalizeIranPhone(phone)
      await applyAsSeller({
        shop: shop.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: normalized || undefined,
        province,
        city: city.trim(),
      })
      setSubmitted(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('seller.applyError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="seller-join">
      <Header />

      <main>
        <section className="seller-join__hero" aria-labelledby="join-title">
          <h1 id="join-title">{t('seller.title')}</h1>
          <p>{t('seller.lead')}</p>
          <a className="seller-join__cta" href="#apply">
            {t('seller.apply')}
          </a>
          <p className="seller-join__login">
            {t('seller.already')} <Link to="/sell/login">{t('seller.loginLink')}</Link>
          </p>
        </section>

        <section className="seller-join__perks" aria-label="Why join">
          {perks.map((perk) => (
            <article key={perk.title}>
              <h2>{t(perk.title)}</h2>
              <p>{t(perk.body)}</p>
            </article>
          ))}
        </section>

        <section className="seller-join__apply" id="apply" aria-labelledby="apply-title">
          {submitted ? (
            <div className="seller-join__thanks">
              <h2 id="apply-title">{t('seller.thanksTitle')}</h2>
              <p>
                {t('seller.thanksBody')
                  .replace('{name}', name.split(' ')[0] || (lang === 'fa' ? 'فروشنده' : 'there'))
                  .replace('{shop}', shop || (lang === 'fa' ? 'فروشگاه شما' : 'your shop'))
                  .replace('{email}', email)}
              </p>
              <Link to="/sell/login">{t('seller.goLogin')}</Link>
            </div>
          ) : (
            <>
              <h2 id="apply-title">{t('seller.formTitle')}</h2>
              <form onSubmit={handleSubmit} noValidate>
                <label>
                  {t('seller.shopName')}
                  <input value={shop} onChange={(event) => setShop(event.target.value)} required />
                </label>
                <label>
                  {t('seller.yourName')}
                  <input value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
                <label>
                  {t('seller.email')}
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label>
                  {t('seller.phone')}
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="09xxxxxxxxx"
                    required
                  />
                </label>
                <label>
                  {t('seller.province')}
                  <select
                    value={province}
                    onChange={(event) => setProvince(event.target.value as typeof province)}
                  >
                    {iranProvinces.map((id) => (
                      <option key={id} value={id}>
                        {provinceLabels[id][lang]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t('seller.city')}
                  <input value={city} onChange={(event) => setCity(event.target.value)} required />
                </label>
                {error ? <p className="account-form__error">{error}</p> : null}
                <button type="submit" disabled={pending}>
                  {pending ? t('account.saving') : t('seller.submit')}
                </button>
              </form>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
