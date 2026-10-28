import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { canOpenSellerPanel, clearSession, sessionDisplayName } from '../auth/session'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import { CaretIcon } from './icons/CaretIcon'
import { CartIcon } from './icons/CartIcon'
import { Logo } from './Logo'
import '../styles/components/Header.css'

const guestUtilityLinks: { key: MessageKey; to: string; state?: { from: string } }[] = [
  { key: 'header.sell', to: '/sell' },
  { key: 'header.sellerLogin', to: '/sell/login' },
  { key: 'header.sellerPanel', to: '/seller-panel' },
  { key: 'header.orders', to: '/login', state: { from: '/orders' } },
  { key: 'header.login', to: '/login' },
]

const loggedInUtilityLinks: { key: MessageKey; to: string; state?: { from: string } }[] = [
  { key: 'header.sell', to: '/sell' },
  { key: 'header.sellerPanel', to: '/seller-panel' },
]

const navItems: { key: MessageKey; to: string }[] = [
  { key: 'nav.newborn', to: '/newborn' },
  { key: 'nav.toddler', to: '/toddler' },
  { key: 'nav.kids', to: '/kids' },
  { key: 'nav.sleepwear', to: '/sleepwear' },
  { key: 'nav.outerwear', to: '/outerwear' },
  { key: 'nav.sizes', to: '/sizes' },
]

export function Header() {
  const { t, toggle } = useI18n()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(() => sessionDisplayName())
  const [sellerPanel, setSellerPanel] = useState(() => canOpenSellerPanel())
  const menuRef = useRef<HTMLLIElement>(null)
  const utilityLinks = (userName ? loggedInUtilityLinks : guestUtilityLinks).filter(
    (link) => link.key !== 'header.sellerPanel' || sellerPanel,
  )

  useEffect(() => {
    function syncSession() {
      setUserName(sessionDisplayName())
      setSellerPanel(canOpenSellerPanel())
    }
    syncSession()
    window.addEventListener('storage', syncSession)
    window.addEventListener('kernoon-session', syncSession)
    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('kernoon-session', syncSession)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  function logout() {
    clearSession()
    setUserName(null)
    setSellerPanel(false)
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__bar">
        <Link className="header__logo" to={userName ? '/home' : '/'} aria-label={t('brand.home')}>
          <Logo />
        </Link>

        <div className="header__utility">
          <ul className="header__utility-list">
            {utilityLinks.map((link) => (
              <li key={link.key}>
                <NavLink
                  to={link.to}
                  state={link.state}
                  end
                  className={({ isActive }) => (isActive ? 'is-current' : undefined)}
                >
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
            {userName ? (
              <li className="header__account" ref={menuRef}>
                <button
                  className="header__account-button"
                  type="button"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span>{t('header.hi', { name: userName })}</span>
                  <CaretIcon className="header__caret" size={9} />
                </button>
                {menuOpen ? (
                  <ul className="header__account-menu" role="menu">
                    {sellerPanel ? (
                      <li role="none">
                        <Link
                          role="menuitem"
                          to="/seller-panel"
                          onClick={() => setMenuOpen(false)}
                        >
                          {t('header.sellerPanel')}
                        </Link>
                      </li>
                    ) : null}
                    <li role="none">
                      <Link role="menuitem" to="/profile" onClick={() => setMenuOpen(false)}>
                        {t('header.account')}
                      </Link>
                    </li>
                    <li role="none">
                      <Link role="menuitem" to="/orders" onClick={() => setMenuOpen(false)}>
                        {t('header.orders')}
                      </Link>
                    </li>
                    <li role="none">
                      <button
                        className="header__logout"
                        role="menuitem"
                        type="button"
                        onClick={logout}
                      >
                        {t('header.logout')}
                      </button>
                    </li>
                  </ul>
                ) : null}
              </li>
            ) : null}
            <li>
              <button className="header__lang" type="button" onClick={toggle} aria-label={t('lang.label')}>
                {t('lang.switch')}
              </button>
            </li>
            <li>
              <Link className="header__cart" to="/checkout">
                <CartIcon size={18} />
                <span>{t('header.cart')}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <nav className="header__nav" aria-label={t('nav.primary')}>
        <ul className="header__nav-list">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link className="header__nav-link" to={item.to}>
                {t(item.key)}
                <CaretIcon className="header__caret" size={9} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
