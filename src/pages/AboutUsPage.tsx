import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { BrandMark } from '../components/icons/BrandMark'
import './AboutUsPage.css'

const features = [
  {
    image: '/about/feature-1.jpg',
    alt: 'Hands arranging a mixed bouquet in a peach vase',
    title: 'Hand-Delivered Freshness',
    body: 'Unlike mass-produced arrangements, our flowers are delivered fresh, never boxed.',
  },
  {
    image: '/about/feature-2.jpg',
    alt: 'Florist arranging pink and yellow blooms',
    title: 'Support Local Florists',
    body: 'Every bouquet is crafted by a local floral expert, ensuring quality and creativity.',
  },
  {
    image: '/about/feature-3.jpg',
    alt: 'Colorful custom bouquet of sunflowers, roses, and dahlias',
    title: 'Unique & Custom Designs',
    body: 'Discover one-of-a-kind floral creations tailored to your special occasions.',
  },
]

export default function AboutUsPage() {
  useEffect(() => {
    document.title = 'About Us | BloomNation'
  }, [])

  return (
    <div className="about-page">
      <Header />

      <main>
        <section className="about-hero" aria-labelledby="about-welcome">
          <div className="about-hero__copy">
            <h1 id="about-welcome">
              Hi, Welcome to
              <span className="about-hero__brand">
                BloomNation
                <BrandMark size={28} aria-hidden="true" />
              </span>
            </h1>
            <p>
              Founded in August of 2011, BloomNation is a trusted community marketplace for people
              to list, discover, and send unique bouquets handcrafted by local florists across the
              country. Whether you&apos;re looking for the traditional dozen roses or a one-of-a-kind
              design, BloomNation lets you discover and send the perfect gift. With our epic
              customer service and growing community of florists, BloomNation is the easiest and
              most reliable way for ordering flowers online.
            </p>
          </div>
          <img
            className="about-hero__photo"
            src="/about/hero.jpg"
            alt="Florist in a checkered shirt working at a sunlit bench"
          />
        </section>

        <section className="about-why" aria-labelledby="why-choose">
          <h2 id="why-choose">Why Choose Us?</h2>
          <p>
            With BloomNation, you&apos;re not just sending flowers—you&apos;re supporting small
            businesses and celebrating artistry with every arrangement.
          </p>
          <p className="about-why__credit">
            Images from Seed Floral (West Hollywood, CA) &amp; Brooklyn Blooms (Brooklyn, NY)
          </p>

          <ul className="about-features">
            {features.map((feature) => (
              <li key={feature.title}>
                <img src={feature.image} alt={feature.alt} />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </li>
            ))}
          </ul>

          <Link className="about-shop" to="/home">
            Shop BloomNation
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
              strategy. Farbod&apos;s favorite flower is the Casablanca Lily.
            </p>
          </article>

          <article>
            <h3>Gregg Weisstein – Co-Founder, Chief Operating Officer</h3>
            <p>
              With thousands of both florists and their products in the marketplace, Gregg is
              responsible for keeping BloomNation a well-oiled machine. A Business Economics and
              Accounting graduate from University of California, Santa Barbara, Gregg has consulted
              for market leaders and wholesalers for the majority of his professional career.
              Gregg&apos;s favorite flowers are orchids.
            </p>
          </article>

          <p className="about-team__note">BloomNation is part of the Promenade Group.</p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
