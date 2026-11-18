import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md'

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-white hover:bg-[#2b2d31] active:bg-black disabled:bg-line disabled:text-subtle disabled:cursor-not-allowed',
  secondary: 'bg-white text-ink border border-line hover:bg-canvas active:bg-line-soft',
  ghost: 'bg-transparent text-ink-2 hover:bg-canvas hover:text-ink',
  link: 'bg-transparent text-accent hover:text-accent-strong underline-offset-2 hover:underline !px-0 !h-auto',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 cursor-pointer ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
