import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { HospitalIcon } from '../components/icons/HospitalIcon'
import { LocationPinIcon } from '../components/icons/LocationPinIcon'
import { MapIcon } from '../components/icons/MapIcon'
import { RingsIcon } from '../components/icons/RingsIcon'
import { SparklesIcon } from '../components/icons/SparklesIcon'
import { StarIcon } from '../components/icons/StarIcon'
import { TombstoneIcon } from '../components/icons/TombstoneIcon'
import { TruckIcon } from '../components/icons/TruckIcon'
import '../styles/pages/ProductPage.css'

const galleryImages = [
  { src: '/product/main.jpg', alt: 'Pink Combo floral arrangement in a white vase' },
  { src: '/product/thumb-1.jpg', alt: 'Pink Combo arrangement front view' },
  { src: '/product/thumb-2.jpg', alt: 'Pink Combo arrangement alternate angle' },
  { src: '/product/thumb-3.jpg', alt: 'Close-up of pink orchids and roses' },
]

const tiers = [
  {
    id: 'standard',
    price: '$165.00',
    name: 'Standard',
    description: 'Your bouquet will be delivered approximately as pictured.',
  },
  {
    id: 'deluxe',
    price: '$185.00',
    name: 'Deluxe',
    description: 'Additional flowers will be added to enhance the bouquet.',
    popular: true,
  },
  {
    id: 'premium',
    price: '$205.00',
    name: 'Premium',
    description:
      'We will add more blooms and select the highest quality flowers we offer in this style.',
  },
] as const

const storeHours = [
  { day: 'Monday', hours: '6:30 AM - 3:59 PM' },
  { day: 'Tuesday', hours: '6:30 AM - 5 PM' },
  { day: 'Wednesday', hours: '6:30 AM - 5 PM' },
  { day: 'Thursday', hours: '6:30 AM - 5 PM' },
  { day: 'Friday', hours: '6:30 AM - 5 PM' },
  { day: 'Saturday', hours: '6:30 AM - 3 PM' },
  { day: 'Sunday', hours: 'Closed' },
]

const relatedProducts = [
  {
    name: 'True Love - Editor’s Choice',
    price: '$185.00',
    image: '/product/related-1.jpg',
    editorsChoice: true,
  },
  { name: 'I Love You More', price: '$145.00', image: '/product/related-2.jpg' },
  { name: 'Cutest Pink', price: '$165.00', image: '/product/related-3.jpg' },
  { name: 'Victory Garden', price: '$170.00', image: '/product/related-4.jpg' },
]

const reviews = [
  { name: 'Andy A.', date: 'March 06, 2024', text: 'Excellent service' },
  {
    name: 'Ana F.',
    date: 'July 31, 2022',
    text: 'They are beautiful! My daughter loved her flowers!',
  },
  {
    name: 'Vinny T.',
    date: 'June 03, 2021',
    text: 'Great delivery. Helped redirect with no issues!!!',
  },
]

const featuredCities = [
  'City Industry',
  'Van Nuys',
  'Santa Monica',
  'Pasadena',
  'Los Angeles',
]

const servedAreas =
  'North Hollywood, Glendale, Burbank, Sherman Oaks, Studio City, Hollywood, West Hollywood, Beverly Hills, Culver City, Venice, Santa Monica, Marina del Rey, Torrance, Redondo Beach, Long Beach, Pasadena, Alhambra, Monterey Park, Downtown Los Angeles, Koreatown, Echo Park, Silver Lake, Los Feliz, Mid-Wilshire, Westwood, Brentwood, Pacific Palisades, Encino, Tarzana, Woodland Hills, and surrounding neighborhoods.'

const hospitals = [
  { name: "Children's Hospital Los Angeles", href: '#' },
  { name: 'Cedars-Sinai Medical Center', href: null },
  { name: 'Kaiser Permanente', href: null },
  { name: 'Ronald Reagan UCLA Medical Center', href: null },
  { name: 'Keck Hospital of USC', href: null },
  { name: 'Good Samaritan Hospital', href: null },
]

const cemeteries = [
  { name: 'Rose Hills Mortuary', href: '#' },
  { name: 'Hollywood Forever Cemetery', href: '#' },
  { name: 'Forest Lawn', href: null },
  { name: 'Holy Cross Cemetery', href: null },
  { name: 'Pierce Brothers Westwood Village Memorial Park', href: null },
]

const weddingVenues = [
  { name: 'The Westin Bonaventure Hotel & Suites, Los Angeles', href: '#' },
  { name: 'InterContinental Los Angeles Downtown', href: null },
  { name: 'JW Marriott Los Angeles L.A. LIVE', href: null },
  { name: 'The Wiltern', href: null },
  { name: 'Beverly Wilshire, A Four Seasons Hotel', href: null },
]

