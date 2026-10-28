import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { AddIcon } from '../components/icons/AddIcon'
import { EmptyAddressesIcon } from '../components/icons/EmptyAddressesIcon'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/AddressesPage.css'

export default function AddressesPage() {
  useEffect(() => {
    document.title = 'Delivery Addresses | BloomNation'
  }, [])

  return (
    <div className="profile-page addresses-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="addresses-panel" aria-labelledby="delivery-addresses-title">
            <div className="addresses-panel__header">
              <h2 id="delivery-addresses-title">Delivery Addresses</h2>
              <Link className="addresses-add-link" to="/addresses/new">
                <AddIcon size={18} />
                <span>Add New Address</span>
              </Link>
            </div>

            <div className="addresses-empty">
              <h3>You have no saved addresses</h3>
              <EmptyAddressesIcon size={180} className="addresses-empty__art" />
              <p>Your saved delivery addresses will appear here.</p>
              <Link className="addresses-add-button" to="/addresses/new">
                Add new address
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
