import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { CalendarIcon } from '../components/icons/CalendarIcon'
import { FacebookIcon } from '../components/icons/FacebookIcon'
import { InstagramIcon } from '../components/icons/InstagramIcon'
import { LinkedInIcon } from '../components/icons/LinkedInIcon'
import { PinIcon } from '../components/icons/PinIcon'
import { PinterestIcon } from '../components/icons/PinterestIcon'
import { StarIcon } from '../components/icons/StarIcon'
import { StoreIcon } from '../components/icons/StoreIcon'
import { XIcon } from '../components/icons/XIcon'
import { YouTubeIcon } from '../components/icons/YouTubeIcon'
import '../styles/pages/HomePage.css'

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
  { label: 'Shop Local Same-Day', image: '/home/occasion-1.jpg', to: '/same-day' },
  { label: 'Shop Birthday', image: '/home/occasion-2.jpg', to: '/occasions?occasion=Birthday' },
  { label: 'Shop Sympathy', image: '/home/occasion-3.jpg', to: '/sympathy' },
  { label: 'Shop Anniversary', image: '/home/occasion-4.jpg', to: '/occasions?occasion=Anniversary' },
  { label: 'Shop Get Well', image: '/home/occasion-5.jpg', to: '/occasions?occasion=Get%20Well' },
  { label: 'Shop Just Because', image: '/home/occasion-6.jpg', to: '/occasions?occasion=Just%20Because' },
]

const reviews = [
  {
    image: '/home/review-1.jpg',
    quote:
      'Always awesome!! As far as I am concerned, after dozens of purchases, this is the only florist in San Juan Capistrano.',
    name: 'AJ F.',
  },
  {
    image: '/home/review-2.jpg',
    quote:
      "They were pleasantly surprised and amazed how beautiful the flowers choices and arrangement were! This is a definite must for any special friend/family member's special day. I will continue to utilize them!",
    name: 'Michele S.',
  },
  {
    image: '/home/review-3.jpg',
    quote:
      'For my request being the day before I needed my flower arrangement, the service was amazing. My wife loved the flowers! Amazing service and communication!!!',
    name: 'Angel D.',
  },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'X', href: 'https://x.com', Icon: XIcon },
  { label: 'Pinterest', href: 'https://pinterest.com', Icon: PinterestIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTubeIcon },
]

const instagramPosts = [
  '/home/ig-1.jpg',
  '/home/ig-2.jpg',
  '/home/ig-3.jpg',
  '/home/ig-4.jpg',
  '/home/ig-5.jpg',
]

const faqs = [
  {
    question: 'Do you offer same-day delivery?',
    answer:
      'Yes, we offer same-day flower delivery for most orders placed before the cutoff time. Simply browse our collection, choose your arrangement, and enjoy fresh, hand-delivered flowers the same day.',
  },
  {
    question: 'Can I schedule a delivery for a specific date?',
    answer:
      "Yes, you can schedule flower delivery for a specific date during checkout. Just select your preferred date, and we'll ensure your arrangement arrives on time and fresh.",
  },
  {
    question: "What happens if the recipient isn't home during delivery?",
    answer:
      "If the recipient isn't home, we'll do our best to deliver your flowers safely. Options may include leaving them with a neighbor, at the doorstep (weather permitting), or arranging a redelivery.",
  },
  {
    question: 'How will I know if my flowers have been delivered?',
    answer:
      'Once your flowers are delivered, you’ll receive a BloomSnap—a photo of the finished arrangement—so you can see the beautiful blooms that were hand-delivered to your recipient.',
  },
  {
    question: 'Do you deliver flowers to hospitals, offices, or funeral homes?',
    answer:
      "Yes, we deliver flowers to hospitals, offices, and funeral homes. To ensure a smooth delivery, please provide detailed instructions, including the recipient's room or suite number.",
  },
  {
    question: 'What payment methods do you accept for flower orders?',
    answer:
      'We accept all major credit cards, along with Apple Pay, Google Pay, Amazon Pay, and flexible options like AfterPay and e-check. Our secure payment process ensures a seamless and worry-free checkout experience for your order.',
  },
  {
    question: "Can I change or cancel my flower order after it's placed?",
    answer:
      'Yes, you can change or cancel your flower order within a certain timeframe. Contact our customer support team as soon as possible to make adjustments or cancellations.',
  },
  {
    question: 'What is your flower substitution policy?',
    answer:
      'If specific flowers are unavailable, we will substitute them with blooms of equal or greater value to maintain the beauty and quality of your arrangement.',
  },
  {
    question: 'How do I care for fresh flowers to make them last longer?',
    answer:
      'To keep your fresh flowers looking their best, trim the stems at an angle, change the water daily, and keep them in a cool area away from direct sunlight or heat.',
  },
  {
    question: 'What should I do if my flowers arrive damaged or not as expected?',
    answer:
      'If your flowers arrive damaged or not as expected, contact us immediately. We stand by the quality of our arrangements and will provide a replacement, refund, or credit to ensure your satisfaction.',
  },
]

