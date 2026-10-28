import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { addCartItem, getProduct, type ShopProduct } from '../api/shop'
import { catalog, formatMoney } from '../data/catalog'
import { mergeSizeGuide } from '../data/sizeGuide'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { SparklesIcon } from '../components/icons/SparklesIcon'
import { StarIcon } from '../components/icons/StarIcon'
import { TruckIcon } from '../components/icons/TruckIcon'
import '../styles/pages/ProductPage.css'

const tiers = [
  {
    id: 'standard',
    price: '$165.00',
    name: 'Standard',
    description: 'Ships in this size.',
    popular: false,
  },
  {
    id: 'deluxe',
    price: '$185.00',
    name: 'Deluxe',
    description: 'The size most parents choose.',
    popular: true,
  },
  {
    id: 'premium',
    price: '$205.00',
    name: 'Premium',
    description:
      'A larger cut of the same Kernoon Clothes piece.',
    popular: false,
  },
] as const

type AccordionKey = 'description' | 'care' | 'related' | 'reviews' | 'substitution'

export default function ProductPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const itemId = params.get('item') || catalog[0].id
  const fallback = catalog.find((item) => item.id === itemId) ?? catalog[0]
  const [product, setProduct] = useState<ShopProduct>({
    ...fallback,
    images: [fallback.image],
    stock: 10,
    description: '',
  })
  const [activeImage, setActiveImage] = useState(0)
  const [tier, setTier] = useState<(typeof tiers)[number]['id']>('deluxe')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [guideOpen, setGuideOpen] = useState(false)
  const [open, setOpen] = useState<Record<AccordionKey, boolean>>({
    description: true,
    care: true,
    related: true,
    reviews: true,
    substitution: true,
  })
  const sizeGuide = mergeSizeGuide(product.sizes, product.sizeGuide)

  const album =
    product.images?.filter(Boolean).length
      ? product.images.filter(Boolean)
      : [product.image]
  const titleKey = `product.${product.id}` as MessageKey
  const title =
    lang === 'fa' && product.nameFa
      ? product.nameFa
      : product.name && product.name !== product.id
        ? product.name
        : t(titleKey) === titleKey
          ? product.name || product.id
          : t(titleKey)

  useEffect(() => {
    let alive = true
    getProduct(itemId)
      .then((row) => {
        if (alive) {
          setProduct(row)
          setActiveImage(0)
        }
      })
      .catch(() => {
        /* keep local fallback */
      })
    return () => {
      alive = false
    }
  }, [itemId])

  useEffect(() => {
    document.title = `${title} | ${t('brand.name')}`
  }, [t, title])

  useEffect(() => {
    if (!guideOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setGuideOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [guideOpen])

  function toggle(key: AccordionKey) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleAddToCart() {
    setError('')
    setPending(true)
    try {
      const sizeIndex = tiers.findIndex((item) => item.id === tier)
      const size = product.sizes[sizeIndex] ?? product.sizes[0]
      await addCartItem({
        productId: product.id,
        size,
        tier,
        quantity: 1,
      })
      navigate('/cart')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('account.saveError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="product-page">
      <Header />

      <main className="product-page__main">
        <div className="product-page__frame">
          <nav className="product-breadcrumb" aria-label="Breadcrumb">
            <Link to="/home">{t('brand.home')}</Link>
            <span aria-hidden="true">›</span>
            <Link to={`/${product.category}`}>{t(`nav.${product.category}` as MessageKey)}</Link>
            <span aria-hidden="true">›</span>
            <span>{title}</span>
          </nav>

          <section className="product-hero">
            <div className="product-gallery">
              <figure className="product-gallery__main">
                <img src={album[activeImage] || product.image} alt={title} />
              </figure>
              <ul className="product-gallery__thumbs">
                {album.map((src, imageIndex) => (
                  <li key={`${imageIndex}-${src.slice(0, 24)}`}>
                    <button
                      type="button"
                      className={
                        activeImage === imageIndex
                          ? 'product-gallery__thumb is-active'
                          : 'product-gallery__thumb'
                      }
                      onClick={() => setActiveImage(imageIndex)}
                      aria-label={`View image ${imageIndex + 1}`}
                    >
                      <img src={src} alt="" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-buybox">
              <h1>{title}</h1>

              <div className="product-tiers" role="radiogroup" aria-label="Size">
                {tiers.map((option) => (
                  <label
                    key={option.id}
                    className={
                      tier === option.id
                        ? 'product-tier is-selected'
                        : 'product-tier'
                    }
                  >
                    {option.popular ? (
                      <span className="product-tier__badge">
                        <SparklesIcon size={14} />
                        {t('product.badge')}
                      </span>
                    ) : null}
                    <input
                      type="radio"
                      name="tier"
                      value={option.id}
                      checked={tier === option.id}
                      onChange={() => setTier(option.id)}
                    />
                    <span className="product-tier__price">
                      {lang === 'fa'
                        ? `${product.toman.toLocaleString('fa-IR')} تومان`
                        : formatMoney(
                            {
                              id: 'onesie',
                              usd: product.usd,
                              toman: product.toman,
                              image: product.image,
                              category: 'kids',
                              sizes: product.sizes as never,
                            },
                            lang,
                          )}
                    </span>
                    <span className="product-tier__name">
                      {t(
                        `size.${product.sizes[tiers.findIndex((item) => item.id === option.id)] ?? product.sizes[0]}` as MessageKey,
                      )}
                    </span>
                    <span className="product-tier__desc">{t('product.fit')}</span>
                  </label>
                ))}
              </div>

              <button
                className="product-size-guide-btn"
                type="button"
                onClick={() => setGuideOpen(true)}
              >
                {t('product.sizeGuide')}
              </button>

              <p className="product-buybox__prompt">{t('product.how')}</p>
              <div className="product-delivery" role="status">
                <TruckIcon size={22} />
                <span>{t('product.delivery')}</span>
              </div>

              <button
                className="product-order"
                type="button"
                onClick={handleAddToCart}
                disabled={pending}
              >
                {pending ? t('account.saving') : t('product.order')}
              </button>
              {error ? <p className="account-form__error">{error}</p> : null}
              <p className="product-buybox__note">{t('product.note')}</p>
            </div>
          </section>

          <div className="product-accordions">
            <section className="product-accordion">
              <button
                type="button"
                className="product-accordion__header"
                aria-expanded={open.description}
                onClick={() => toggle('description')}
              >
                <span>{t('product.description')}</span>
                <span aria-hidden="true">{open.description ? '−' : '+'}</span>
              </button>
              {open.description ? (
                <div className="product-accordion__body">
                  <p>{product.description || t('product.descriptionBody')}</p>
                </div>
              ) : null}
            </section>

            <section className="product-accordion">
              <button
                type="button"
                className="product-accordion__header"
                aria-expanded={open.care}
                onClick={() => toggle('care')}
              >
                <span>{t('product.care')}</span>
                <span aria-hidden="true">{open.care ? '−' : '+'}</span>
              </button>
              {open.care ? (
                <div className="product-accordion__body">
                  <p>{t('product.descriptionBody')}</p>
                </div>
              ) : null}
            </section>

            <section className="product-accordion">
              <button
                type="button"
                className="product-accordion__header"
                aria-expanded={open.related}
                onClick={() => toggle('related')}
              >
                <span>{t('product.related')}</span>
                <span aria-hidden="true">{open.related ? '−' : '+'}</span>
              </button>
              {open.related ? (
                <div className="product-accordion__body">
                  <ul className="product-related">
                    {catalog
                      .filter((item) => item.id !== product.id)
                      .slice(0, 4)
                      .map((item) => (
                        <li key={item.id}>
                          <Link to={`/product?item=${item.id}`}>
                            <span className="product-related__media">
                              <img src={item.image} alt="" />
                            </span>
                            <span className="product-related__name">
                              {lang === 'fa' ? item.nameFa : item.name}
                            </span>
                            <span className="product-related__price">{formatMoney(item, lang)}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section className="product-accordion">
              <button
                type="button"
                className="product-accordion__header"
                aria-expanded={open.reviews}
                onClick={() => toggle('reviews')}
              >
                <span>{t('product.reviews')}</span>
                <span aria-hidden="true">{open.reviews ? '−' : '+'}</span>
              </button>
              {open.reviews ? (
                <div className="product-accordion__body">
                  <ul className="product-reviews">
                    {(['review.1', 'review.2', 'review.3'] as const).map((key) => (
                      <li key={key}>
                        <p className="product-reviews__stars" aria-label={t('home.stars')}>
                          {Array.from({ length: 5 }, (_, index) => (
                            <StarIcon key={index} size={14} />
                          ))}
                        </p>
                        <p>{t(key)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section className="product-accordion">
              <button
                type="button"
                className="product-accordion__header"
                aria-expanded={open.substitution}
                onClick={() => toggle('substitution')}
              >
                <span>{t('product.returns')}</span>
                <span aria-hidden="true">{open.substitution ? '−' : '+'}</span>
              </button>
              {open.substitution ? (
                <div className="product-accordion__body product-policy">
                  <p>{t('faq.3.a')}</p>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        <section className="product-support" aria-labelledby="support-title">
          <img
            src="/clothes/cardigan.svg"
            alt=""
          />
          <div className="product-support__copy">
            <h2 id="support-title">{t('product.supportTitle')}</h2>
            <p>{t('product.supportBody')}</p>
            <Link className="product-support__button" to="/newborn">
              {t('product.supportCta')}
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {guideOpen ? (
        <div
          className="size-guide-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          onClick={() => setGuideOpen(false)}
        >
          <div
            className="size-guide-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="size-guide-modal__header">
              <h2 id="size-guide-title">{t('product.sizeGuideTitle')}</h2>
              <button
                className="size-guide-modal__close"
                type="button"
                onClick={() => setGuideOpen(false)}
                aria-label={t('product.sizeGuideClose')}
              >
                ×
              </button>
            </header>
            <p className="size-guide-modal__lead">
              {t('product.sizeGuideLead', { name: title })}
            </p>
            <div className="size-guide-modal__table-wrap">
              <table className="size-guide-modal__table">
                <thead>
                  <tr>
                    <th>{t('product.guideSize')}</th>
                    <th>{t('product.guideHeight')}</th>
                    <th>{t('product.guideChest')}</th>
                    <th>{t('product.guideWaist')}</th>
                    <th>{t('product.guideNote')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.map((row) => (
                    <tr key={row.size}>
                      <td>{t(`size.${row.size}` as MessageKey)}</td>
                      <td>{row.heightCm}</td>
                      <td>{row.chestCm}</td>
                      <td>{row.waistCm}</td>
                      <td>{row.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="size-guide-modal__foot">{t('product.sizeGuideFoot')}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
