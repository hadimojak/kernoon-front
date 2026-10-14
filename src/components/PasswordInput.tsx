import { useState, type InputHTMLAttributes } from 'react'
import { VisibilityIcon } from './icons/VisibilityIcon'
import { VisibilityOffIcon } from './icons/VisibilityOffIcon'
import { useI18n } from '../i18n/useI18n'
import '../styles/components/PasswordInput.css'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        {...props}
        className={['password-field__input', className].filter(Boolean).join(' ')}
        type={visible ? 'text' : 'password'}
      />
      <button
        className="password-field__toggle"
        type="button"
        aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <VisibilityOffIcon size={20} /> : <VisibilityIcon size={20} />}
      </button>
    </div>
  )
}
