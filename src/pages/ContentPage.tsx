import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { StoreIcon } from '../components/icons/StoreIcon'
import './ContentPage.css'

const COOKIE_KEY = 'bloomnation-cookie-prefs'

type CookiePrefs = {
  analytics: boolean
  marketing: boolean
}

const posts = [
  {
    id: 'seasonal',
    title: 'What to send when the season changes',
    date: 'March 12, 2026',
    excerpt: 'Local florists design with what is fresh that week, not a catalog frozen in January.',
    body: 'A bouquet in March should not look like a bouquet in August. Tulips, ranunculus, and branches give way to garden roses, dahlias, and local greenery. When you order on BloomNation, the shop near the recipient chooses stems that are actually in season, so the arrangement lasts longer and looks like it was made that morning.',
  },
  {
    id: 'note',
    title: 'How to write a card that sounds like you',
    date: 'February 2, 2026',
    excerpt: 'Short, specific, and a little imperfect beats a poem you found online.',
    body: 'Name the moment. “Happy Tuesday, you handled that week” lands better than a generic congratulations line. Keep it to two or three sentences so it fits the card, and skip instructions for the florist in the message — those belong in the delivery notes at checkout.',
  },
  {
    id: 'same-day',
    title: 'Same-day delivery, without the wire service',
    date: 'January 18, 2026',
    excerpt: 'The florist who designs the bouquet is the florist who delivers it.',
    body: 'BloomNation sends the order to a shop in the recipient’s city. That shop designs the flowers and hands them off for delivery. You see their photos, reviews, and hours before you pay, and the arrangement is not rebuilt from a stock photo by a shop you never chose.',
  },
]

const newsItems = [
  {
    source: 'Los Angeles Times',
    title: 'Local florists take back the order',
    date: 'November 4, 2025',
    summary: 'A look at how neighborhood shops use BloomNation to sell directly to customers in their delivery area.',
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
    summary: 'The founding team on building a marketplace that keeps the customer relationship with the florist.',
  },
]

const companyJobs = [
  { id: 'support', title: 'Customer Support Specialist', place: 'Santa Monica, CA' },
  { id: 'ops', title: 'Marketplace Operations', place: 'Remote, United States' },
  { id: 'design', title: 'Brand Designer', place: 'Santa Monica, CA' },
]

const floralJobs = [
  { id: 'designer', title: 'Lead Floral Designer', place: 'Los Angeles, CA' },
  { id: 'driver', title: 'Delivery Driver', place: 'Austin, TX' },
  { id: 'manager', title: 'Shop Manager', place: 'Brooklyn, NY' },
]

const faqs = [
  {
    q: 'Who designs my order?',
    a: 'A local florist on BloomNation designs and delivers it. You choose the shop from their photos and reviews before you check out.',
  },
  {
    q: 'Can I get same-day delivery?',
    a: 'Yes, in most cities, when you order by the afternoon. The product page and checkout show the delivery windows that shop can still make.',
  },
  {
    q: 'What if a flower is out of season?',
    a: 'The florist substitutes a stem of similar color, size, and value and keeps the style of the photo. Read the substitution policy for the full promise.',
  },
  {
    q: 'How do I change an order?',
    a: 'Contact the shop from your order details, or reach BloomNation support at support@bloomnation.com or (210) 405-5050.',
  },
]

const florists = [
  { name: 'Absolutely Flowers', city: 'Los Angeles, CA', rating: '4.9' },
  { name: 'H&A Floral Design', city: 'Los Angeles, CA', rating: '4.8' },
  { name: 'Seed Floral', city: 'Santa Monica, CA', rating: '4.9' },
  { name: 'Brooklyn Blooms', city: 'Brooklyn, NY', rating: '4.7' },
  { name: 'Petal & Stem', city: 'Austin, TX', rating: '4.8' },
  { name: 'Harbor & Bloom', city: 'Seattle, WA', rating: '4.6' },
]

const cities = [...new Set(florists.map((shop) => shop.city))]

