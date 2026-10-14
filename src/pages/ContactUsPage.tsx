import { useEffect } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { useI18n } from '../i18n/LanguageProvider'
import '../styles/pages/ContactUsPage.css'

export default function ContactUsPage() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = t('contact.title')
  }, [t])

  const contactRows = [
    { label: t('contact.phone'), value: '(210) 405-5050', href: 'tel:2104055050' },
    { label: t('contact.email'), value: 'support@kernoon.com', href: 'mailto:support@kernoon.com' },
    {
      label: t('contact.address'),
      value: (
        <>
          1316 3rd St., Suite 301
          <br />
          Santa Monica, CA 90401
        </>
      ),
    },
    { label: t('contact.hours'), value: t('contact.hoursValue') },
  ]

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
              <h1 id="customer-service-title">{t('contact.heroTitle')}</h1>
              <p>{t('contact.heroBody')}</p>
            </div>
          </div>
        </section>

        <section className="contact-details" aria-labelledby="contact-us-title">
          <h2 id="contact-us-title">{t('contact.heading')}</h2>
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