const flowerTypes = [
  ['Orchids Delivery', 'Roses Delivery', 'Alstroemeria Delivery', 'Sunflowers Delivery'],
  ['Daisies Delivery', 'Plants Delivery', 'Iris Delivery', 'Snapdragons Delivery'],
  ['Tulips Delivery', 'Lilies Delivery', 'Hydrangeas Delivery', 'Peonies Delivery'],
  ['Carnations Delivery', 'Calla Lilies Delivery', 'Tropical Delivery', 'Hyacinth Delivery'],
]

function formatDeliveryDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return ''
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${mm}/${dd}/${year}`
}

type HomePageProps = {
  loggedIn?: boolean
}

export default function HomePage({ loggedIn = false }: HomePageProps) {
  const [place, setPlace] = useState(loggedIn ? 'Los Angeles, CA' : 'Haven, KS')
  const [date, setDate] = useState(loggedIn ? '2026-07-02' : '')

  useEffect(() => {
    document.title = 'BloomNation | Flower Delivery'
  }, [])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="home">
      <Header userName={loggedIn ? 'hadi' : undefined} />

      <main>
        <div className="home-frame">
          <form className="home-search" onSubmit={handleSearch}>
            <p className="home-search__title">Customize Your Search</p>
            <div className="home-search__fields">
              <label className="home-search__field">
                <PinIcon className="home-search__icon" />
                <span className="home-search__prefix">Deliver to:</span>
                <input
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  aria-label="Delivery location"
                />
              </label>
              <label className="home-search__field">
                <CalendarIcon className="home-search__icon" />
                <span className={date ? 'home-search__value' : 'home-search__prefix'}>
                  {date ? formatDeliveryDate(date) : 'Deliver on:'}
                </span>
                <input
                  className="home-search__date"
                  type="date"
                  value={date}
                  aria-label="Delivery date"
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
            </div>
          </form>

          <section className="home-hero" aria-labelledby="hero-title">
            <div className="home-hero__copy">
              <h1 id="hero-title">4th of July Flowers</h1>
              <p>Celebrate Freedom with Red, White &amp; Bloom.</p>
              <Link className="home-button" to="/flowers">
                Shop Flowers
              </Link>
            </div>
            <img src="/home/hero.jpg" alt="Patriotic summer bouquet on an outdoor table" />
          </section>

          <section className="home-press" aria-label="Featured in">
            <p>Featured in</p>
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
            <img
              src="/home/support-local.jpg"
              alt="Local florist holding a pink and white bouquet in her shop"
            />
            <div className="home-split__copy">
              <h2>Support Local. Celebrate Craft.</h2>
              <p>
                Every arrangement is a unique creation by local florists. When you order with
                BloomNation, you’re choosing fresh, hand-designed blooms that showcase the craft and
                passion of your neighborhood experts—delivered with care and precision.
              </p>
              <Link className="home-button" to="/florist">
                Best of Local
              </Link>
            </div>
          </section>

          <section className="home-split home-split--flip">
            <img src="/home/graduation.jpg" alt="Graduate in a cap and gown holding a bouquet" />
            <div className="home-split__copy">
              <h2>Honor Every Graduate with Flowers</h2>
              <p>One-of-a-Kind Graduation Bouquets, Leis &amp; Arrangements from a Local Florist</p>
              <Link className="home-button" to="/occasions">
                Shop Graduation Flowers
              </Link>
            </div>
          </section>

          <section className="home-split">
            <img
              src="/home/video.jpg"
              alt="Person recording a video message beside a rose bouquet"
            />
            <div className="home-split__copy">
              <h2>Turn Flowers into Memories with a Video Message</h2>
              <p>
                Looking to add a personal twist to your flowers? A video card message is the perfect
                way to send a smile with your blooms. Simply record, upload, and add your personal
                message during checkout. It’s a fun and easy way to make your floral gift extra
                special and unforgettable!
              </p>
              <Link className="home-button" to="/flowers">
                Shop Flowers
              </Link>
            </div>
          </section>
        </div>

        <section className="home-products" aria-labelledby="shop-flowers-title">
          <h2 id="shop-flowers-title">Shop Flowers</h2>
          <ul>
            {products.map((product) => (
              <li key={product.name}>
                <Link to="/product">
                  <img src={product.image} alt="" />
                  <span className="home-products__name">{product.name}</span>
                  <span className="home-products__price">{product.price}</span>
                  <span className="home-products__florist">
                    <StoreIcon />
                    Absolutely Flowers
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-occasions" aria-labelledby="occasions-title">
          <h2 id="occasions-title">Flowers for Every Occasion</h2>
          <ul>
            {occasions.map((occasion) => (
              <li key={occasion.label}>
                <Link to={occasion.to}>
                  <img src={occasion.image} alt="" />
                  <span>{occasion.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-reviews" aria-labelledby="reviews-title">
          <h2 id="reviews-title">See our Blooming Reviews</h2>
          <ul>
            {reviews.map((review) => (
              <li key={review.name}>
                <img src={review.image} alt="" />
                <blockquote>“{review.quote}”</blockquote>
                <p className="home-reviews__name">{review.name}</p>
                <p className="home-reviews__buyer">Verified Buyer</p>
                <p className="home-reviews__stars" aria-label="5 out of 5 stars">
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
            <h2 id="follow-title">Follow Us</h2>
            <p>#BloomNation</p>
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
                  <img src={image} alt="BloomNation on Instagram" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-info" aria-labelledby="faq-title">
          <div className="home-info__inner">
            <h2 id="faq-title">Your Questions, Answered with Care</h2>
            <div className="home-faq">
              {faqs.map((item) => (
                <article key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>

            <h2 className="home-info__seo-title">Shop Fresh Flowers – Same Day Delivery</h2>
            <div className="home-info__seo">
              <p>
                Need a last-minute gift that still feels personal and thoughtful? Our express flower
                delivery service ensures that fresh, handcrafted bouquets arrive on time, no matter
                the occasion. Whether you’re celebrating a birthday, sending love on an anniversary,
                or expressing sympathy, we offer same-day and next-day flower delivery to make
                gifting effortless.
              </p>
              <p>
                With a network of skilled local florists, we provide beautifully arranged flowers
                using the freshest blooms available. From classic roses and elegant lilies to bright
                sunflowers and unique mixed arrangements, we have the perfect bouquet to suit any
                sentiment. Each arrangement is carefully designed to bring joy and beauty to your
                recipient’s day.
              </p>
              <p>
                Ordering is simple—choose from our wide selection of floral arrangements, customize
                your message, and let us handle the rest. Our fast flower delivery ensures your gift
                arrives fresh and vibrant, with same-day service available in most areas.
              </p>
              <p>
                In addition to traditional bouquets, we also offer seasonal arrangements, luxury
                floral designs, and potted plants for a lasting impression. Whether you’re sending
                flowers across town or across the country, our express delivery service makes sure
                your thoughtful gift reaches its destination quickly.
              </p>
              <p>
                Don’t let time constraints keep you from showing you care. Order express flower
                delivery today and brighten someone’s day with a stunning, handcrafted bouquet.
              </p>
            </div>

            <h2>Flower Types</h2>
            <div className="home-types">
              {flowerTypes.map((column) => (
                <ul key={column[0]}>
                  {column.map((label) => (
                    <li key={label}>
                      <Link to="/flowers">{label}</Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
