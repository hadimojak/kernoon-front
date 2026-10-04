import { Link } from 'react-router-dom'
import { FacebookIcon } from './icons/FacebookIcon'
import { InstagramIcon } from './icons/InstagramIcon'
import { LinkedInIcon } from './icons/LinkedInIcon'
import { PinterestIcon } from './icons/PinterestIcon'
import { XIcon } from './icons/XIcon'
import { YouTubeIcon } from './icons/YouTubeIcon'
import { Logo } from './Logo'
import './Footer.css'

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'X', href: 'https://x.com', Icon: XIcon },
  { label: 'Pinterest', href: 'https://pinterest.com', Icon: PinterestIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTubeIcon },
]

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
                  <Link to="/">{link}</Link>
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