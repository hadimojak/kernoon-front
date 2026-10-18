import { useEffect } from 'react'
import { useI18n } from '../i18n/useI18n'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { BrandMark } from '../components/icons/BrandMark'
import '../styles/pages/AboutUsPage.css'

const features = [
  {
    image: '/clothes/onesie.svg',
    alt: '',
    titleKey: 'nav.newborn' as const,
    bodyKey: 'shop.newborn.lead' as const,
  },
  {
    image: '/clothes/tee.svg',
    alt: '',
    titleKey: 'nav.toddler' as const,
    bodyKey: 'shop.toddler.lead' as const,
  },
  {
    image: '/clothes/hoodie.svg',
    alt: '',
    titleKey: 'nav.kids' as const,
    bodyKey: 'shop.kids.lead' as const,
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
          <img
            className="about-hero__photo"
            src="/about/hero.jpg"
            alt="Person working at a sunlit bench"
          />
        </section>

        <section className="about-why" aria-labelledby="why-choose">
          <h2 id="why-choose">{t('about.why')}</h2>
          <p>{t('about.whyBody')}</p>
          <p className="about-why__credit">
            Images from Seed Floral (West Hollywood, CA) &amp; Brooklyn Blooms (Brooklyn, NY)
          </p>

          <ul className="about-features">
            {features.map((feature) => (
              <li key={feature.titleKey}>
                <img src={feature.image} alt={feature.alt} />
                <h3>{t(feature.titleKey)}</h3>
                <p>{t(feature.bodyKey)}</p>
              </li>
            ))}
          </ul>

          <Link className="about-shop" to="/home">
            {t('about.shop')}
          </Link>
        </section>

        <section className="about-team" aria-labelledby="founding-team">
          <h2 id="founding-team">Founding Team</h2>
          <img
            src="/about/founders.jpg"
            alt="Co-founders Farbod Shoraka and Gregg Weisstein"
          />

          <article>
            <h3>Farbod Shoraka – Co-Founder, Chief Executive Officer</h3>
            <p>
              Farbod drives BloomNation&apos;s vision, strategy and growth. An economics graduate
              from University of California, Berkeley, Farbod has always had a passion for
              understanding business models creating solutions for the greater good. Prior to
              BloomNation, Farbod was an analyst in Mergers &amp; Acquisitions and corporate
              strategy.
            </p>
          </article>

          <article>
            <h3>Gregg Weisstein – Co-Founder, Chief Operating Officer</h3>
            <p>
              With thousands of Kernoon Clothes pieces in the shop, Gregg is
              responsible for keeping BloomNation a well-oiled machine. A Business Economics and
              Accounting graduate from University of California, Santa Barbara, Gregg has consulted
              for market leaders and wholesalers for the majority of his professional career.
            </p>
          </article>

          <p className="about-team__note">BloomNation is part of the Promenade Group.</p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
