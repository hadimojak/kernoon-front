import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/LanguageProvider'
import type { MessageKey } from '../i18n/translations'
import { CaretIcon } from './icons/CaretIcon'
import { CartIcon } from './icons/CartIcon'
import { Logo } from './Logo'
import '../styles/components/Header.css'

const guestUtilityLinks: { key: MessageKey; to: string }[] = [
  { key: 'header.sell', to: '/florist' },
  { key: 'header.sellerLogin', to: '/florist/login' },
  { key: 'header.login', to: '/login' },
]

const loggedInUtilityLinks: { key: MessageKey; to: string }[] = [
  { key: 'header.sell', to: '/florist' },
  { key: 'header.sellerLogin', to: '/florist/login' },
]

const navItems: { key: MessageKey; to: string }[] = [
  { key: 'nav.newborn', to: '/newborn' },
  { key: 'nav.toddler', to: '/toddler' },
  { key: 'nav.kids', to: '/kids' },
  { key: 'nav.sleepwear', to: '/sleepwear' },
  { key: 'nav.outerwear', to: '/outerwear' },
  { key: 'nav.sizes', to: '/sizes' },
]

type HeaderProps = {
  userName?: string
  onLogout?: () => void
}

export function Header({ userName, onLogout }: HeaderProps) {
  const { t, toggle } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLLIElement>(null)
  const utilityLinks = userName ? loggedInUtilityLinks : guestUtilityLinks

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
                <Link to={link.to}>{t(link.key)}</Link>
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
                      <Link
                        role="menuitem"
                        to="/"
                        onClick={() => {
                          setMenuOpen(false)
                          onLogout?.()
                        }}
                      >
                        {t('header.logout')}
                      </Link>
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
