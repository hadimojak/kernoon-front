import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { StoreIcon } from '../components/icons/StoreIcon'
import './HomePage.css'
import './ShopMenuPage.css'

const products = [
  { name: 'Peaceful in white', price: '$79.95', image: '/home/product-1.jpg' },
  { name: 'Bright and Beautiful', price: '$64.95', image: '/home/product-2.jpg' },
  { name: '6 low and lush roses peach tones', price: '$57.95', image: '/home/product-3.jpg' },
  { name: 'Beautiful Boho', price: '$110.95', image: '/home/product-4.jpg' },
  { name: '6 Low and Lush Roses', price: '$57.95', image: '/home/product-5.jpg' },
  { name: 'Three Rose Budvase', price: '$34.95', image: '/home/product-6.jpg' },
  { name: 'Whoopsie Daisy', price: '$69.95', image: '/home/product-7.jpg' },
  { name: 'Happy in a vase', price: '$64.95', image: '/home/product-8.jpg' },
]

const occasions = [
  { label: 'Birthday', image: '/home/occasion-2.jpg' },
  { label: 'Sympathy', image: '/home/occasion-3.jpg', to: '/sympathy' },
  { label: 'Anniversary', image: '/home/occasion-4.jpg' },
  { label: 'Get Well', image: '/home/occasion-5.jpg' },
  { label: 'Just Because', image: '/home/occasion-6.jpg' },
  { label: 'Same-Day', image: '/home/occasion-1.jpg', to: '/same-day' },
]

const cities = [
  'Los Angeles, CA',
  'Santa Monica, CA',
  'San Francisco, CA',
  'New York, NY',
  'Brooklyn, NY',
  'Chicago, IL',
  'Austin, TX',
  'Miami, FL',
  'Seattle, WA',
  'Boston, MA',
]

const copy = {
  flowers: {
    title: 'Flowers',
    lead: 'Handcrafted bouquets from local florists, ready to send.',
  },
  'same-day': {
    title: 'Same-Day Delivery',
    lead: 'Order by the afternoon and a local florist can deliver today in most cities.',
  },
  'next-day': {
    title: 'Next-Day Delivery',
    lead: 'Schedule a bouquet for tomorrow, designed and delivered by a florist near them.',
  },
  occasions: {
    title: 'Occasions',
    lead: 'Find an arrangement for the moment, from birthdays to just because.',
  },
  sympathy: {
    title: 'Sympathy',
    lead: 'Standing sprays, baskets, and peaceful bouquets for funerals and remembrance.',
  },
  city: {
    title: 'Shop by City',
    lead: 'Choose a city to see arrangements from florists who deliver there.',
  },
} as const

export type ShopKind = keyof typeof copy

type ShopMenuPageProps = {
  kind: ShopKind
}

const kindByPath: Record<string, ShopKind> = {
  '/flowers': 'flowers',
  '/same-day': 'same-day',
  '/next-day': 'next-day',
  '/occasions': 'occasions',
  '/sympathy': 'sympathy',
  '/city': 'city',
}

export default function ShopMenuPage({ kind }: ShopMenuPageProps) {
  const { pathname } = useLocation()
  const resolvedKind = kindByPath[pathname] ?? kind
  const page = copy[resolvedKind]
  const [params, setParams] = useSearchParams()
  const [cityQuery, setCityQuery] = useState('')
  const [city, setCity] = useState<string | null>(null)
  const occasion = params.get('occasion')

  useEffect(() => {
    document.title = `${page.title} | BloomNation`
  }, [page.title])

  const visibleProducts = useMemo(() => {
    if (resolvedKind === 'sympathy') return products.filter((_, index) => index % 2 === 0)
    if (resolvedKind === 'occasions' && occasion) {
      const start = occasion.length % products.length
      return [...products.slice(start), ...products.slice(0, start)].slice(0, 4)
    }
    return products
  }, [resolvedKind, occasion])

  const matchingCities = cities.filter((name) =>
    name.toLowerCase().includes(cityQuery.trim().toLowerCase()),
  )

  function selectOccasion(label: string) {
    setParams({ occasion: label })
  }

  function selectCity(name: string) {
    setCity(name)
  }

  function handleCitySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const match =
      cities.find((name) => name.toLowerCase() === cityQuery.trim().toLowerCase()) ??
      matchingCities[0]
    if (match) selectCity(match)
  }

  return (
    <div className="shop-page">
      <Header />

      <main>
        <header className="shop-page__intro">
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </header>

        {resolvedKind === 'occasions' ? (
          <section className="home-occasions" aria-label="Shop by occasion">
            <ul>
              {occasions.map((item) =>
                item.to ? (
                  <li key={item.label}>
                    <Link to={item.to}>
                      <img src={item.image} alt="" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ) : (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={occasion === item.label ? 'is-selected' : undefined}
                      onClick={() => selectOccasion(item.label)}
                    >
                      <img src={item.image} alt="" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          </section>
        ) : null}

        {resolvedKind === 'city' ? (
          <section className="shop-cities" aria-label="Cities">
            <form className="shop-cities__search" onSubmit={handleCitySearch}>
              <label>
                <span className="sr-only">City</span>
                <input
                  value={cityQuery}
                  onChange={(event) => setCityQuery(event.target.value)}
                  placeholder="Search a city"
                />
              </label>
              <button type="submit">Search</button>
            </form>
            <ul>
              {matchingCities.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    className={city === name ? 'is-selected' : undefined}
                    onClick={() => selectCity(name)}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
            {matchingCities.length === 0 ? <p>No cities match that search.</p> : null}
          </section>
        ) : null}

        {resolvedKind !== 'city' || city ? (
          <section className="home-products" aria-labelledby="shop-results-title">
            <h2 id="shop-results-title">
              {resolvedKind === 'city' && city
                ? `Florists in ${city}`
                : resolvedKind === 'occasions' && occasion
                  ? `${occasion} flowers`
                  : 'Arrangements'}
            </h2>
            <ul>
              {visibleProducts.map((product) => (
                <li key={product.name}>
                  <Link to="/product">
                    <img src={product.image} alt="" />
                    <span className="home-products__name">{product.name}</span>
                    <span className="home-products__price">{product.price}</span>
                    <span className="home-products__florist">
                      <StoreIcon />
                      {city ? `Local florist · ${city}` : 'Absolutely Flowers'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
