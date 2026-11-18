import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const HomeIcon = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 16 16" {...base} strokeWidth={1.6} {...p}>
    <path d="M2 7.5 8 3l6 4.5V13H2z" />
  </svg>
)
export const GridIcon = (p: P) => (
  <svg width="16" height="16" viewBox="0 0 16 16" {...base} {...p}>
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
)
export const DocIcon = (p: P) => (
  <svg width="16" height="16" viewBox="0 0 16 16" {...base} {...p}>
    <path d="M4 2h6l3 3v9H4z" />
    <path d="M7 8h4M7 11h4" />
  </svg>
)
export const PieIcon = (p: P) => (
  <svg width="16" height="16" viewBox="0 0 16 16" {...base} {...p}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 2v6l4 3" />
  </svg>
)
export const TrendIcon = (p: P) => (
  <svg width="16" height="16" viewBox="0 0 16 16" {...base} {...p}>
    <path d="M2 13h12" />
    <path d="M3 10l3-3 3 2 4-5" />
  </svg>
)
export const ImportIcon = (p: P) => (
  <svg width="16" height="16" viewBox="0 0 16 16" {...base} {...p}>
    <path d="M8 2v8M5 7l3 3 3-3" />
    <path d="M3 12v2h10v-2" />
  </svg>
)
export const UploadIcon = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 22 22" {...base} strokeWidth={1.6} {...p}>
    <path d="M11 15V4M6.5 8.5 11 4l4.5 4.5" />
    <path d="M4 15v3h14v-3" />
  </svg>
)
export const ArrowRightIcon = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 14 14" {...base} strokeWidth={1.4} {...p}>
    <path d="M2 7h10M9 4l3 3-3 3" />
  </svg>
)
export const ChevronDownIcon = (p: P) => (
  <svg width="12" height="12" viewBox="0 0 12 12" {...base} {...p}>
    <path d="M3 4.5 6 7.5 9 4.5" />
  </svg>
)
export const CheckIcon = (p: P) => (
  <svg width="12" height="12" viewBox="0 0 12 12" {...base} strokeWidth={1.8} {...p}>
    <path d="M2.5 6.2 5 8.5 9.5 3.5" />
  </svg>
)
export const AlertIcon = (p: P) => (
  <svg width="18" height="18" viewBox="0 0 18 18" {...base} strokeWidth={1.6} {...p}>
    <circle cx="9" cy="9" r="7.5" />
    <path d="M9 5.5v4.5M9 12.5v.01" />
  </svg>
)

/** Filled green circle with a white tick. */
export const DoneBadge = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="9" className="fill-accent" />
    <path
      d="M5.5 9.3 7.8 11.5 12.5 6.6"
      stroke="#fff"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
