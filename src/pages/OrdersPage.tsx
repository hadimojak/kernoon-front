import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { listOrders, type ShopOrder } from '../api/shop'
import { AccountSidebar } from '../components/AccountSidebar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { EmptyOrdersIcon } from '../components/icons/EmptyOrdersIcon'
import { PinIcon } from '../components/icons/PinIcon'
import { useI18n } from '../i18n/useI18n'
import '../styles/pages/ProfilePage.css'
import '../styles/pages/OrdersPage.css'

export default function OrdersPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [place, setPlace] = useState('')
  const [orders, setOrders] = useState<ShopOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = `${t('account.orders')} | ${t('brand.name')}`
  }, [t])

  useEffect(() => {
    let alive = true
    listOrders()
      .then((rows) => {
        if (alive) setOrders(rows)
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

  function handleShop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/home')
  }

  return (
    <div className="profile-page orders-page">
      <Header />

      <main className="profile-page__main">
        <div className="profile-page__frame">
          <AccountSidebar />

          <section className="orders-panel" aria-labelledby="current-orders-title">
            <h2 id="current-orders-title">{t('account.currentOrders')}</h2>
            {error ? <p className="account-form__error">{error}</p> : null}
            {loading ? <p>{t('account.loading')}</p> : null}

            {!loading && orders.length === 0 ? (
              <div className="orders-empty">
                <EmptyOrdersIcon size={200} className="orders-empty__art" />
                <h3>{t('account.noOrders')}</h3>
                <p className="orders-empty__lead">{t('account.noOrdersLead')}</p>
                <p className="orders-empty__hint">{t('account.noOrdersHint')}</p>

                <form className="orders-empty__cta" onSubmit={handleShop}>
                  <label className="orders-deliver">
                    <PinIcon className="orders-deliver__icon" size={18} />
                    <span className="orders-deliver__prefix">{t('account.deliverTo')}</span>
                    <input
                      value={place}
                      onChange={(event) => setPlace(event.target.value)}
                      aria-label={t('account.deliveryLocation')}
                    />
                  </label>
                  <button className="orders-shop" type="submit">
                    {t('account.shopNow')}
                  </button>
                </form>
              </div>
            ) : null}

            {!loading && orders.length > 0 ? (
              <ul className="account-list">
                {orders.map((order) => (
                  <li key={order.id} className="account-list__item">
                    <div>
                      <strong>
                        {t('account.order')} #{order.id.slice(0, 8)}
                      </strong>
                      <p>{order.status}</p>
                      <p>
                        {lang === 'fa'
                          ? `${order.totalToman.toLocaleString('fa-IR')} تومان`
                          : `${order.totalToman.toLocaleString('en-US')} IRR`}
                      </p>
                      <p>{new Date(order.createdAt).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}</p>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={`${order.id}-${index}`}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
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
