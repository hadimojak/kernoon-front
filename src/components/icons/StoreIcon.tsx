import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

export function StoreIcon({ size = 14, ...props }: IconProps) {
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
        d="M4 10.5 5.2 5.5h13.6L20 10.5M6 10.5v8h12v-8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M4 10.5h16M10 18.5v-4h4v4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}
