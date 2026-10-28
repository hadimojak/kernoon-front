import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { BrandMark } from '../components/icons/BrandMark'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/AboutUsPage.css'

const features: { image: string; titleKey: MessageKey; bodyKey: MessageKey }[] = [
  {
    image: '/clothes/onesie.svg',
    titleKey: 'nav.newborn',
    bodyKey: 'shop.newborn.lead',
  },
  {
    image: '/clothes/tee.svg',
    titleKey: 'nav.toddler',
    bodyKey: 'shop.toddler.lead',
  },
  {
    image: '/clothes/hoodie.svg',
    titleKey: 'nav.kids',
    bodyKey: 'shop.kids.lead',
  },
]

export default function AboutUsPage() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = t('about.title')
  }, [t])

  return (
    <div className="about-page">
      <Header />

      <main>
        <section className="about-hero" aria-labelledby="about-welcome">
          <div className="about-hero__copy">
            <h1 id="about-welcome">
              {t('about.hello')}
              <span className="about-hero__brand">
                {t('brand.name')}
                <BrandMark size={28} aria-hidden="true" />
              </span>
            </h1>
            <p>{t('about.body')}</p>
          </div>
          <img className="about-hero__photo" src="/about/hero.jpg" alt="" />
        </section>

        <section className="about-why" aria-labelledby="why-choose">
          <h2 id="why-choose">{t('about.why')}</h2>
          <p>{t('about.whyBody')}</p>

          <ul className="about-features">
            {features.map((feature) => (
              <li key={feature.titleKey}>
                <img src={feature.image} alt="" />
                <h3>{t(feature.titleKey)}</h3>
                <p>{t(feature.bodyKey)}</p>
              </li>
            ))}
          </ul>

          <Link className="about-shop" to="/home">
            {t('about.shop')}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
