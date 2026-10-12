import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Map pin from product_page.svg */
export function LocationPinIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size * (18 / 14)}
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M7 9C7.481 9 7.893 8.8 8.236 8.5C8.579 8.1 8.75 7.7 8.75 7.2C8.75 6.7 8.579 6.3 8.236 5.9C7.893 5.6 7.481 5.4 7 5.4C6.519 5.4 6.107 5.6 5.764 5.9C5.421 6.3 5.25 6.7 5.25 7.2C5.25 7.7 5.421 8.1 5.764 8.5C6.107 8.8 6.519 9 7 9ZM7 15.6C8.779 13.9 10.099 12.4 10.959 11C11.82 9.7 12.25 8.4 12.25 7.4C12.25 5.7 11.743 4.4 10.73 3.4C9.716 2.3 8.473 1.8 7 1.8C5.527 1.8 4.284 2.3 3.27 3.4C2.257 4.4 1.75 5.7 1.75 7.4C1.75 8.4 2.18 9.7 3.041 11C3.901 12.4 5.221 13.9 7 15.6ZM7 18C4.652 15.9 2.898 14 1.739 12.3C.58 10.5 0 8.9 0 7.4C0 5.1.704 3.3 2.111 2C3.518.7 5.148 0 7 0C8.852 0 10.482.7 11.889 2C13.296 3.3 14 5.1 14 7.4C14 8.9 13.42 10.5 12.261 12.3C11.102 14 9.348 15.9 7 18Z"
        fill="currentColor"
      />
    </svg>
  )
}
