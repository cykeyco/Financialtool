import type { ButtonHTMLAttributes } from 'react'

/**
 * Button hierarchy
 *
 * primary   — Level 1. The one action that moves the task forward (Import, Add entry, Accept all).
 *             At most one per view or per card. Blind Forest on White Chalk.
 * secondary — Level 2. Alternatives that sit beside a primary (Back, Keep both, Undo import).
 *             Radiant Dawn fill, Blind Forest text.
 * ghost     — Level 3. Low-emphasis tools inside a section. Text only, Dawn on hover.
 * link      — Inline navigation inside a sentence or a section header. Kyuri Green, underlined.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-forest text-chalk hover:bg-kyuri active:bg-[#1a2600] disabled:bg-forest/25 disabled:text-chalk disabled:cursor-not-allowed',
  secondary:
    'bg-dawn text-forest hover:bg-[#e3d5b8] active:bg-line-strong disabled:bg-line-soft disabled:text-faint disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-ink-2 hover:bg-dawn/60 hover:text-ink',
  link: 'bg-transparent text-kyuri underline underline-offset-3 decoration-kyuri/30 hover:decoration-kyuri !px-0 !h-auto !rounded-none',
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
