import type React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

/** Empty-state illustration for orders with no clothes yet. */
export function EmptyOrdersIcon({ size = 200, ...props }: IconProps) {
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
      {/* table line */}
      <path d="M62 148h76" stroke="#6a6a72" strokeWidth="1.4" strokeLinecap="round" />
      {/* vase */}
      <ellipse cx="100" cy="138" rx="22" ry="18" fill="#d8d8d8" />
      <ellipse cx="100" cy="128" rx="18" ry="7" fill="#cfcfcf" />
      {/* stems */}
      <path d="M100 128c-2-18-8-32-18-44" stroke="#7a9a6a" strokeWidth="1.2" fill="none" />
      <path d="M100 128c2-16 10-30 20-42" stroke="#7a9a6a" strokeWidth="1.2" fill="none" />
      <path d="M100 128c0-20 0-36 0-48" stroke="#7a9a6a" strokeWidth="1.2" fill="none" />
      {/* leaves */}
      <ellipse cx="72" cy="92" rx="7" ry="3.5" fill="#b7c9a4" transform="rotate(-35 72 92)" />
      <ellipse cx="128" cy="88" rx="7" ry="3.5" fill="#b7c9a4" transform="rotate(40 128 88)" />
      <ellipse cx="84" cy="78" rx="6" ry="3" fill="#a8bc94" transform="rotate(-20 84 78)" />
      <ellipse cx="118" cy="74" rx="6" ry="3" fill="#a8bc94" transform="rotate(25 118 74)" />
      <ellipse cx="95" cy="68" rx="5.5" ry="2.8" fill="#b7c9a4" transform="rotate(-55 95 68)" />
      <ellipse cx="108" cy="66" rx="5.5" ry="2.8" fill="#b7c9a4" transform="rotate(50 108 66)" />
      {/* clothes */}
      <g stroke="#5c5c66" strokeWidth="1.1">
        <circle cx="82" cy="78" r="16" fill="#f3cfc4" />
        <path d="M74 72c4 2 8 2 12 0M72 80c5 1 10 1 15 0M76 88c4-1 8-2 12-1" fill="none" />
        <circle cx="118" cy="76" r="15" fill="#efc5bb" />
        <path d="M110 70c4 2 8 2 12 0M109 78c5 1 10 1 14 0M112 86c4-1 7-2 11-1" fill="none" />
        <circle cx="100" cy="58" r="17" fill="#f6d5cb" />
        <path d="M91 52c5 2 10 2 15 0M89 60c6 1 12 1 18 0M93 68c5-1 9-2 14-1" fill="none" />
        <circle cx="70" cy="100" r="11" fill="#f0c8be" />
        <path d="M64 96c3 1 6 1 9 0M63 101c4 1 7 1 11 0" fill="none" />
        <circle cx="130" cy="98" r="11" fill="#f0c8be" />
        <path d="M124 94c3 1 6 1 9 0M123 99c4 1 7 1 11 0" fill="none" />
      </g>
    </svg>
  )
}
