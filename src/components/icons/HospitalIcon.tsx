import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Hospital / medical building icon from product_page.svg style */
export function HospitalIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9 1.2 2.5 6.2V16.5h5.2v-4.2h2.6v4.2h5.2V6.2L9 1.2Zm1.1 6.3h1.4v1.4h1.4v1.4h-1.4v1.4H10.1v-1.4H8.7V8.9h1.4V7.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
