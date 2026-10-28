import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { StoreIcon } from '../components/icons/StoreIcon'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import '../styles/pages/ContentPage.css'

const contentKeys: Record<string, { title: MessageKey; lead: MessageKey }> = {
  '/blog': { title: 'content.blog.title', lead: 'content.blog.lead' },
  '/news': { title: 'content.news.title', lead: 'content.news.lead' },
  '/substitution-policy': { title: 'content.shipping.title', lead: 'content.shipping.lead' },
  '/delivery-fees': { title: 'content.shipping.title', lead: 'content.shipping.lead' },
  '/careers': { title: 'content.careers.title', lead: 'content.careers.lead' },
  '/help': { title: 'content.help.title', lead: 'content.help.lead' },
  '/terms': { title: 'content.terms.title', lead: 'content.terms.lead' },
  '/privacy': { title: 'content.privacy.title', lead: 'content.privacy.lead' },
  '/cookies': { title: 'content.cookies.title', lead: 'content.cookies.lead' },
}

const COOKIE_KEY = 'kernoon-cookie-prefs'

type CookiePrefs = {
  analytics: boolean
  marketing: boolean
}

const postIds = ['1', '2', '3'] as const

const newsItems = [
  {
    source: 'Los Angeles Times',
    title: 'Kernoon Clothes takes the order direct',
    date: 'November 4, 2025',
    summary: 'A look at how Kernoon Clothes sells directly to parents in each city.',
  },
  {
    source: 'Modern Retail',
    title: 'Why handmade still wins on delivery day',
    date: 'August 19, 2025',
    summary: 'Shops on the marketplace design each order in-house instead of filling a national wire ticket.',
  },
  {
    source: 'Business of Home',
    title: 'BloomNation and the Promenade Group',
    date: 'May 7, 2025',
    summary: 'The founding team on building Kernoon Clothes and keeping the customer relationship with the shop.',
  },
]

const companyJobs = [
  { id: 'support', title: 'Customer Support Specialist', place: 'Santa Monica, CA' },
  { id: 'ops', title: 'Marketplace Operations', place: 'Remote, United States' },
  { id: 'design', title: 'Brand Designer', place: 'Santa Monica, CA' },
]

const clothingJobs = [
  { id: 'designer', title: 'Kernoon Clothes designer', place: 'Los Angeles, CA' },
  { id: 'driver', title: 'Delivery Driver', place: 'Austin, TX' },
  { id: 'manager', title: 'Shop Manager', place: 'Brooklyn, NY' },
]

const faqs = [
  {
    q: 'Who designs my order?',
    a: 'Kernoon Clothes cuts and ships the piece. You choose the size and style from the photos before you check out.',
  },
  {
    q: 'Can I get same-day delivery?',
    a: 'Yes, in most cities, when you order by the afternoon. The product page and checkout show the delivery windows that shop can still make.',
  },
  {
    q: 'What if a size is sold out?',
    a: 'Kernoon Clothes sends the same style in the nearest size and fabric. Read the shipping and returns page for the full promise.',
  },
  {
    q: 'How do I change an order?',
    a: 'Contact the shop from your order details, or reach BloomNation support at support@bloomnation.com or (210) 405-5050.',
  },
]

const shops = [
  { name: 'Kernoon Clothes', city: 'Los Angeles, CA', rating: '4.9' },
  { name: 'Kernoon Clothes', city: 'Santa Monica, CA', rating: '4.8' },
  { name: 'Kernoon Clothes', city: 'Brooklyn, NY', rating: '4.7' },
  { name: 'Kernoon Clothes', city: 'Austin, TX', rating: '4.8' },
  { name: 'Kernoon Clothes', city: 'Seattle, WA', rating: '4.6' },
]

const cities = [...new Set(shops.map((shop) => shop.city))]

const events = [
  { label: "Valentine's Day", to: '/sleepwear' },
  { label: "Mother's Day", to: '/sleepwear' },
  { label: 'Birthday', to: '/kids' },
  { label: 'Anniversary', to: '/kids' },
  { label: 'Sympathy', to: '/outerwear' },
  { label: 'Just Because', to: '/toddler' },
]

