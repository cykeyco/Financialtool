import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md'

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-white hover:bg-[#2b2d31] active:bg-black disabled:bg-line disabled:text-subtle disabled:cursor-not-allowed',
  secondary: 'bg-white text-ink border border-[#d4d4d8] hover:border-faint active:bg-line-soft',
  ghost: 'bg-transparent text-ink-2 hover:bg-canvas hover:text-ink',
  link: 'bg-transparent text-ink underline underline-offset-3 decoration-line hover:decoration-ink !px-0 !h-auto !rounded-none',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
