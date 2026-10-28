import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { listProducts, type ShopProduct } from '../api/shop'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { StoreIcon } from '../components/icons/StoreIcon'
import { formatMoney, sizeIds, type Category, type SizeId } from '../data/catalog'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/HomePage.css'
import '../styles/pages/ShopMenuPage.css'

type ShopKind = Category | 'sizes' | 'all'

const kindByPath: Record<string, ShopKind> = {
  '/all': 'all',
  '/newborn': 'newborn',
  '/toddler': 'toddler',
  '/kids': 'kids',
  '/sleepwear': 'sleepwear',
  '/outerwear': 'outerwear',
  '/sizes': 'sizes',
}

type ShopMenuPageProps = {
  kind?: ShopKind
}

function moneyOf(product: ShopProduct, lang: 'en' | 'fa') {
  if (lang === 'fa') return `${product.toman.toLocaleString('fa-IR')} تومان`
  return `$${product.usd.toFixed(2)}`
}

export default function ShopMenuPage({ kind = 'newborn' }: ShopMenuPageProps) {
  const { pathname } = useLocation()
  return <ShopScreen key={pathname} kind={kind} />
}

function ShopScreen({ kind = 'newborn' }: ShopMenuPageProps) {
  const { pathname } = useLocation()
  const { t, lang } = useI18n()
  const resolvedKind = kindByPath[pathname] ?? kind
  const [query, setQuery] = useState('')
  const [size, setSize] = useState<SizeId | null>(null)
  const [products, setProducts] = useState<ShopProduct[]>([])

  const titleKey = `shop.${resolvedKind}.title` as MessageKey
  const leadKey = `shop.${resolvedKind}.lead` as MessageKey

  useEffect(() => {
    document.title = `${t(titleKey)} | ${t('brand.name')}`
  }, [t, titleKey])

  useEffect(() => {
    let alive = true
    const category =
      resolvedKind === 'sizes' || resolvedKind === 'all' ? undefined : resolvedKind
    listProducts(category, size ?? undefined)
      .then((rows) => {
        if (alive) setProducts(rows)
      })
      .catch(() => {
        if (alive) setProducts([])
      })
    return () => {
      alive = false
    }
  }, [resolvedKind, size])

  const matchingSizes = sizeIds.filter((id) =>
    t(`size.${id}`).toLowerCase().includes(query.trim().toLowerCase()),
  )

  function selectSize(id: SizeId) {
    setSize(id)
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const match =
      sizeIds.find((id) => t(`size.${id}`).toLowerCase() === query.trim().toLowerCase()) ??
      matchingSizes[0]
    if (match) selectSize(match)
  }

  function productLabel(product: ShopProduct) {
    if (lang === 'fa' && product.nameFa) return product.nameFa
    if (product.name && product.name !== product.id) return product.name
    const key = `product.${product.id}` as MessageKey
    const translated = t(key)
    return translated === key ? product.name || product.id : translated
  }

  return (
    <div className="shop-page">
      <Header />

      <main>
        <header className="shop-page__intro">
          <h1>{t(titleKey)}</h1>
          <p>{t(leadKey)}</p>
        </header>

        {resolvedKind === 'sizes' ? (
          <section className="shop-cities" aria-label={t('shop.sizeLabel')}>
            <form className="shop-cities__search" onSubmit={handleSearch}>
              <label>
                <span className="sr-only">{t('shop.sizeLabel')}</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('shop.searchSize')}
                />
              </label>
              <button type="submit">{t('shop.search')}</button>
            </form>
            <ul>
              {matchingSizes.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    className={size === id ? 'is-selected' : undefined}
                    onClick={() => selectSize(id)}
                  >
                    {t(`size.${id}`)}
                  </button>
                </li>
              ))}
            </ul>
            {matchingSizes.length === 0 ? <p>{t('shop.noSize')}</p> : null}
          </section>
        ) : null}

        <section className="home-products" aria-labelledby="shop-results-title">
          <h2 id="shop-results-title">
            {resolvedKind === 'sizes' && size
              ? t('shop.inSize', { size: t(`size.${size}`) })
              : t('shop.results')}
          </h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <Link to={`/product?item=${product.id}`}>
                  <img src={product.image || product.images?.[0]} alt="" />
                  <span className="home-products__name">{productLabel(product)}</span>
                  <span className="home-products__price">{moneyOf(product, lang)}</span>
                  <span className="home-products__brand">
                    <StoreIcon />
                    {t('product.brand')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
