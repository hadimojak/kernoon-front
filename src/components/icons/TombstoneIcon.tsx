import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Tombstone from product_page.svg */
export function TombstoneIcon({ size = 16, ...props }: IconProps) {
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
        d="M15.5 14H.5C.225 14 0 14.2 0 14.5V15.5C0 15.8.225 16 .5 16H15.5C15.775 16 16 15.8 16 15.5V14.5C16 14.2 15.775 14 15.5 14ZM14 6C14 2.7 11.312 0 8 0C4.688 0 2 2.7 2 6V13H14V6ZM11 5.8C11 6 10.775 6.2 10.5 6.2H8.75V10.2C8.75 10.5 8.525 10.8 8.25 10.8H7.75C7.475 10.8 7.25 10.5 7.25 10.2V6.2H5.5C5.225 6.2 5 6 5 5.8V5.2C5 5 5.225 4.8 5.5 4.8H7.25V3.2C7.25 3 7.475 2.8 7.75 2.8H8.25C8.525 2.8 8.75 3 8.75 3.2V4.8H10.5C10.775 4.8 11 5 11 5.2V5.8Z"
        fill="currentColor"
      />
    </svg>
  )
}
