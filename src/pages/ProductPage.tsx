import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { catalog, formatMoney } from '../data/catalog'
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
  const [params] = useSearchParams()
  const product = catalog.find((item) => item.id === params.get('item')) ?? catalog[0]
  const [activeImage, setActiveImage] = useState(0)
  const [tier, setTier] = useState<(typeof tiers)[number]['id']>('deluxe')
  const [open, setOpen] = useState<Record<AccordionKey, boolean>>({
    description: true,
    care: true,
    related: true,
    reviews: true,
    substitution: true,
  })

  useEffect(() => {
    document.title = `${t(`product.${product.id}`)} | ${t('brand.name')}`
  }, [t, product.id])

  function toggle(key: AccordionKey) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="product-page">
      <Header userName="hadi" />

      <main className="product-page__main">
        <div className="product-page__frame">
          <nav className="product-breadcrumb" aria-label="Breadcrumb">
            <Link to="/home">{t('brand.home')}</Link>
            <span aria-hidden="true">›</span>
            <Link to={`/${product.category}`}>{t(`nav.${product.category}`)}</Link>
            <span aria-hidden="true">›</span>
            <span>{t(`product.${product.id}`)}</span>
          </nav>

          <section className="product-hero">
            <div className="product-gallery">
              <figure className="product-gallery__main">
                <img
                  src={product.image}
                  alt={t(`product.${product.id}`)}
                />
              </figure>
              <ul className="product-gallery__thumbs">
                {[1, 2, 3].map((imageIndex) => {
                  return (
                    <li key={imageIndex}>
                      <button
                        type="button"
                        className={
                          activeImage === imageIndex
                            ? 'product-gallery__thumb is-active'
                            : 'product-gallery__thumb'
                        }
                        onClick={() => setActiveImage(imageIndex)}
                        aria-label={`View image ${imageIndex}`}
                      >
                        <img src={product.image} alt="" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="product-buybox">
              <h1>{t(`product.${product.id}`)}</h1>

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
                    <span className="product-tier__price">{formatMoney(product, lang)}</span>
                    <span className="product-tier__name">
                      {t(
                        `size.${product.sizes[tiers.findIndex((item) => item.id === option.id)] ?? product.sizes[0]}` as MessageKey,
                      )}
                    </span>
                    <span className="product-tier__desc">{t('product.fit')}</span>
                  </label>
                ))}
              </div>

              <p className="product-buybox__prompt">{t('product.how')}</p>
              <div className="product-delivery" role="status">
                <TruckIcon size={22} />
                <span>{t('product.delivery')}</span>
              </div>

              <button className="product-order" type="button">
                {t('product.order')}
              </button>
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
                  <p>{t('product.descriptionBody')}</p>
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
                            <span className="product-related__name">{t(`product.${item.id}`)}</span>
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
    </div>
  )
}
