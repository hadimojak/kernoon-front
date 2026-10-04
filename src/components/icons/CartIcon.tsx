import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

export function CartIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.5 3.5h2.2l2.1 10.4a1.5 1.5 0 0 0 1.47 1.19h8.66a1.5 1.5 0 0 0 1.46-1.14l1.4-6.1H6.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19.5" r="1.4" fill="currentColor" />
      <circle cx="16.5" cy="19.5" r="1.4" fill="currentColor" />
    </svg>
  )
}