import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { EmptyBouquetIcon } from '../components/icons/EmptyBouquetIcon'
import { PinIcon } from '../components/icons/PinIcon'
import '../pages/ProfilePage.css'
import './OrdersPage.css'

export default function OrdersPage() {
  const navigate = useNavigate()
  const [place, setPlace] = useState('Los Angeles, CA')

  useEffect(() => {
    document.title = 'Order History | BloomNation'
  }, [])

  function handleShop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/home')
  }

  return (
    <div className="profile-page orders-page">
      <Header userName="hadi" />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="orders-panel" aria-labelledby="current-orders-title">
            <h2 id="current-orders-title">Current Orders</h2>
            <div className="orders-empty">
              <EmptyBouquetIcon size={200} className="orders-empty__art" />
              <h3>You have no current orders</h3>
              <p className="orders-empty__lead">Your in-progress orders will appear here.</p>
              <p className="orders-empty__hint">
                To discover hand-crafted blooms to send, enter your recipient&apos;s address.
              </p>

              <form className="orders-empty__cta" onSubmit={handleShop}>
                <label className="orders-deliver">
                  <PinIcon className="orders-deliver__icon" size={18} />
                  <span className="orders-deliver__prefix">Deliver to:</span>
                  <input
                    value={place}
                    onChange={(event) => setPlace(event.target.value)}
                    aria-label="Delivery location"
                  />
                </label>
                <button className="orders-shop" type="submit">
                  Shop Now
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
