const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

/** 1440000 → "1,440,000" */
export const num = (n: number) => whole.format(Math.round(n))

/** 1440000 → "SEK 1,440,000"; negatives use a true minus sign. */
export const sek = (n: number) => `${n < 0 ? '− ' : ''}SEK ${num(Math.abs(n))}`

/** Signed change: "+ SEK 13,600" / "− SEK 2,100" */
export const sekDelta = (n: number) => `${n < 0 ? '−' : '+'} SEK ${num(Math.abs(n))}`

/** 0.896 → "89.6%" */
export const pct = (ratio: number, digits = 1) => `${(ratio * 100).toFixed(digits).replace(/\.0$/, '')}%`

/** 1440000 → "1.44M", 950000 → "950k" (for chart axes) */
export const compact = (n: number) =>
  Math.abs(n) >= 1_000_000 ? `${Number((n / 1_000_000).toFixed(2))}M` : `${Math.round(n / 1000)}k`

/** Round to the nearest thousand: for estimates that shouldn't look more precise than they are. */
export const k = (n: number) => Math.round(n / 1000) * 1000

/** Parse what a person types into a money field: "12 400", "12,400", "12400 kr" → 12400 */
export const parseMoney = (s: string) => {
  const n = Number(s.replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}
