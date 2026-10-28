import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/CheckoutPage.css'

export default function CheckoutPage() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = t('cart.title')
  }, [t])

  return (
    <div className="checkout-page">
      <Header />

      <main className="checkout-page__main">
        <section className="checkout-empty" aria-labelledby="checkout-empty-title">
          <img
            className="checkout-empty__art"
            src="/checkout/icons/empty-cart.svg"
            alt=""
            width={120}
            height={103}
          />
          <h1 id="checkout-empty-title">{t('cart.empty')}</h1>
          <hr className="checkout-empty__rule" />
          <Link className="checkout-empty__cta" to="/home">
            {t('cart.continue')}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
