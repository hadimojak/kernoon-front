import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** featured_seasonal_and_gifts style icon */
export function GiftIcon({ size = 22, ...props }: IconProps) {
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
        d="M12 2c-1.9 2.4-3 4.7-3 6.5 0 1.9 1.3 3.5 3 3.5s3-1.6 3-3.5C15 6.7 13.9 4.4 12 2Zm-6.5 9.5c.4-2.2 1.6-4.1 3.3-5.4-.3 1.1-.5 2.2-.5 3.4 0 2.3 1.4 4.3 3.4 5.1-.9.3-1.9.4-2.9.4-1.3 0-2.4-.4-3.3-1.1v-2.4Zm13 0v2.4c-.9.7-2 1.1-3.3 1.1-1 0-2-.1-2.9-.4 2-.8 3.4-2.8 3.4-5.1 0-1.2-.2-2.3-.5-3.4 1.7 1.3 2.9 3.2 3.3 5.4ZM8.1 18.2c1.1.8 2.4 1.3 3.9 1.3s2.8-.5 3.9-1.3c.4 1.1.6 2.1.6 2.8H7.5c0-.7.2-1.7.6-2.8Z"
        fill="currentColor"
      />
    </svg>
  )
}
