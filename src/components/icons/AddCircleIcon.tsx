import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Material-style add_circle icon from payment_methods_page design */
export function AddCircleIcon({ size = 18, ...props }: IconProps) {
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
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z"
        fill="currentColor"
      />
    </svg>
  )
}
