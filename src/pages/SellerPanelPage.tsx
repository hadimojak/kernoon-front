import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  addPanelProduct,
  panelCustomers,
  panelDashboard,
  panelOrders,
  panelProducts,
  type PanelCustomer,
  type PanelDashboard,
  type PanelProduct,
} from '../api/panel'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/SellerPanelPage.css'

type Section = 'dashboard' | 'products' | 'orders' | 'customers'

const menu: { id: Section; label: MessageKey }[] = [
  { id: 'dashboard', label: 'panel.dashboard' },
  { id: 'products', label: 'panel.products' },
  { id: 'orders', label: 'panel.orders' },
  { id: 'customers', label: 'panel.customers' },
]

const categories = ['newborn', 'toddler', 'kids', 'sleepwear', 'outerwear'] as const

export default function SellerPanelPage() {
  const { t, lang } = useI18n()
  const [section, setSection] = useState<Section>('dashboard')
  const [stats, setStats] = useState<PanelDashboard | null>(null)
  const [products, setProducts] = useState<PanelProduct[]>([])
  const [customers, setCustomers] = useState<PanelCustomer[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [name, setName] = useState('')
  const [nameFa, setNameFa] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('kids')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = `${t('panel.title')} | ${t('brand.name')}`
  }, [t])

  useEffect(() => {
    let alive = true
    Promise.all([
      panelDashboard(),
      panelProducts(),
      panelCustomers(),
      panelOrders(),
    ])
      .then(([dashboard, listing, shopCustomers, orders]) => {
        if (!alive) return
        setStats(dashboard)
        setProducts(listing)
        setCustomers(shopCustomers)
        setOrderCount(orders.length)
      })
      .catch((caught) => {
        if (alive) {
          setError(caught instanceof Error ? caught.message : t('account.loadError'))
        }
      })
    return () => {
      alive = false
    }
  }, [t])

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(price)
    if (!name.trim() || !Number.isFinite(amount) || amount < 1000) return
    setError('')
    try {
      const created = await addPanelProduct({
        name: name.trim(),
        nameFa: nameFa.trim() || name.trim(),
        toman: Math.round(amount),
        category,
        sizes: ['2-3'],
        stock: 10,
        image: '/clothes/onesie.svg',
      })
      setProducts((current) => [created, ...current])
      setStats((current) =>
        current ? { ...current, products: current.products + 1 } : current,
      )
      setName('')
      setNameFa('')
      setPrice('')
      setNotice(t('panel.saved'))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    }
  }

  return (
    <div className="seller-panel">
      <aside className="seller-panel__nav">
        <p className="seller-panel__brand">{t('panel.title')}</p>
        <nav aria-label={t('panel.title')}>
          {menu.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === section ? 'is-active' : undefined}
              onClick={() => setSection(item.id)}
            >
              {t(item.label)}
            </button>
          ))}
        </nav>
        <Link className="seller-panel__shop" to="/home">
          {t('panel.shop')}
        </Link>
      </aside>

      <main className="seller-panel__main">
        <header className="seller-panel__top">
          <h1>{t(menu.find((item) => item.id === section)?.label ?? 'panel.title')}</h1>
        </header>

        {error ? <p className="account-form__error">{error}</p> : null}

        {section === 'dashboard' ? (
          <section className="seller-panel__stats" aria-label={t('panel.dashboard')}>
            <article>
              <span>{t('panel.revenue')}</span>
              <strong>
                {lang === 'fa'
                  ? `${(stats?.revenueToman ?? 0).toLocaleString('fa-IR')} تومان`
                  : `${(stats?.revenueToman ?? 0).toLocaleString('en-US')} IRR`}
              </strong>
            </article>
            <article>
              <span>{t('panel.ordersStat')}</span>
              <strong>{stats?.orders ?? orderCount}</strong>
            </article>
            <article>
              <span>{t('panel.productsStat')}</span>
              <strong>{stats?.products ?? products.length}</strong>
            </article>
            <article>
              <span>{t('panel.customersStat')}</span>
              <strong>{stats?.customers ?? customers.length}</strong>
            </article>
          </section>
        ) : null}

        {section === 'products' ? (
          <section className="seller-panel__card">
            <form className="seller-panel__add" onSubmit={addProduct}>
              <label>
                {t('panel.name')}
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                {t('panel.nameFa')}
                <input value={nameFa} onChange={(event) => setNameFa(event.target.value)} />
              </label>
              <label>
                {t('panel.price')}
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  inputMode="numeric"
                  required
                />
              </label>
              <label>
                {t('panel.category')}
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as typeof category)}
                >
                  {categories.map((id) => (
                    <option key={id} value={id}>
                      {t(`nav.${id}` as MessageKey)}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">{t('panel.add')}</button>
            </form>
            {notice ? <p className="seller-panel__notice">{notice}</p> : null}
            <table>
              <thead>
                <tr>
                  <th>{t('panel.product')}</th>
                  <th>{t('panel.price')}</th>
                  <th>{t('panel.category')}</th>
                  <th>{t('panel.status')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td data-label={t('panel.product')}>
                      <span className="seller-panel__product">
                        <img src={product.image} alt="" />
                        {lang === 'fa' ? product.nameFa || product.name : product.name}
                      </span>
                    </td>
                    <td data-label={t('panel.price')}>
                      {lang === 'fa'
                        ? `${product.toman.toLocaleString('fa-IR')} تومان`
                        : `${product.toman.toLocaleString('en-US')} IRR`}
                    </td>
                    <td data-label={t('panel.category')}>
                      {t(`nav.${product.category}` as MessageKey)}
                    </td>
                    <td data-label={t('panel.status')}>
                      {product.stock > 0 ? t('panel.inStock') : t('panel.outOfStock')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {section === 'orders' ? (
          <section className="seller-panel__card">
            <p>{orderCount === 0 ? t('panel.emptyOrders') : `${orderCount}`}</p>
          </section>
        ) : null}

        {section === 'customers' ? (
          <section className="seller-panel__card">
            {customers.length === 0 ? (
              <p>{t('panel.emptyCustomers')}</p>
            ) : (
              <ul className="account-list">
                {customers.map((customer) => (
                  <li key={customer.id} className="account-list__item">
                    <div>
                      <strong>{customer.name}</strong>
                      <p>{customer.phone}</p>
                      <p>
                        {customer.province}، {customer.city}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </main>
    </div>
  )
}
