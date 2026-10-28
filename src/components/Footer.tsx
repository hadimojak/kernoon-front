import { Link } from 'react-router-dom'
import { canOpenSellerPanel, readSessionUser } from '../auth/session'
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

const columns: {
  title: MessageKey
  links: { key: MessageKey; to: string }[]
  split?: boolean
}[] = [
  {
    title: 'footer.company',
    links: [
      { key: 'footer.about', to: '/about-us' },
      { key: 'footer.blog', to: '/blog' },
      { key: 'footer.news', to: '/news' },
      { key: 'footer.careers', to: '/careers' },
      { key: 'footer.contact', to: '/contact-us' },
    ],
  },
  {
    title: 'footer.shop',
    split: true,
    links: [
      { key: 'nav.all', to: '/all' },
      { key: 'nav.newborn', to: '/newborn' },
      { key: 'nav.toddler', to: '/toddler' },
      { key: 'nav.kids', to: '/kids' },
      { key: 'nav.sleepwear', to: '/sleepwear' },
      { key: 'nav.outerwear', to: '/outerwear' },
      { key: 'nav.sizes', to: '/sizes' },
    ],
  },
  {
    title: 'footer.account',
    links: [
      { key: 'header.login', to: '/login' },
      { key: 'header.account', to: '/profile' },
      { key: 'header.orders', to: '/orders' },
      { key: 'header.sell', to: '/sell' },
      { key: 'header.sellerLogin', to: '/sell/login' },
      { key: 'header.sellerPanel', to: '/seller-panel' },
    ],
  },
]

export function Footer() {
  const { t } = useI18n()
  const signedIn = Boolean(readSessionUser())
  const sellerPanel = canOpenSellerPanel()

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

        {columns.map((column) => {
          const links = column.links.filter((link) => {
            if (link.key === 'header.sellerPanel') return sellerPanel
            if (link.key === 'header.login' || link.key === 'header.sellerLogin') {
              return !signedIn
            }
            if (link.key === 'header.account') return signedIn
            return true
          })

          return (
            <nav
              className={column.split ? 'footer__column footer__column--split' : 'footer__column'}
              key={column.title}
              aria-label={t(column.title)}
            >
              <h2 className="footer__heading">{t(column.title)}</h2>
              <ul>
                {links.map((link) => {
                  const needsLogin =
                    !signedIn &&
                    (link.key === 'header.orders' || link.key === 'header.account')
                  return (
                    <li key={link.key + link.to}>
                      <Link
                        to={needsLogin ? '/login' : link.to}
                        state={needsLogin ? { from: link.to } : undefined}
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )
        })}
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