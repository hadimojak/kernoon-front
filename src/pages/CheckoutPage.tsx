import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../auth/session'
import {
  checkoutOrder,
  getCart,
  getProduct,
  listAddresses,
  listPaymentMethods,
  removeCartItem,
  type Address,
  type CartItem,
  type PaymentMethod,
  type ShopProduct,
} from '../api/shop'
import { formatMoney } from '../data/catalog'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/CheckoutPage.css'

export default function CheckoutPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [productsById, setProductsById] = useState<Record<string, ShopProduct>>({})
  const [addresses, setAddresses] = useState<Address[]>([])
  const [payments, setPayments] = useState<PaymentMethod[]>([])
  const [addressId, setAddressId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const signedIn = isLoggedIn()

  useEffect(() => {
    document.title = t('cart.title')
  }, [t])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const cart = await getCart()
        if (!alive) return
        setItems(cart.items)
        const ids = [...new Set(cart.items.map((item) => item.productId))]
        const resolved = await Promise.all(
          ids.map(async (id) => {
            try {
              return await getProduct(id)
            } catch {
              return null
            }
          }),
        )
        if (!alive) return
        const map: Record<string, ShopProduct> = {}
        for (const row of resolved) {
          if (row) map[row.id] = row
        }
        setProductsById(map)
        if (signedIn) {
          const [addr, cards] = await Promise.all([listAddresses(), listPaymentMethods()])
          if (!alive) return
          setAddresses(addr)
          setPayments(cards)
          setAddressId(addr.find((row) => row.isDefault)?.id ?? addr[0]?.id ?? '')
          setPaymentMethodId(cards.find((row) => row.isDefault)?.id ?? cards[0]?.id ?? '')
        }
      } catch (caught) {
        if (alive) {
          setError(caught instanceof Error ? caught.message : t('account.loadError'))
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [signedIn, t])

  async function handleRemove(id: string) {
    try {
      const cart = await removeCartItem(id)
      setItems(cart.items)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    }
  }

  async function handleCheckout() {
    if (!signedIn) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    if (!addressId || !paymentMethodId) {
      setError(t('cart.needAddressPayment'))
      return
    }
    setPending(true)
    setError('')
    try {
      await checkoutOrder({ addressId, paymentMethodId })
      navigate('/orders')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="checkout-page">
      <Header />

      <main className="checkout-page__main">
        {loading ? <p>{t('account.loading')}</p> : null}
        {error ? <p className="account-form__error">{error}</p> : null}

        {!loading && items.length === 0 ? (
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
        ) : null}

        {!loading && items.length > 0 ? (
          <section className="checkout-filled" aria-labelledby="checkout-title">
            <h1 id="checkout-title">{t('cart.title')}</h1>
            <ul className="account-list">
              {items.map((item) => {
                const product = productsById[item.productId]
                return (
                  <li key={item.id} className="account-list__item">
                    <div>
                      <strong>
                        {product
                          ? lang === 'fa'
                            ? product.nameFa
                            : product.name
                          : item.productId}
                      </strong>
                      <p>
                        {t(`size.${item.size}` as MessageKey)}
                        {item.color
                          ? ` · ${t(`color.${item.color}` as MessageKey)}`
                          : ''}
                        {' · '}×{item.quantity}
                      </p>
                      {product ? <p>{formatMoney(product, lang)}</p> : null}
                    </div>
                    <button type="button" onClick={() => handleRemove(item.id)}>
                      {t('account.remove')}
                    </button>
                  </li>
                )
              })}
            </ul>

            {signedIn ? (
              <div className="checkout-options">
                <label>
                  {t('account.deliveryAddresses')}
                  <select value={addressId} onChange={(e) => setAddressId(e.target.value)}>
                    {addresses.length === 0 ? (
                      <option value="">{t('account.noAddresses')}</option>
                    ) : (
                      addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.fullName} — {address.city}
                        </option>
                      ))
                    )}
                  </select>
                </label>
                {addresses.length === 0 ? (
                  <Link to="/addresses/new">{t('account.addAddress')}</Link>
                ) : null}
                <label>
                  {t('account.payments')}
                  <select
                    value={paymentMethodId}
                    onChange={(e) => setPaymentMethodId(e.target.value)}
                  >
                    {payments.length === 0 ? (
                      <option value="">{t('account.noPayments')}</option>
                    ) : (
                      payments.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.holderName} ····{card.last4}
                        </option>
                      ))
                    )}
                  </select>
                </label>
                {payments.length === 0 ? (
                  <Link to="/payment-methods/new">{t('account.addCard')}</Link>
                ) : null}
              </div>
            ) : (
              <p>
                <Link to="/login" state={{ from: '/checkout' }}>
                  {t('header.login')}
                </Link>{' '}
                {t('cart.loginToCheckout')}
              </p>
            )}

            <button
              className="checkout-empty__cta"
              type="button"
              onClick={handleCheckout}
              disabled={pending}
            >
              {pending ? t('account.saving') : t('cart.checkout')}
            </button>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
