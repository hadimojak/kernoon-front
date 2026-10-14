import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

export function VisibilityIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.2 12S6 6.5 12 6.5 21.8 12 21.8 12 18 17.5 12 17.5 2.2 12 2.2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  )
}
