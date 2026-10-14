import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { StoreIcon } from '../components/icons/StoreIcon'
import { catalog, formatMoney, sizeIds, type Category, type SizeId } from '../data/catalog'
import { useI18n } from '../i18n/LanguageProvider'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/HomePage.css'
import '../styles/pages/ShopMenuPage.css'

type ShopKind = Category | 'sizes'

const kindByPath: Record<string, ShopKind> = {
  '/newborn': 'newborn',
  '/toddler': 'toddler',
  '/kids': 'kids',
  '/sleepwear': 'sleepwear',
  '/outerwear': 'outerwear',
  '/sizes': 'sizes',
  '/flowers': 'newborn',
  '/same-day': 'toddler',
  '/next-day': 'kids',
  '/occasions': 'sleepwear',
  '/sympathy': 'outerwear',
  '/city': 'sizes',
}

type ShopMenuPageProps = {
  kind?: ShopKind
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

  const titleKey = `shop.${resolvedKind}.title` as MessageKey
  const leadKey = `shop.${resolvedKind}.lead` as MessageKey

  useEffect(() => {
    document.title = `${t(titleKey)} | ${t('brand.name')}`
  }, [t, titleKey])

  const matchingSizes = sizeIds.filter((id) =>
    t(`size.${id}`).toLowerCase().includes(query.trim().toLowerCase()),
  )

  const visibleProducts = catalog.filter((product) => {
    if (resolvedKind === 'sizes') return size ? product.sizes.includes(size) : true
    return product.category === resolvedKind
  })

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
            {resolvedKind === 'sizes' && size ? t('shop.inSize', { size: t(`size.${size}`) }) : t('shop.results')}
          </h2>
          <ul>
            {visibleProducts.map((product) => (
              <li key={product.id}>
                <Link to={`/product?item=${product.id}`}>
                  <img src={product.image} alt="" />
                  <span className="home-products__name">{t(`product.${product.id}`)}</span>
                  <span className="home-products__price">{formatMoney(product, lang)}</span>
                  <span className="home-products__florist">
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
