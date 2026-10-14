import { useEffect } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import '../styles/pages/ContactUsPage.css'

const contactRows = [
  { label: 'Phone', value: '(210) 405-5050', href: 'tel:2104055050' },
  { label: 'Email', value: 'support@bloomnation.com', href: 'mailto:support@bloomnation.com' },
  {
    label: 'Address',
    value: (
      <>
        1316 3rd St., Suite 301
        <br />
        Santa Monica, CA 90401
      </>
    ),
  },
  { label: 'Hours', value: '9AM - 9PM EST' },
]

export default function ContactUsPage() {
  useEffect(() => {
    document.title = 'Contact Us | BloomNation'
  }, [])

  return (
    <div className="contact-page">
      <Header />

      <main>
        <section className="contact-hero" aria-labelledby="customer-service-title">
          <div className="contact-hero__frame">
            <img
              src="/contact/hero-clean.jpg"
              alt=""
            />
            <div className="contact-hero__copy">
              <h1 id="customer-service-title">Customer Service</h1>
              <p>
                Our philosophy begins and ends with a marketplace that provides the best possible
                customer service. By taking out the middleman, we have also taken out the bureaucracy.
                All florists in the marketplace must abide by the Florist&apos;s Rules of Conduct. For
                any questions, comments, or concerns about your order, we advise you to contact the
                local florist you have placed your order with.
              </p>
            </div>
          </div>
        </section>

        <section className="contact-details" aria-labelledby="contact-us-title">
          <h2 id="contact-us-title">Contact Us</h2>
          <dl className="contact-details__list">
            {contactRows.map((row) => (
              <div className="contact-details__row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.href ? <a href={row.href}>{row.value}</a> : row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <Footer />
    </div>
  )
}
