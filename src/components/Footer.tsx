import { Link } from 'react-router-dom'
import { FacebookIcon } from './icons/FacebookIcon'
import { InstagramIcon } from './icons/InstagramIcon'
import { LinkedInIcon } from './icons/LinkedInIcon'
import { PinterestIcon } from './icons/PinterestIcon'
import { XIcon } from './icons/XIcon'
import { YouTubeIcon } from './icons/YouTubeIcon'
import { Logo } from './Logo'
import '../styles/components/Footer.css'

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'X', href: 'https://x.com', Icon: XIcon },
  { label: 'Pinterest', href: 'https://pinterest.com', Icon: PinterestIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTubeIcon },
]

const footerHrefs: Record<string, string> = {
  'About Us': '/about-us',
  Blog: '/blog',
  'In the News': '/news',
  'Substitution Policy': '/substitution-policy',
  'Delivery Fee and Taxes': '/delivery-fees',
  'Contact Us': '/contact-us',
  Careers: '/careers',
  'Become a BloomNation Florist': '/florist',
  'How BloomNation Reviews Work': '/reviews',
  'Florist Login': '/florist/login',
  'Floral Jobs': '/floral-jobs',
  'Help Center': '/help',
  'Just Because': '/occasions?occasion=Just%20Because',
  Anniversary: '/occasions?occasion=Anniversary',
  Birthday: '/occasions?occasion=Birthday',
  Congratulations: '/occasions?occasion=Congratulations',
  'New Baby': '/occasions?occasion=New%20Baby',
  "Valentine's Day": '/occasions?occasion=Valentine%27s%20Day',
  "Mother's Day": '/occasions?occasion=Mother%27s%20Day',
  'Same-Day Delivery': '/same-day',
  'Next-Day Delivery': '/next-day',
  'Shop by City': '/city',
  'Send Me Flowers': '/send-me-flowers',
  'Event Pages': '/events',
  Florists: '/florists',
  'Best Florists Near Me': '/florists/near-me',
}

const columns = [
  {
    title: 'Company',
    links: ['About Us', 'Blog', 'In the News', 'Substitution Policy', 'Delivery Fee and Taxes', 'Contact Us', 'Careers'],
  },
  {
    title: 'Shop by Occasion',
    links: ['Just Because', 'Anniversary', 'Birthday', 'Congratulations', 'New Baby', "Valentine's Day", "Mother's Day"],
  },
  {
    title: 'Local Delivery',
    links: ['Same-Day Delivery', 'Next-Day Delivery', 'Shop by City', 'Send Me Flowers', 'Event Pages', 'Florists', 'Best Florists Near Me'],
  },
  {
    title: 'For Florists',
    links: ['Become a BloomNation Florist', 'How BloomNation Reviews Work', 'Florist Login', 'Floral Jobs', 'Help Center'],
  },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo className="footer__logo" />
          <ul className="footer__social">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon size={19} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav className="footer__column" key={column.title} aria-label={column.title}>
            <h2 className="footer__heading">{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link}>
                  <Link to={footerHrefs[link] ?? '/'}>{link}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer__legal">
        <ul className="footer__legal-links">
          <li>
            <Link to="/terms">Terms of Service</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/cookies">Cookie Settings</Link>
          </li>
        </ul>
        <p className="footer__copyright">&copy; 2026 BloomNation Inc. All rights reserved.</p>
        <p className="footer__sister">
          Looking for flower delivery in the UK? Visit our sister brand Floom.
        </p>
      </div>
    </footer>
  )
}