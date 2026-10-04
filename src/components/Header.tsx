import { Link } from 'react-router-dom'
import { CaretIcon } from './icons/CaretIcon'
import { CartIcon } from './icons/CartIcon'
import { UkFlagIcon } from './icons/UkFlagIcon'
import { Logo } from './Logo'
import './Header.css'

const utilityLinks = [
  { label: 'Become a BloomNation Florist', to: '/florist' },
  { label: 'Florist Login', to: '/florist/login' },
  { label: 'Customer Login', to: '/login' },
]

const navItems = [
  { label: 'Flowers', to: '/flowers' },
  { label: 'Same-Day', to: '/same-day' },
  { label: 'Next-Day', to: '/next-day' },
  { label: 'Occasions', to: '/occasions' },
  { label: 'Sympathy', to: '/sympathy' },
  { label: 'Shop by City', to: '/city' },
]

export function Header() {
  return (
    <header className="header">
      <div className="header__bar">
        <Link className="header__logo" to="/" aria-label="BloomNation home">
          <Logo />
        </Link>

        <div className="header__utility">
          <ul className="header__utility-list">
            {utilityLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link className="header__cart" to="/cart">
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
          <li>
            <Link className="header__nav-link" to="/uk">
              <UkFlagIcon className="header__flag" size={18} />
              <span>UK Flower Delivery</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}