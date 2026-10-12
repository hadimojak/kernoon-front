import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

export function AccountCircleIcon({ size = 22, ...props }: IconProps) {
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
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 3.5A3.25 3.25 0 1 1 12 12a3.25 3.25 0 0 1 0-6.5ZM12 20c-2.7 0-5.1-1.28-6.64-3.27.03-2.2 4.42-3.4 6.64-3.4s6.61 1.2 6.64 3.4C17.1 18.72 14.7 20 12 20Z"
        fill="currentColor"
      />
    </svg>
  )
}
