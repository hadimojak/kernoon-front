import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import './CheckoutPage.css'

export default function CheckoutPage() {
  useEffect(() => {
    document.title = 'Cart | BloomNation'
  }, [])

  return (
    <div className="checkout-page">
      <Header userName="hadi" />

      <main className="checkout-page__main">
        <section className="checkout-empty" aria-labelledby="checkout-empty-title">
          <img
            className="checkout-empty__art"
            src="/checkout/icons/empty-cart.svg"
            alt=""
            width={120}
            height={103}
          />
          <h1 id="checkout-empty-title">Your cart is empty</h1>
          <hr className="checkout-empty__rule" />
          <Link className="checkout-empty__cta" to="/home">
            Continue Shopping
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
