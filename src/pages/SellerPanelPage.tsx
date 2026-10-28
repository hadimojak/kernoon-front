import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { catalog, formatMoney, type CatalogProduct } from '../data/catalog'
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

type PanelProduct = CatalogProduct & { name?: string }

export default function SellerPanelPage() {
  const { t, lang } = useI18n()
  const [section, setSection] = useState<Section>('dashboard')
  const [products, setProducts] = useState<PanelProduct[]>(catalog)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    document.title = `${t('panel.title')} | ${t('brand.name')}`
  }, [t])

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(price)
    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) return
    setProducts((current) => [
      {
        id: 'onesie',
        name: name.trim(),
        usd: amount,
        toman: Math.round(amount),
        image: '/clothes/onesie.svg',
        category: 'kids',
        sizes: ['2-3'],
      },
      ...current,
    ])
    setName('')
    setPrice('')
    setNotice(t('panel.saved'))
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

        {section === 'dashboard' ? (
          <section className="seller-panel__stats" aria-label={t('panel.dashboard')}>
            <article>
              <span>{t('panel.revenue')}</span>
              <strong>{lang === 'fa' ? '۰ تومان' : '$0.00'}</strong>
            </article>
            <article>
              <span>{t('panel.ordersStat')}</span>
              <strong>0</strong>
            </article>
            <article>
              <span>{t('panel.productsStat')}</span>
              <strong>{products.length}</strong>
            </article>
            <article>
              <span>{t('panel.customersStat')}</span>
              <strong>0</strong>
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
                {t('panel.price')}
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  inputMode="decimal"
                  required
                />
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
                {products.map((product, index) => (
                  <tr key={`${product.name ?? product.id}-${index}`}>
                    <td data-label={t('panel.product')}>
                      <span className="seller-panel__product">
                        <img src={product.image} alt="" />
                        {product.name ?? t(`product.${product.id}`)}
                      </span>
                    </td>
                    <td data-label={t('panel.price')}>{formatMoney(product, lang)}</td>
                    <td data-label={t('panel.category')}>{t(`nav.${product.category}` as MessageKey)}</td>
                    <td data-label={t('panel.status')}>{t('panel.inStock')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {section === 'orders' ? (
          <section className="seller-panel__card">
            <p>{t('panel.emptyOrders')}</p>
          </section>
        ) : null}

        {section === 'customers' ? (
          <section className="seller-panel__card">
            <p>{t('panel.emptyCustomers')}</p>
          </section>
        ) : null}
      </main>
    </div>
  )
}
