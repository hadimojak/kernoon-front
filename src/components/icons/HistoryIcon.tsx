import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

export function HistoryIcon({ size = 22, ...props }: IconProps) {
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
        d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 1.91 4.76l-1.43 1.43A8.96 8.96 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8H12Z"
        fill="currentColor"
      />
    </svg>
  )
}
