import { motion } from 'motion/react'
import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { num, parseMoney } from '../lib/format'

/** Page title row: title + one-line description on the left, actions on the right. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[36px] leading-[1.1] font-light tracking-[-0.02em]">{title}</h1>
        <p className="text-muted">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

/** Section heading with an optional right-hand slot (a link, a total). */
export function SectionTitle({ id, children, aside }: { id?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 id={id} className="text-[15px] font-semibold">
        {children}
      </h2>
      {aside && <div className="text-[13px] text-muted">{aside}</div>}
    </div>
  )
}

export function ProgressBar({
  value,
  label,
  tone = 'ink',
  height = 8,
}: {
  value: number // 0–1, may exceed 1
  label: string
  tone?: 'ink' | 'accent' | 'warn'
  height?: number
}) {
  const color = { ink: 'bg-violet', accent: 'bg-lime', warn: 'bg-orange' }[tone]
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="overflow-hidden rounded-full bg-track"
      style={{ height }}
    >
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={false}
        animate={{ width: `${Math.min(1, Math.max(0, value)) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

/**
 * Money input that shows "1,440,000" while reading and a plain number while typing.
 * Commits on every keystroke so totals update live.
 */
export function MoneyField({
  label,
  value,
  onChange,
  hideLabel,
  className = '',
}: {
  label: string
  value: number
  onChange: (n: number) => void
  hideLabel?: boolean
  className?: string
}) {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-[13px] text-muted'}>
        {label}
      </label>
      <div className="flex h-10 items-center rounded-lg border border-line bg-white px-3 transition-colors focus-within:border-ink hover:border-line-strong">
        <span className="mr-2 text-[13px] text-subtle" aria-hidden="true">
          SEK
        </span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-right text-base outline-none"
          value={draft ?? num(value)}
          onFocus={(e) => {
            // Show the raw number and select it, so typing replaces the old value.
            const el = e.currentTarget
            setDraft(String(value))
            requestAnimationFrame(() => el.select())
          }}
          onBlur={() => setDraft(null)}
          onChange={(e) => {
            setDraft(e.target.value)
            onChange(parseMoney(e.target.value))
          }}
        />
      </div>
    </div>
  )
}

/** Plain number input with a unit suffix ("years", "%"). */
export function NumberField({
  label,
  value,
  onChange,
  unit,
  step = 1,
  min,
  max,
  hint,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  unit: string
  step?: number
  min?: number
  max?: number
  hint?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] text-muted">
        {label}
      </label>
      <div className="flex h-10 items-center rounded-lg border border-line bg-white px-3 transition-colors focus-within:border-ink hover:border-line-strong">
        <input
          id={id}
          type="number"
          className="w-full min-w-0 bg-transparent text-base outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          value={Number.isFinite(value) ? value : ''}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        />
        <span className="ml-2 text-[13px] whitespace-nowrap text-subtle">{unit}</span>
      </div>
      {hint && <span className="text-xs text-subtle">{hint}</span>}
    </div>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (s: string) => void
  placeholder?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] text-muted">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y rounded-lg border border-line bg-white px-3 py-2 text-base outline-none transition-colors placeholder:text-faint focus:border-ink hover:border-line-strong"
      />
    </div>
  )
}

/** Small label + big number. */
export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className={`text-[22px] font-semibold tracking-[-0.01em] ${tone ?? ''}`}>{value}</span>
      {sub && <span className="text-xs text-subtle">{sub}</span>}
    </div>
  )
}
