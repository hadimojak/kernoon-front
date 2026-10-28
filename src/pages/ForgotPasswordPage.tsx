import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useI18n } from '../i18n/useI18n'

export default function ForgotPasswordPage() {
  const { t } = useI18n()

  return (
    <AuthLayout title={t('auth.forgotTitle')} subtitle={t('auth.forgotLead')}>
      <p className="auth-card__subtitle">{t('auth.forgotHint')}</p>
      <div className="auth-links">
        <Link to="/login">{t('auth.login')}</Link>
        <Link to="/signup">{t('auth.signupLink')}</Link>
      </div>
    </AuthLayout>
  )
}