const pages: Record<string, { title: string; lead: string }> = {
  '/blog': {
    title: 'Blog',
    lead: 'Notes on sizes, fabrics, and Kernoon Clothes.',
  },
  '/news': {
    title: 'In the News',
    lead: 'Recent stories about Kernoon Clothes.',
  },
  '/substitution-policy': {
    title: 'Substitution Policy',
    lead: 'Photos show the style. Kernoon Clothes sews that style in the size on the label.',
  },
  '/delivery-fees': {
    title: 'Delivery Fee and Taxes',
    lead: 'Fees depend on how far the shop drives. Tax is calculated from the delivery address.',
  },
  '/careers': {
    title: 'Careers',
    lead: 'BloomNation is part of the Promenade Group. These roles sit with the marketplace team.',
  },
  '/clothes-for-me': {
    title: 'Clothes for me',
    lead: 'Tell us your city and the age. Kernoon Clothes will show pieces we can ship there.',
  },
  '/events': {
    title: 'Event Pages',
    lead: 'Kernoon Clothes gathered for birthdays, new babies, and everyday gifting.',
  },
  '/shops': {
    title: 'Kernoon Clothes',
    lead: 'Kernoon Clothes shops shipping from their own cities.',
  },
  '/shops/near-me': {
    title: 'Kernoon Clothes near me',
    lead: 'Pick a city to see a Kernoon Clothes shop that ships there.',
  },
  '/reviews': {
    title: 'How BloomNation Reviews Work',
    lead: 'Reviews come from customers who received an order from that shop.',
  },
  '/clothes-jobs': {
    title: 'Kernoon Clothes jobs',
    lead: 'Open roles at shops that sell Kernoon Clothes.',
  },
  '/help': {
    title: 'Help Center',
    lead: 'Answers for ordering, shipping, and your Kernoon Clothes account.',
  },
  '/terms': {
    title: 'Terms of Service',
    lead: 'The rules for using Kernoon Clothes to browse, order, and sell.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    lead: 'What we collect when you shop, create an account, or contact support.',
  },
  '/cookies': {
    title: 'Cookie settings',
    lead: 'Choose which optional cookies this browser may store.',
  },
}

const defaultPrefs: CookiePrefs = { analytics: false, marketing: false }

