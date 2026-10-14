import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretIcon } from './icons/CaretIcon'
import { CartIcon } from './icons/CartIcon'
import { Logo } from './Logo'
import '../styles/components/Header.css'

const guestUtilityLinks = [
  { label: 'Become a BloomNation Florist', to: '/florist' },
  { label: 'Florist Login', to: '/florist/login' },
  { label: 'Customer Login', to: '/login' },
]

const loggedInUtilityLinks = [
  { label: 'Become a BloomNation Florist', to: '/florist' },
  { label: 'Florist Login', to: '/florist/login' },
]

const navItems = [
  { label: 'Flowers', to: '/flowers' },
  { label: 'Same-Day', to: '/same-day' },
  { label: 'Next-Day', to: '/next-day' },
  { label: 'Occasions', to: '/occasions' },
  { label: 'Sympathy', to: '/sympathy' },
  { label: 'Shop by City', to: '/city' },
]

type HeaderProps = {
  userName?: string
  onLogout?: () => void
}

export function Header({ userName, onLogout }: HeaderProps) {
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
        <Link className="header__logo" to={userName ? '/home' : '/'} aria-label="BloomNation home">
          <Logo />
        </Link>

        <div className="header__utility">
          <ul className="header__utility-list">
            {utilityLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
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
                  <span>Hi, {userName}</span>
                  <CaretIcon className="header__caret" size={9} />
                </button>
                {menuOpen ? (
                  <ul className="header__account-menu" role="menu">
                    <li role="none">
                      <Link role="menuitem" to="/profile" onClick={() => setMenuOpen(false)}>
                        My Account
                      </Link>
                    </li>
                    <li role="none">
                      <Link role="menuitem" to="/orders" onClick={() => setMenuOpen(false)}>
                        Orders
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
                        Log out
                      </Link>
                    </li>
                  </ul>
                ) : null}
              </li>
            ) : null}
            <li>
              <Link className="header__cart" to="/checkout">
                <CartIcon size={18} />
                <span>Cart</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <nav className="header__nav" aria-label="Primary">
        <ul className="header__nav-list">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link className="header__nav-link" to={item.to}>
                {item.label}
                <CaretIcon className="header__caret" size={9} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
