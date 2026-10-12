import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Right-pointing caret matching profile_page.svg caret style */
export function ChevronRightIcon({ size = 12, ...props }: IconProps) {
  return (
    <svg
      width={size * (7.5 / 12)}
      height={size}
      viewBox="0 0 7.5 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M1.5 1.5 6 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
