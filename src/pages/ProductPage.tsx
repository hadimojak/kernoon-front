import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  addCartItem,
  getProduct,
  listProducts,
  type ShopProduct,
} from '../api/shop'
import {
  clothingColorHex,
  formatMoney,
  type ClothingColorId,
} from '../data/catalog'
import { mergeSizeGuide } from '../data/sizeGuide'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { StarIcon } from '../components/icons/StarIcon'
import { TruckIcon } from '../components/icons/TruckIcon'
import '../styles/pages/ProductPage.css'

type AccordionKey = 'description' | 'care' | 'related' | 'reviews' | 'substitution'

export default function ProductPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const itemId = params.get('item') || ''
  const [product, setProduct] = useState<ShopProduct | null>(null)
  const [related, setRelated] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
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

  const sizeGuide = mergeSizeGuide(product?.sizes ?? [], product?.sizeGuide)
  const colors = product?.colors?.filter(Boolean) ?? []
  const album =
    product?.images?.filter(Boolean).length
      ? product.images.filter(Boolean)
      : product
        ? [product.image]
        : []
  const title = product
    ? lang === 'fa' && product.nameFa
      ? product.nameFa
      : product.name || product.id
    : ''

  useEffect(() => {
    let alive = true
    if (!itemId) {
      setProduct(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    getProduct(itemId)
      .then((row) => {
        if (!alive) return
        setProduct(row)
        setActiveImage(0)
        setSelectedSize(row.sizes[0] ?? '')
        setSelectedColor(row.colors?.[0] ?? '')
      })
      .catch((caught) => {
        if (!alive) return
        setProduct(null)
        setError(caught instanceof Error ? caught.message : t('account.loadError'))
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [itemId, t])

  useEffect(() => {
    if (!product) {
      setRelated([])
      return
    }
    let alive = true
    listProducts(product.category)
      .then((rows) => {
        if (!alive) return
        setRelated(rows.filter((row) => row.id !== product.id).slice(0, 4))
      })
      .catch(() => {
        if (alive) setRelated([])
      })
    return () => {
      alive = false
    }
  }, [product])

  useEffect(() => {
    document.title = title
      ? `${title} | ${t('brand.name')}`
      : `${t('product.missing')} | ${t('brand.name')}`
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
    if (!product || !selectedSize) return
    if (colors.length > 1 && !selectedColor) {
      setError(t('product.colorRequired'))
      return
    }
    setError('')
    setPending(true)
    try {
      await addCartItem({
        productId: product.id,
        size: selectedSize,
        tier: 'standard',
        color: selectedColor || undefined,
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
          {loading ? <p>{t('account.loading')}</p> : null}
          {!loading && !product ? (
            <p className="account-form__error">{error || t('product.missing')}</p>
          ) : null}

          {!loading && product ? (
            <>
              <nav className="product-breadcrumb" aria-label="Breadcrumb">
                <Link to="/home">{t('brand.home')}</Link>
                <span aria-hidden="true">›</span>
                <Link to={`/${product.category}`}>
                  {t(`nav.${product.category}` as MessageKey)}
                </Link>
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
                  <p className="product-buybox__price">{formatMoney(product, lang)}</p>
                  <p className="product-buybox__meta">
                    <span>
                      {t('product.country')}: {product.countryOfOrigin || '—'}
                    </span>
                  </p>

                  <div className="product-sizes" role="radiogroup" aria-label={t('product.chooseSize')}>
                    <p className="product-buybox__label">{t('product.chooseSize')}</p>
                    <div className="product-sizes__list">
                      {product.sizes.map((size) => (
                        <label
                          key={size}
                          className={
                            selectedSize === size
                              ? 'product-size is-selected'
                              : 'product-size'
                          }
                        >
                          <input
                            type="radio"
                            name="size"
                            value={size}
                            checked={selectedSize === size}
                            onChange={() => setSelectedSize(size)}
                          />
                          <span>{t(`size.${size}` as MessageKey)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {colors.length > 0 ? (
                    <div
                      className="product-colors"
                      role="radiogroup"
                      aria-label={t('product.chooseColor')}
                    >
                      <p className="product-buybox__label">{t('product.chooseColor')}</p>
                      <div className="product-colors__list">
                        {colors.map((color) => {
                          const hex =
                            clothingColorHex[color as ClothingColorId] ?? '#ccc'
                          return (
                            <label
                              key={color}
                              className={
                                selectedColor === color
                                  ? 'product-color is-selected'
                                  : 'product-color'
                              }
                              title={t(`color.${color}` as MessageKey)}
                            >
                              <input
                                type="radio"
                                name="color"
                                value={color}
                                checked={selectedColor === color}
                                onChange={() => setSelectedColor(color)}
                              />
                              <span
                                className="product-color__swatch"
                                style={{ background: hex }}
                                aria-hidden="true"
                              />
                              <span className="product-color__name">
                                {t(`color.${color}` as MessageKey)}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}

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
                    disabled={pending || !selectedSize}
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
                      <ul className="product-props">
                        <li>
                          <strong>{t('product.country')}</strong>
                          <span>{product.countryOfOrigin || '—'}</span>
                        </li>
                        <li>
                          <strong>{t('product.colors')}</strong>
                          <span>
                            {colors.length
                              ? colors
                                  .map((color) => t(`color.${color}` as MessageKey))
                                  .join(' · ')
                              : '—'}
                          </span>
                        </li>
                      </ul>
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
                      {related.length === 0 ? (
                        <p>{t('product.noRelated')}</p>
                      ) : (
                        <ul className="product-related">
                          {related.map((item) => (
                            <li key={item.id}>
                              <Link to={`/product?item=${item.id}`}>
                                <span className="product-related__media">
                                  <img src={item.image} alt="" />
                                </span>
                                <span className="product-related__name">
                                  {lang === 'fa' ? item.nameFa : item.name}
                                </span>
                                <span className="product-related__price">
                                  {formatMoney(item, lang)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
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
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Footer />

      {guideOpen && product ? (
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