const events = [
  { label: "Valentine's Day", to: "/occasions?occasion=Valentine's%20Day" },
  { label: "Mother's Day", to: "/occasions?occasion=Mother's%20Day" },
  { label: 'Birthday', to: '/occasions?occasion=Birthday' },
  { label: 'Anniversary', to: '/occasions?occasion=Anniversary' },
  { label: 'Sympathy', to: '/sympathy' },
  { label: 'Just Because', to: '/occasions?occasion=Just%20Because' },
]

const pages: Record<string, { title: string; lead: string }> = {
  '/blog': {
    title: 'Blog',
    lead: 'Notes on flowers, local shops, and sending something that feels considered.',
  },
  '/news': {
    title: 'In the News',
    lead: 'Recent stories about BloomNation and the florists on the marketplace.',
  },
  '/substitution-policy': {
    title: 'Substitution Policy',
    lead: 'Photos show the style. The florist builds that style with the best stems available that day.',
  },
  '/delivery-fees': {
    title: 'Delivery Fee and Taxes',
    lead: 'Fees depend on how far the shop drives. Tax is calculated from the delivery address.',
  },
  '/careers': {
    title: 'Careers',
    lead: 'BloomNation is part of the Promenade Group. These roles sit with the marketplace team.',
  },
  '/send-me-flowers': {
    title: 'Send Me Flowers',
    lead: 'Tell us where you are and the occasion. We will point you to florists who deliver there.',
  },
  '/events': {
    title: 'Event Pages',
    lead: 'Shop arrangements gathered for the days people send flowers most.',
  },
  '/florists': {
    title: 'Florists',
    lead: 'Independent shops designing and delivering in their own cities.',
  },
  '/florists/near-me': {
    title: 'Best Florists Near Me',
    lead: 'Pick a city to see shops that deliver there.',
  },
  '/reviews': {
    title: 'How BloomNation Reviews Work',
    lead: 'Reviews come from customers who received an order from that shop.',
  },
  '/floral-jobs': {
    title: 'Floral Jobs',
    lead: 'Open roles at shops that sell on BloomNation.',
  },
  '/help': {
    title: 'Help Center',
    lead: 'Answers for ordering, delivery, and your florist account.',
  },
  '/terms': {
    title: 'Terms of Service',
    lead: 'The rules for using BloomNation to browse, order, and sell floral arrangements.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    lead: 'What we collect when you shop, create an account, or contact support.',
  },
  '/cookies': {
    title: 'Cookie Settings',
    lead: 'Choose which optional cookies BloomNation may store in this browser.',
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
  const page = pages[pathname] ?? { title: 'BloomNation', lead: '' }
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
  const [prefs, setPrefs] = useState<CookiePrefs>(defaultPrefs)
  const [prefsSaved, setPrefsSaved] = useState(false)

  useEffect(() => {
    document.title = `${page.title} | BloomNation`
  }, [page.title])

  useEffect(() => {
    setOpenPost(null)
    setOpenFaq(0)
    setCity(null)
    setRole(null)
    setApplied(null)
    setSent(false)
    setPrefsSaved(false)
    setPrefs(readPrefs())
  }, [pathname])

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

  const visibleFlorists = city ? florists.filter((shop) => shop.city === city) : florists
  const jobs = pathname === '/floral-jobs' ? floralJobs : companyJobs

  return (
    <div className="info-page">
      <Header />
      <main>
        <header className="info-page__intro">
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </header>

        {pathname === '/blog' ? (
          <section className="info-list" aria-label="Posts">
            {posts.map((post) => (
              <article key={post.id}>
                <p className="info-meta">{post.date}</p>
                <h2>{post.title}</h2>
                <p>{openPost === post.id ? post.body : post.excerpt}</p>
                <button type="button" onClick={() => setOpenPost(openPost === post.id ? null : post.id)}>
                  {openPost === post.id ? 'Close' : 'Read'}
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
              The florist keeps the colors, size, and overall feeling of the arrangement you chose. A premium design stays a premium design.
            </p>
            <h2>What can change</h2>
            <p>
              Weather, season, and the wholesale market can take a specific bloom out of reach. The shop replaces it with a flower of similar value and character. A one-of-a-kind vase in a photo may be a container of the same shape and color.
            </p>
            <h2>If you need a specific stem</h2>
            <p>
              Write it in the florist instructions at checkout, or call the shop before you order. If they cannot confirm it, they will tell you before the arrangement is made.
            </p>
          </section>
        ) : null}

        {pathname === '/delivery-fees' ? (
          <section className="info-prose">
            <table>
              <caption>Typical delivery fees</caption>
              <thead>
                <tr>
                  <th scope="col">Distance from the shop</th>
                  <th scope="col">Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Within the shop’s city</td>
                  <td>$12.95</td>
                </tr>
                <tr>
                  <td>Nearby neighborhoods</td>
                  <td>$16.95</td>
                </tr>
                <tr>
                  <td>Extended delivery area</td>
                  <td>$22.95</td>
                </tr>
              </tbody>
            </table>
            <p>
              The exact fee appears at checkout once you enter a delivery address. Same-day requests can add a rush fee when the shop is close to its cutoff.
            </p>
            <p>Sales tax is calculated from the delivery address and shown before you pay. There is no separate service charge on top of the arrangement, delivery, and tax.</p>
          </section>
        ) : null}

        {pathname === '/careers' || pathname === '/floral-jobs' ? (
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

        {pathname === '/send-me-flowers' ? (
          <section className="info-prose">
            {sent ? (
              <p className="info-notice" role="status">
                {`Thanks, ${sender}. We will email ${senderEmail} with florists who deliver ${occasion.toLowerCase()} flowers in ${senderCity}.`}
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

        {pathname === '/florists' || pathname === '/florists/near-me' ? (
          <section className="info-shops" aria-label="Florists">
            {pathname === '/florists/near-me' ? (
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
              {visibleFlorists.map((shop) => (
                <li key={shop.name}>
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
            {visibleFlorists.length === 0 ? <p>No florists match that city yet.</p> : null}
          </section>
        ) : null}

        {pathname === '/reviews' ? (
          <section className="info-prose">
            <h2>Who can review</h2>
            <p>Only a customer with a completed delivery from that florist can leave a review. The review is tied to the order, not to a public star widget.</p>
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
              When you place an order, you are buying from the florist you selected. BloomNation collects payment and passes the order to that shop. Delivery timing shown at checkout is the shop’s commitment.
            </p>
            <h2>Accounts</h2>
            <p>You are responsible for the email and password on your account. Florist accounts are for the shop owner or someone they authorize.</p>
            <h2>Acceptable use</h2>
            <p>Do not use the site to scrape listings, place fraudulent orders, or post content you do not have the right to share.</p>
          </section>
        ) : null}

        {pathname === '/privacy' ? (
          <section className="info-prose">
            <h2>Information you give us</h2>
            <p>Name, email, phone, delivery addresses, and payment details are used to complete orders, run your account, and reply when you contact support.</p>
            <h2>Information we collect automatically</h2>
            <p>Pages you visit, the shop you viewed, and cookie preferences help us keep the site working and, if you allow it, understand which arrangements people browse.</p>
            <h2>Who we share it with</h2>
            <p>The florist fulfilling your order receives the recipient name, address, card message, and delivery notes. Payment details are handled by our payment processor. We do not sell personal information.</p>
          </section>
        ) : null}

        {pathname === '/cookies' ? (
          <section className="info-prose">
            {prefsSaved ? (
              <p className="info-notice" role="status">
                Preferences saved in this browser.
              </p>
            ) : null}
            <form className="info-form" onSubmit={savePrefs}>
              <label className="info-check">
                <input type="checkbox" checked disabled />
                Essential cookies, required to sign in and check out
              </label>
              <label className="info-check">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(event) => setPrefs({ ...prefs, analytics: event.target.checked })}
                />
                Analytics cookies
              </label>
              <label className="info-check">
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(event) => setPrefs({ ...prefs, marketing: event.target.checked })}
                />
                Marketing cookies
              </label>
              <button type="submit">Save preferences</button>
            </form>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
