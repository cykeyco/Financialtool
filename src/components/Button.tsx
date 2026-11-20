import type { ButtonHTMLAttributes } from 'react'

/**
 * Button hierarchy
 *
 * primary   — Level 1. The one action that moves the task forward (Import, Add entry, Skip this row).
 *             At most one per view or per card. Lime fill, near-black text (16:1) in both themes.
 * secondary — Level 2. Alternatives that sit beside a primary (Back, Keep both, Undo import).
 *             Raised dark fill with a hairline, light text (12:1).
 * ghost     — Level 3. Low-emphasis tools inside a section. Text only, faint fill on hover.
 * link      — Inline navigation inside a sentence or a section header. Accent ink, underlined.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-lime text-black shadow-[inset_0_0_0_1px_var(--color-lime-edge)] hover:bg-lime-hover active:bg-[#c9ea6e] disabled:bg-primary-off disabled:text-primary-off-ink disabled:shadow-none disabled:cursor-not-allowed',
  secondary:
    'bg-raised text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-raised-hover active:bg-line-strong disabled:bg-line-soft disabled:text-faint disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-ink-2 hover:bg-raised hover:text-ink',
  link: 'bg-transparent text-accent underline underline-offset-3 decoration-accent/35 hover:decoration-accent !px-0 !h-auto !rounded-none',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-[13px]',
  md: 'h-10 px-4.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: Size }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
