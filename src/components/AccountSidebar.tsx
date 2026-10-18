import { NavLink } from 'react-router-dom'
import { AccountCircleIcon } from './icons/AccountCircleIcon'
import { CalendarTodayIcon } from './icons/CalendarTodayIcon'
import { ChevronRightIcon } from './icons/ChevronRightIcon'
import { CreditCardIcon } from './icons/CreditCardIcon'
import { GiftIcon } from './icons/GiftIcon'
import { HistoryIcon } from './icons/HistoryIcon'
import { IdCardIcon } from './icons/IdCardIcon'

const navItems = [
  { label: 'Account Info', to: '/profile', Icon: AccountCircleIcon, end: true },
  { label: 'Order History', to: '/orders', Icon: HistoryIcon },
  { label: 'Address Book', to: '/addresses', Icon: IdCardIcon },
  { label: 'Payment Methods', to: '/payment-methods', Icon: CreditCardIcon },
  { label: 'Clothes for me', to: '/clothes-for-me', Icon: GiftIcon },
  { label: 'Event Pages', to: '/events', Icon: CalendarTodayIcon },
]

export function AccountSidebar() {
  return (
    <aside className="profile-sidebar">
      <h1>My Account</h1>
      <nav aria-label="Account">
        <ul>
          {navItems.map(({ label, to, Icon, end }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive ? 'profile-nav__link is-active' : 'profile-nav__link'
                }
              >
                <span className="profile-nav__left">
                  <Icon size={22} />
                  <span>{label}</span>
                </span>
                <ChevronRightIcon size={14} className="profile-nav__chevron" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
