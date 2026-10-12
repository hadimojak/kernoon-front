import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

export function StarIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        d="m12 2.8 2.4 5.7 6.2.6-4.7 4.1 1.4 6-5.3-3.2-5.3 3.2 1.4-6L3.4 9.1l6.2-.6L12 2.8Z"
      />
    </svg>
  )
}