function readPrefs(): CookiePrefs {
  try {
    const raw = localStorage.getItem(COOKIE_KEY)
    if (!raw) return defaultPrefs
    const parsed = JSON.parse(raw) as Partial<CookiePrefs>
    return {
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return defaultPrefs
  }
}

export default function ContentPage() {
  const { pathname } = useLocation()
  return <ContentScreen key={pathname} />
}

function ContentScreen() {
  const { pathname } = useLocation()
  const { t } = useI18n()
  const page = pages[pathname] ?? { title: 'Kernoon', lead: '' }
  const localized = contentKeys[pathname]
  const title = localized ? t(localized.title) : page.title || t('content.generic.title')
  const lead = localized ? t(localized.lead) : page.lead || t('content.generic.lead')
  const [openPost, setOpenPost] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [city, setCity] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [applicant, setApplicant] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applied, setApplied] = useState<string | null>(null)
  const [sender, setSender] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderCity, setSenderCity] = useState('')
  const [occasion, setOccasion] = useState('Birthday')
  const [sent, setSent] = useState(false)
  const [prefs, setPrefs] = useState<CookiePrefs>(readPrefs)
  const [prefsSaved, setPrefsSaved] = useState(false)

  useEffect(() => {
    document.title = `${title} | ${t('brand.name')}`
  }, [title, t])

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!role) return
    setApplied(role)
  }

  function submitSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  function savePrefs(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs))
    setPrefsSaved(true)
  }

  const visibleShops = city ? shops.filter((shop) => shop.city === city) : shops
  const jobs = pathname === '/clothes-jobs' ? clothingJobs : companyJobs

  return (
    <div className="info-page">
      <Header />
      <main>
        <header className="info-page__intro">
          <h1>{title}</h1>
          <p>{lead}</p>
        </header>

        {pathname === '/blog' ? (
          <section className="info-list" aria-label={t('content.blog.posts')}>
            {postIds.map((id) => (
              <article key={id}>
                <p className="info-meta">{t(`content.blog.${id}.date`)}</p>
                <h2>{t(`content.blog.${id}.title`)}</h2>
                <p>{openPost === id ? t(`content.blog.${id}.body`) : t(`content.blog.${id}.excerpt`)}</p>
                <button type="button" onClick={() => setOpenPost(openPost === id ? null : id)}>
                  {openPost === id ? t('content.blog.close') : t('content.blog.read')}
                </button>
              </article>
            ))}
          </section>
        ) : null}

        {pathname === '/news' ? (
          <section className="info-list" aria-label="Press">
            {newsItems.map((item) => (
              <article key={item.title}>
                <p className="info-meta">
                  {item.source} · {item.date}
                </p>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </article>
            ))}
          </section>
        ) : null}

        {pathname === '/substitution-policy' ? (
          <section className="info-prose">
            <h2>What stays the same</h2>
            <p>
              Kernoon Clothes keeps the color, size, and feel of the piece you chose.
            </p>
            <h2>What can change</h2>
            <p>
              A color can sell out. Kernoon Clothes sends the same style in the closest color and the size on the label.
            </p>
            <h2>If you need a specific size</h2>
            <p>
              Write it in the order notes at checkout, or call Kernoon Clothes before you order. If that size or color is gone, we will tell you before the piece is packed.
            </p>
          </section>
        ) : null}

        {pathname === '/delivery-fees' ? (
          <section className="info-prose">
            <table>
              <caption>{t('content.shipping.tableCaption')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('content.shipping.distance')}</th>
                  <th scope="col">{t('content.shipping.fee')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('content.shipping.city')}</td>
                  <td>{t('content.shipping.cityFee')}</td>
                </tr>
                <tr>
                  <td>{t('content.shipping.nearby')}</td>
                  <td>{t('content.shipping.nearbyFee')}</td>
                </tr>
                <tr>
                  <td>{t('content.shipping.extended')}</td>
                  <td>{t('content.shipping.extendedFee')}</td>
                </tr>
              </tbody>
            </table>
            <p>{t('content.shipping.checkoutNote')}</p>
            <p>{t('content.shipping.taxNote')}</p>
            <h2>{t('content.shipping.returnsTitle')}</h2>
            <p>{t('content.shipping.returnsBody')}</p>
          </section>
        ) : null}

        {pathname === '/careers' || pathname === '/clothes-jobs' ? (
          <section className="info-jobs" aria-label="Open roles">
            <ul>
              {jobs.map((job) => (
                <li key={job.id}>
                  <div>
                    <h2>{job.title}</h2>
                    <p>{job.place}</p>
                  </div>
                  <button type="button" onClick={() => setRole(job.title)}>
                    Apply
                  </button>
                </li>
              ))}
            </ul>
            {role ? (
              applied === role ? (
                <p className="info-notice" role="status">
                  {`Application received for ${role}. We will email ${applicantEmail}.`}
                </p>
              ) : (
                <form className="info-form" onSubmit={submitApplication}>
                  <h2>Apply for {role}</h2>
                  <label>
                    Name
                    <input value={applicant} onChange={(event) => setApplicant(event.target.value)} required />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(event) => setApplicantEmail(event.target.value)}
                      required
                    />
                  </label>
                  <button type="submit">Submit application</button>
                </form>
              )
            ) : null}
          </section>
        ) : null}

        {pathname === '/clothes-for-me' ? (
          <section className="info-prose">
            {sent ? (
              <p className="info-notice" role="status">
                {`Thanks, ${sender}. Kernoon Clothes will email ${senderEmail} about ${occasion.toLowerCase()} clothes we can ship to ${senderCity}.`}
              </p>
            ) : (
              <form className="info-form" onSubmit={submitSend}>
                <label>
                  Your name
                  <input value={sender} onChange={(event) => setSender(event.target.value)} required />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(event) => setSenderEmail(event.target.value)}
                    required
                  />
                </label>
                <label>
                  City
                  <input value={senderCity} onChange={(event) => setSenderCity(event.target.value)} required />
                </label>
                <label>
                  Occasion
                  <select value={occasion} onChange={(event) => setOccasion(event.target.value)}>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Sympathy</option>
                    <option>Just Because</option>
                  </select>
                </label>
                <button type="submit">Send my request</button>
              </form>
            )}
          </section>
        ) : null}

        {pathname === '/events' ? (
          <section className="info-links" aria-label="Events">
            <ul>
              {events.map((event) => (
                <li key={event.label}>
                  <Link to={event.to}>{event.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {pathname === '/shops' || pathname === '/shops/near-me' ? (
          <section className="info-shops" aria-label="Kernoon Clothes">
            {pathname === '/shops/near-me' ? (
              <ul className="info-cities">
                {cities.map((name) => (
                  <li key={name}>
                    <button type="button" className={city === name ? 'is-selected' : undefined} onClick={() => setCity(name)}>
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <ul>
              {visibleShops.map((shop) => (
                <li key={shop.city}>
                  <Link to="/product">
                    <StoreIcon />
                    <span>
                      <strong>{shop.name}</strong>
                      <span>
                        {shop.city} · {shop.rating} stars
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {visibleShops.length === 0 ? <p>No Kernoon Clothes shop matches that city yet.</p> : null}
          </section>
        ) : null}

        {pathname === '/reviews' ? (
          <section className="info-prose">
            <h2>Who can review</h2>
            <p>Only a customer with a completed Kernoon Clothes order can leave a review. The review is tied to the order, not to a public star widget.</p>
            <h2>What you see</h2>
            <p>The shop’s average, the number of reviews, and the written notes appear on the product page. A shop cannot edit the text. They can reply once.</p>
            <h2>What we remove</h2>
            <p>We remove reviews that include private phone numbers, threats, or comments about a different shop. We do not remove a review because the rating is low.</p>
          </section>
        ) : null}

        {pathname === '/help' ? (
          <section className="info-faq" aria-label="Help topics">
            {faqs.map((item, index) => {
              const open = openFaq === index
              return (
                <article key={item.q}>
                  <h2>
                    <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                      {item.q}
                    </button>
                  </h2>
                  {open ? <p>{item.a}</p> : null}
                </article>
              )
            })}
            <p className="info-meta">
              Still stuck? <Link to="/contact-us">Contact Us</Link> or call (210) 405-5050.
            </p>
          </section>
        ) : null}

        {pathname === '/terms' ? (
          <section className="info-prose">
            <h2>Orders</h2>
            <p>
              When you place an order, you are buying Kernoon Clothes. We collect payment and pass the order to the shop. Shipping time shown at checkout is the shop’s commitment.
            </p>
            <h2>Accounts</h2>
            <p>You are responsible for the email and password on your account. Kernoon Clothes seller accounts are for the shop owner or someone they authorize.</p>
            <h2>Acceptable use</h2>
            <p>Do not use the site to scrape listings, place fraudulent orders, or post content you do not have the right to share.</p>
          </section>
        ) : null}

        {pathname === '/privacy' ? (
          <section className="info-prose">
            <h2>Information you give us</h2>
            <p>Name, email, phone, delivery addresses, and payment details are used to complete orders, run your account, and reply when you contact support.</p>
            <h2>Information we collect automatically</h2>
            <p>Pages you visit, the shop you viewed, and cookie preferences help us keep the site working and, if you allow it, understand which clothes people browse.</p>
            <h2>Who we share it with</h2>
            <p>The Kernoon Clothes shop fulfilling your order receives the recipient name, address, and delivery notes. Payment details are handled by our payment processor. We do not sell personal information.</p>
          </section>
        ) : null}

        {pathname === '/cookies' ? (
          <section className="info-cookies">
            {prefsSaved ? (
              <p className="info-notice" role="status">
                {t('content.cookies.saved')}
              </p>
            ) : null}
            <form className="info-form info-form--cookies" onSubmit={savePrefs}>
              <label className="info-check">
                <input type="checkbox" checked disabled />
                <span>
                  <strong>{t('content.cookies.essential')}</strong>
                  <span>{t('content.cookies.essentialNote')}</span>
                </span>
              </label>
              <label className="info-check">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(event) => setPrefs({ ...prefs, analytics: event.target.checked })}
                />
                <span>
                  <strong>{t('content.cookies.analytics')}</strong>
                  <span>{t('content.cookies.analyticsNote')}</span>
                </span>
              </label>
              <label className="info-check">
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(event) => setPrefs({ ...prefs, marketing: event.target.checked })}
                />
                <span>
                  <strong>{t('content.cookies.marketing')}</strong>
                  <span>{t('content.cookies.marketingNote')}</span>
                </span>
              </label>
              <button type="submit">{t('content.cookies.save')}</button>
            </form>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
