import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { AddCircleIcon } from '../components/icons/AddCircleIcon'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/PaymentMethodsPage.css'

export default function PaymentMethodsPage() {
  useEffect(() => {
    document.title = 'Payment Methods | BloomNation'
  }, [])

  return (
    <div className="profile-page payment-methods-page">
      <Header userName="hadi" />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="payment-panel" aria-labelledby="payment-methods-title">
            <div className="payment-panel__header">
              <h2 id="payment-methods-title">Credit/Debit Cards</h2>
              <Link className="payment-add-link" to="/payment-methods/new">
                <AddCircleIcon size={18} />
                <span>Add new card</span>
              </Link>
            </div>

            <div className="payment-empty">
              <h3>You have no saved payment methods</h3>
              <img
                className="payment-empty__art"
                src="/payment/icons/00-empty-art.svg"
                alt=""
                width={180}
                height={180}
              />
              <p>Your saved credit or debit cards will appear here.</p>
              <Link className="payment-add-button" to="/payment-methods/new">
                Add new card
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
