import { useI18n } from '../i18n/LanguageProvider'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const { t } = useI18n()

  return (
    <img
      className={['logo', className].filter(Boolean).join(' ')}
      src="/kernoon-logo.svg"
      alt={t('brand.name')}
    />
  )
}