const otherVenues =
  'Crypto.com Arena, Kia Forum, Los Angeles Convention Center, The Belasco, Hollywood Hotel, YMCA, St. Monica Catholic Church, Temple Isaiah, Wilshire Boulevard Temple, and many more local venues across Los Angeles.'

type AccordionKey =
  | 'description'
  | 'florist'
  | 'related'
  | 'reviews'
  | 'substitution'
  | 'locations'

function linkList(
  items: { name: string; href: string | null }[],
  prefix: string,
) {
  return (
    <p>
      {prefix}{' '}
      {items.map((item, index) => (
        <span key={item.name}>
          {item.href ? <a href={item.href}>{item.name}</a> : item.name}
          {index < items.length - 1 ? ', ' : '.'}
        </span>
      ))}
    </p>
  )
}

export default function ProductPage() {
  const [activeImage, setActiveImage] = useState(0)
  const [tier, setTier] = useState<(typeof tiers)[number]['id']>('deluxe')
  const [open, setOpen] = useState<Record<AccordionKey, boolean>>({
    description: true,
    florist: true,
    related: true,
    reviews: true,
    substitution: true,
    locations: true,
  })

  useEffect(() => {
    document.title = "Pink Combo - H&A Floral Design | BloomNation"
  }, [])

  function toggle(key: AccordionKey) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="product-page">
      <Header userName="hadi" />

      <main className="product-page__main">
        <div className="product-page__frame">
          <nav className="product-breadcrumb" aria-label="Breadcrumb">
            <Link to="/home">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/city">Los Angeles, CA</Link>
            <span aria-hidden="true">›</span>
            <Link to="/florist">H&amp;A Floral Design</Link>
            <span aria-hidden="true">›</span>
            <span>Pink Combo - H&amp;A Floral Design (Editor&apos;s Choice)</span>
          </nav>

          <section className="product-hero">
            <div className="product-gallery">
              <figure className="product-gallery__main">
                <img
                  src={galleryImages[activeImage]?.src ?? galleryImages[0].src}
                  alt={galleryImages[activeImage]?.alt ?? galleryImages[0].alt}
                />
              </figure>
              <ul className="product-gallery__thumbs">
                {galleryImages.slice(1).map((image, index) => {
                  const imageIndex = index + 1
                  return (
                    <li key={image.src}>
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
                        <img src={image.src} alt="" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="product-buybox">
              <h1>Pink Combo - H&amp;A Floral Design (Editor&apos;s Choice)</h1>

              <div className="product-tiers" role="radiogroup" aria-label="Arrangement size">
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
                        Most Popular
                      </span>
                    ) : null}
                    <input
                      type="radio"
                      name="tier"
                      value={option.id}
                      checked={tier === option.id}
                      onChange={() => setTier(option.id)}
                    />
                    <span className="product-tier__price">{option.price}</span>
                    <span className="product-tier__name">{option.name}</span>
                    <span className="product-tier__desc">{option.description}</span>
                  </label>
                ))}
              </div>

              <p className="product-buybox__prompt">How do you want your item?</p>
              <div className="product-delivery" role="status">
                <TruckIcon size={22} />
                <span>Delivery</span>
              </div>

              <button className="product-order" type="button">
                Order Now
              </button>
              <p className="product-buybox__note">
                *All fees included—no hidden costs. Taxes and delivery calculated at checkout.
              </p>
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
                <span>Product Description</span>
                <span aria-hidden="true">{open.description ? '−' : '+'}</span>
              </button>
              {open.description ? (
                <div className="product-accordion__body">
                  <p>Soft pinks Roses, Cymbidiums Orchids, Hydrangeas and Tulips.</p>
                </div>
              ) : null}
            </section>

            <section className="product-accordion">
              <button
                type="button"
                className="product-accordion__header"
                aria-expanded={open.florist}
                onClick={() => toggle('florist')}
              >
                <span>Designed and Handcrafted By</span>
                <span aria-hidden="true">{open.florist ? '−' : '+'}</span>
              </button>
              {open.florist ? (
                <div className="product-accordion__body product-florist">
                  <div className="product-florist__shop">
                    <img src="/product/florist.jpg" alt="" />
                    <div>
                      <p className="product-florist__name">H&amp;A Floral Design</p>
                      <p className="product-florist__owner">Horacio Cedillo, Owner</p>
                      <Link className="product-florist__browse" to="/florist">
                        Browse store
                      </Link>
                    </div>
                  </div>
                  <div className="product-florist__hours">
                    <p className="product-florist__hours-title">Store Hours</p>
                    <ul>
                      {storeHours.map((row) => (
                        <li key={row.day}>
                          <span>{row.day}</span>
                          <span>{row.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                <span>Other Designs by H&amp;A Floral Design</span>
                <span aria-hidden="true">{open.related ? '−' : '+'}</span>
              </button>
              {open.related ? (
                <div className="product-accordion__body">
                  <ul className="product-related">
                    {relatedProducts.map((product) => (
                      <li key={product.name}>
                        <Link to="/product">
                          <span className="product-related__media">
                            <img src={product.image} alt="" />
                            {product.editorsChoice ? (
                              <span className="product-related__badge">Editor&apos;s Choice</span>
                            ) : null}
                          </span>
                          <span className="product-related__name">{product.name}</span>
                          <span className="product-related__price">{product.price}</span>
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
                <span>Top Verified Reviews</span>
                <span aria-hidden="true">{open.reviews ? '−' : '+'}</span>
              </button>
              {open.reviews ? (
                <div className="product-accordion__body">
                  <ul className="product-reviews">
                    {reviews.map((review) => (
                      <li key={`${review.name}-${review.date}`}>
                        <p className="product-reviews__meta">
                          <strong>{review.name}</strong>
                          <span aria-hidden="true">|</span>
                          <span>{review.date}</span>
                        </p>
                        <p className="product-reviews__stars" aria-label="5 out of 5 stars">
                          {Array.from({ length: 5 }, (_, index) => (
                            <StarIcon key={index} size={14} />
                          ))}
                        </p>
                        <p>{review.text}</p>
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
                <span>Substitution Policy</span>
                <span aria-hidden="true">{open.substitution ? '−' : '+'}</span>
              </button>
              {open.substitution ? (
                <div className="product-accordion__body product-policy">
                  <p>
                    Photos are examples of an overall theme and may include a one-of-a-kind vase that
                    cannot be exactly replicated.
                  </p>
                  <p>
                    While the bouquet might not look exactly as pictured, the temperament will. Due to
                    weather, seasonality, and market conditions, substitutions of flowers or containers
                    may occur. We preserve the style, theme, and color scheme of the arrangement, using
                    flowers and containers of equal or higher value.
                  </p>
                  <p>
                    To request specific design elements, include them in the florist instructions at
                    checkout or contact the shop to confirm availability.
                  </p>
                </div>
              ) : null}
            </section>

            <section className="product-accordion">
              <button
                type="button"
                className="product-accordion__header"
                aria-expanded={open.locations}
                onClick={() => toggle('locations')}
              >
                <span>H&amp;A Floral Design Delivery Locations</span>
                <span aria-hidden="true">{open.locations ? '−' : '+'}</span>
              </button>
              {open.locations ? (
                <div className="product-accordion__body product-locations">
                  <div className="product-locations__block">
                    <h3>
                      <MapIcon size={16} />
                      Neighborhoods, Cities, ZIP Codes
                    </h3>
                    <p>
                      H&amp;A Floral Design proudly serves{' '}
                      {featuredCities.map((city, index) => (
                        <span key={city}>
                          <a href="#">{city}</a>
                          {index < featuredCities.length - 1 ? ', ' : '. '}
                        </span>
                      ))}
                      {servedAreas}
                    </p>
                  </div>

                  <div className="product-locations__block">
                    <h3>
                      <HospitalIcon size={18} />
                      Local Hospitals
                    </h3>
                    {linkList(hospitals, 'Hospitals we deliver to:')}
                  </div>

                  <div className="product-locations__block">
                    <h3>
                      <TombstoneIcon size={16} />
                      Local Cemeteries &amp; Funeral Homes
                    </h3>
                    {linkList(cemeteries, 'Cemeteries & Funeral Homes we deliver to:')}
                  </div>

                  <div className="product-locations__block">
                    <h3>
                      <RingsIcon size={18} />
                      Wedding Venues We Deliver To
                    </h3>
                    {linkList(weddingVenues, 'Wedding venues we deliver to:')}
                  </div>

                  <div className="product-locations__block">
                    <h3>
                      <LocationPinIcon size={14} />
                      Other Venues We Deliver To
                    </h3>
                    <p>Other venues we deliver to: {otherVenues}</p>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        <section className="product-support" aria-labelledby="support-title">
          <img
            src="/product/support-local.jpg"
            alt="Local florists in their studio with fresh flowers"
          />
          <div className="product-support__copy">
            <h2 id="support-title">
              Support Local.
              <br />
              Celebrate Craft.
            </h2>
            <p>
              Every arrangement is a unique creation by local florists. When you order with
              BloomNation, you&apos;re choosing fresh, hand-designed blooms that showcase the craft
              and passion of your neighborhood experts—delivered with care and precision.
            </p>
            <Link className="product-support__button" to="/florist">
              Best of Local
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
