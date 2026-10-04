import { BrandMark } from './icons/BrandMark'
import { Wordmark } from './icons/Wordmark'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={['logo', className].filter(Boolean).join(' ')}>
      <BrandMark className="logo__mark" size={26} />
      <Wordmark className="logo__word" size={132} />
    </span>
  )
}