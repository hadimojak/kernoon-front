import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Empty-state illustration for an address book with no addresses yet. */
export function EmptyAddressesIcon({ size = 180, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="100" cy="100" r="99" fill="#f2f2f2" stroke="#e4e4e4" strokeWidth="1" />
      {/* left stem + leaves */}
      <path d="M78 145c2-28 8-48 18-62" stroke="#7a9a6a" strokeWidth="1.3" fill="none" />
      <ellipse cx="70" cy="110" rx="8" ry="3.5" fill="#b7c9a4" transform="rotate(-40 70 110)" />
      <ellipse cx="74" cy="96" rx="7" ry="3" fill="#a8bc94" transform="rotate(-25 74 96)" />
      <ellipse cx="88" cy="102" rx="6.5" ry="3" fill="#b7c9a4" transform="rotate(30 88 102)" />
      {/* right stem + leaves */}
      <path d="M122 145c-2-28-8-48-18-62" stroke="#7a9a6a" strokeWidth="1.3" fill="none" />
      <ellipse cx="130" cy="110" rx="8" ry="3.5" fill="#b7c9a4" transform="rotate(40 130 110)" />
      <ellipse cx="126" cy="96" rx="7" ry="3" fill="#a8bc94" transform="rotate(25 126 96)" />
      <ellipse cx="112" cy="102" rx="6.5" ry="3" fill="#b7c9a4" transform="rotate(-30 112 102)" />
      {/* clothes */}
      <g stroke="#5c5c66" strokeWidth="1.1">
        <circle cx="78" cy="78" r="22" fill="#f3cfc4" />
        <path
          d="M66 70c6 3 12 3 18 0M64 80c8 2 16 2 24 0M68 90c6-2 12-3 18-2"
          fill="none"
        />
        <circle cx="122" cy="78" r="22" fill="#efc5bb" />
        <path
          d="M110 70c6 3 12 3 18 0M108 80c8 2 16 2 24 0M112 90c6-2 12-3 18-2"
          fill="none"
        />
      </g>
    </svg>
  )
}
