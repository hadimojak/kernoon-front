import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

export function IdCardIcon({ size = 22, ...props }: IconProps) {
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
        d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2Zm0 14H4V6h16v12ZM9 9.5A1.75 1.75 0 1 0 9 13a1.75 1.75 0 0 0 0-3.5ZM6.5 16.25c0-1.17 2.33-1.75 2.5-1.75s2.5.58 2.5 1.75V17h-5v-.75ZM13 9h5v1.5h-5V9Zm0 3h5v1.5h-5V12Zm0 3h3.5V16.5H13V15Z"
        fill="currentColor"
      />
    </svg>
  )
}
