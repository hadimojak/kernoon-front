import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Material-style add icon used on addresses page */
export function AddIcon({ size = 18, ...props }: IconProps) {
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
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" fill="currentColor" />
    </svg>
  )
}
