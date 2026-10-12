import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Folded map from product_page.svg */
export function MapIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10.667 16L5.333 14.1L1.2 15.7C.904 15.9.63 15.8.378 15.6C.126 15.4 0 15.2 0 14.9V2.4C0 2.3.056 2.1.167 1.9C.278 1.8.43 1.7.622 1.6L5.333 0L10.667 1.9L14.8.3C15.096.1 15.37.2 15.622.4C15.874.6 16 .8 16 1.1V13.6C16 13.7 15.944 13.9 15.833 14.1C15.722 14.2 15.57 14.3 15.378 14.4L10.667 16ZM9.778 13.8V3.4L6.222 2.2V12.6L9.778 13.8ZM11.556 13.8L14.222 12.9V2.4L11.556 3.4V13.8ZM1.778 13.6L4.444 12.6V2.2L1.778 3.1V13.6Z"
        fill="currentColor"
      />
    </svg>
  )
}
