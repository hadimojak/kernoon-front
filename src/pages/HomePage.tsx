import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { FacebookIcon } from '../components/icons/FacebookIcon'
import { InstagramIcon } from '../components/icons/InstagramIcon'
import { LinkedInIcon } from '../components/icons/LinkedInIcon'
import { PinterestIcon } from '../components/icons/PinterestIcon'
import { StarIcon } from '../components/icons/StarIcon'
import { StoreIcon } from '../components/icons/StoreIcon'
import { XIcon } from '../components/icons/XIcon'
import { YouTubeIcon } from '../components/icons/YouTubeIcon'
import { catalog, formatMoney } from '../data/catalog'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/HomePage.css'

const categories: { key: MessageKey; image: string; to: string }[] = [
  { key: 'nav.all', image: '/clothes/hero.svg', to: '/all' },
  { key: 'nav.newborn', image: '/clothes/onesie.svg', to: '/newborn' },
  { key: 'nav.toddler', image: '/clothes/tee.svg', to: '/toddler' },
  { key: 'nav.kids', image: '/clothes/hoodie.svg', to: '/kids' },
  { key: 'nav.sleepwear', image: '/clothes/sleep.svg', to: '/sleepwear' },
  { key: 'nav.outerwear', image: '/clothes/cardigan.svg', to: '/outerwear' },
  { key: 'nav.sizes', image: '/clothes/overalls.svg', to: '/sizes' },
]

const reviewKeys = ['review.1', 'review.2', 'review.3'] as const
const reviewNames = ['Sara M.', 'Nila R.', 'Omid K.']
const faqKeys = ['faq.1', 'faq.2', 'faq.3', 'faq.4'] as const

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'X', href: 'https://x.com', Icon: XIcon },
  { label: 'Pinterest', href: 'https://pinterest.com', Icon: PinterestIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTubeIcon },
]

const instagramPosts = [
  '/clothes/onesie.svg',
  '/clothes/tee.svg',
  '/clothes/dress.svg',
  '/clothes/hoodie.svg',
  '/clothes/sleep.svg',
]

export default function HomePage() {
  const { t, lang } = useI18n()

  useEffect(() => {
    document.title = t('home.title')
  }, [t])

  return (
    <div className="home">
      <Header />

      <main>
        <div className="home-frame">
          <section className="home-hero" aria-labelledby="hero-title">
            <div className="home-hero__copy">
              <h1 id="hero-title">{t('home.heroTitle')}</h1>
              <p>{t('home.heroLead')}</p>
              <Link className="home-button" to="/newborn">
                {t('home.heroCta')}
              </Link>
            </div>
            <img src="/clothes/hero.svg" alt={t('home.heroAlt')} />
          </section>

          <section className="home-press" aria-label={t('home.press')}>
            <p>{t('home.press')}</p>
            <ul>
              <li className="home-press__forbes">Forbes</li>
              <li className="home-press__time">TIME</li>
              <li className="home-press__nyt">The New York Times</li>
              <li className="home-press__hgtv">
                <span aria-hidden="true">⌂</span> HGTV
              </li>
              <li className="home-press__today">TODAY</li>
              <li className="home-press__vogue">VOGUE</li>
            </ul>
          </section>

          <section className="home-split">
            <img src="/clothes/onesie.svg" alt="" />
            <div className="home-split__copy">
              <h2>{t('home.split1Title')}</h2>
              <p>{t('home.split1Body')}</p>
              <Link className="home-button" to="/toddler">
                {t('home.split1Cta')}
              </Link>
            </div>
          </section>

          <section className="home-split home-split--flip">
            <img src="/clothes/overalls.svg" alt="" />
            <div className="home-split__copy">
              <h2>{t('home.split2Title')}</h2>
              <p>{t('home.split2Body')}</p>
              <Link className="home-button" to="/kids">
                {t('home.split2Cta')}
              </Link>
            </div>
          </section>

          <section className="home-split">
            <img src="/clothes/sleep.svg" alt="" />
            <div className="home-split__copy">
              <h2>{t('home.split3Title')}</h2>
              <p>{t('home.split3Body')}</p>
              <Link className="home-button" to="/sleepwear">
                {t('home.split3Cta')}
              </Link>
            </div>
          </section>
        </div>

        <section className="home-products" aria-labelledby="shop-clothes-title">
          <h2 id="shop-clothes-title">{t('home.productsTitle')}</h2>
          <ul>
            {catalog.map((product) => (
              <li key={product.id}>
                <Link to={`/product?item=${product.id}`}>
                  <img src={product.image} alt="" />
                  <span className="home-products__name">
                    {lang === 'fa' ? product.nameFa : product.name}
                  </span>
                  <span className="home-products__price">{formatMoney(product, lang)}</span>
                  <span className="home-products__brand">
                    <StoreIcon />
                    {t('product.brand')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-categories" aria-labelledby="categories-title">
          <h2 id="categories-title">{t('home.categoriesTitle')}</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.key}>
                <Link to={category.to}>
                  <img src={category.image} alt="" />
                  <span>{t(category.key)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-reviews" aria-labelledby="reviews-title">
          <h2 id="reviews-title">{t('home.reviewsTitle')}</h2>
          <ul>
            {reviewKeys.map((key, index) => (
              <li key={key}>
                <img src={catalog[index].image} alt="" />
                <blockquote>“{t(key)}”</blockquote>
                <p className="home-reviews__name">{reviewNames[index]}</p>
                <p className="home-reviews__buyer">{t('home.verified')}</p>
                <p className="home-reviews__stars" aria-label={t('home.stars')}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon key={index} />
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-follow" aria-labelledby="follow-title">
          <div className="home-follow__intro">
            <h2 id="follow-title">{t('home.follow')}</h2>
            <p>#{t('brand.name')}</p>
            <ul>
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                    <Icon size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ul className="home-follow__posts">
            {instagramPosts.map((image) => (
              <li key={image}>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <img src={image} alt="" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-info" aria-labelledby="faq-title">
          <div className="home-info__inner">
            <h2 id="faq-title">{t('home.faqTitle')}</h2>
            <div className="home-faq">
              {faqKeys.map((key) => (
                <article key={key}>
                  <h3>{t(`${key}.q`)}</h3>
                  <p>{t(`${key}.a`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
