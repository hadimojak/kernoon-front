import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import './BecomeFloristPage.css'

const perks = [
  {
    title: 'Your own storefront',
    body: 'List your shop, photos, and arrangements so local customers can find you.',
  },
  {
    title: 'Orders from nearby customers',
    body: 'Receive same-day and scheduled orders from people searching in your city.',
  },
  {
    title: 'You keep the relationship',
    body: 'Customers order from you directly. There is no wire-service middleman.',
  },
]

export default function BecomeFloristPage() {
  const [shop, setShop] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Become a BloomNation Florist | BloomNation'
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="florist-join">
      <Header />

      <main>
        <section className="florist-join__hero" aria-labelledby="join-title">
          <h1 id="join-title">Become a BloomNation Florist</h1>
          <p>
            Join the marketplace built for independent florists. Show your work, take local
            orders, and keep the customer relationship.
          </p>
          <a className="florist-join__cta" href="#apply">
            Apply to join
          </a>
          <p className="florist-join__login">
            Already a florist? <Link to="/florist/login">Florist Login</Link>
          </p>
        </section>

        <section className="florist-join__perks" aria-label="Why join">
          {perks.map((perk) => (
            <article key={perk.title}>
              <h2>{perk.title}</h2>
              <p>{perk.body}</p>
            </article>
          ))}
        </section>

        <section className="florist-join__apply" id="apply" aria-labelledby="apply-title">
          {submitted ? (
            <div className="florist-join__thanks">
              <h2 id="apply-title">Application received</h2>
              <p>
                {`Thanks, ${name.split(' ')[0] || 'there'}. We'll review ${shop || 'your shop'} and email you at ${email}.`}
              </p>
              <Link to="/florist/login">Go to Florist Login</Link>
            </div>
          ) : (
            <>
              <h2 id="apply-title">Tell us about your shop</h2>
              <form onSubmit={handleSubmit} noValidate>
                <label>
                  Shop name
                  <input value={shop} onChange={(event) => setShop(event.target.value)} required />
                </label>
                <label>
                  Your name
                  <input value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </label>
                <label>
                  City
                  <input value={city} onChange={(event) => setCity(event.target.value)} required />
                </label>
                <button type="submit">Submit application</button>
              </form>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
