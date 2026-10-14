import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
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

const columns: { title: MessageKey; links: { key: MessageKey; to: string }[] }[] = [
  {
    title: 'footer.company',
    links: [
      { key: 'footer.about', to: '/about-us' },
      { key: 'footer.blog', to: '/blog' },
      { key: 'footer.news', to: '/news' },
      { key: 'footer.shipping', to: '/delivery-fees' },
      { key: 'footer.contact', to: '/contact-us' },
      { key: 'footer.careers', to: '/careers' },
    ],
  },
  {
    title: 'footer.shop',
    links: [
      { key: 'nav.newborn', to: '/newborn' },
      { key: 'nav.toddler', to: '/toddler' },
      { key: 'nav.kids', to: '/kids' },
      { key: 'nav.sleepwear', to: '/sleepwear' },
      { key: 'nav.outerwear', to: '/outerwear' },
      { key: 'nav.sizes', to: '/sizes' },
    ],
  },
  {
    title: 'footer.help',
    links: [
      { key: 'footer.sizeGuide', to: '/sizes' },
      { key: 'footer.shipping', to: '/delivery-fees' },
      { key: 'footer.helpCenter', to: '/help' },
      { key: 'footer.reviews', to: '/reviews' },
      { key: 'footer.contact', to: '/contact-us' },
    ],
  },
  {
    title: 'footer.account',
    links: [
      { key: 'header.login', to: '/login' },
      { key: 'header.orders', to: '/orders' },
      { key: 'header.sell', to: '/florist' },
      { key: 'header.sellerLogin', to: '/florist/login' },
    ],
  },
]

export function Footer() {
  const { t } = useI18n()

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
          <nav className="footer__column" key={column.title} aria-label={t(column.title)}>
            <h2 className="footer__heading">{t(column.title)}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.key + link.to}>
                  <Link to={link.to}>{t(link.key)}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer__legal">
        <ul className="footer__legal-links">
          <li>
            <Link to="/terms">{t('footer.terms')}</Link>
          </li>
          <li>
            <Link to="/privacy">{t('footer.privacy')}</Link>
          </li>
          <li>
            <Link to="/cookies">{t('footer.cookies')}</Link>
          </li>
        </ul>
        <p className="footer__copyright">{t('footer.copyright')}</p>
        <p className="footer__sister">{t('footer.note')}</p>
      </div>
    </footer>
  )
}