/**
 * Numbers are written the Swedish way, because this is a Swedish household's money:
 * spaces between thousands, a decimal comma, and "kr" after the amount.
 *   1440000 → "1 440 000 kr"   1250.5 → "1 250,50 kr"   0.896 → "89,6 %"
 * The UI copy stays in English.
 */
const NBSP = '\u00a0' // keeps a number and its unit on one line
const THIN = '\u202f' // narrow no-break space: the Swedish thousands separator
const whole = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 })
const cents = new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** 1440000 → "1 440 000" */
export const num = (n: number) => whole.format(Math.round(n)).replace(/\s/g, THIN).replace('−', '-')

/** 1440000 → "1 440 000 kr"; negatives use a true minus sign. */
export const sek = (n: number) => `${n < 0 ? '−\u2009' : ''}${num(Math.abs(n))}${NBSP}kr`

/** Signed change: "+ 13 600 kr" / "− 2 100 kr" */
export const sekDelta = (n: number) => `${n < 0 ? '−' : '+'}\u2009${num(Math.abs(n))}${NBSP}kr`

/** Bank-statement amounts with öre: "− 1 250,00" */
export const amount = (n: number) => `${n < 0 ? '−' : '+'}\u2009${cents.format(Math.abs(n)).replace(/\s/g, THIN)}`

/** 0.896 → "89,6 %" */
export const pct = (ratio: number, digits = 1) =>
  `${(ratio * 100).toFixed(digits).replace(/\.0$/, '').replace('.', ',')}${NBSP}%`

/** Chart axes: 1440000 → "1,44 mn", 950000 → "950 tn" */
export const compact = (n: number) =>
  Math.abs(n) >= 1_000_000
    ? `${String(Number((n / 1_000_000).toFixed(2))).replace('.', ',')}${NBSP}mn`
    : `${Math.round(n / 1000)}${NBSP}tn`

/** Round to the nearest thousand: for estimates that shouldn't look more precise than they are. */
export const k = (n: number) => Math.round(n / 1000) * 1000

/** Parse what a person types into a money field: "12 400", "12400 kr", "1 250,50" → number */
export const parseMoney = (s: string) => {
  const n = Number(s.replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}
