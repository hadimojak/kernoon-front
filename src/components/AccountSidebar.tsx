import { NavLink } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/translations'
import { AccountCircleIcon } from './icons/AccountCircleIcon'
import { ChevronRightIcon } from './icons/ChevronRightIcon'
import { CreditCardIcon } from './icons/CreditCardIcon'
import { HistoryIcon } from './icons/HistoryIcon'
import { IdCardIcon } from './icons/IdCardIcon'

const navItems: {
  label: MessageKey
  to: string
  Icon: typeof AccountCircleIcon
  end?: boolean
}[] = [
  { label: 'account.info', to: '/profile', Icon: AccountCircleIcon, end: true },
  { label: 'account.orders', to: '/orders', Icon: HistoryIcon },
  { label: 'account.addresses', to: '/addresses', Icon: IdCardIcon },
  { label: 'account.payments', to: '/payment-methods', Icon: CreditCardIcon },
]

export function AccountSidebar() {
  const { t } = useI18n()

  return (
    <aside className="profile-sidebar">
      <h1>{t('account.title')}</h1>
      <nav aria-label={t('account.nav')}>
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
                  <span>{t(label)}</span>
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
