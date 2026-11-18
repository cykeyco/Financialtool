// All data is fictional and hard-coded. Swap it for real parsing later.

export type ColumnMapping = {
  source: string
  field: string
  confidence: number
  reason: string
}

export type DuplicateItem = {
  id: string
  kind: 'duplicate'
  name: string
  date: string
  row: number
  amount: number
  reason: string
}

export type CategoryItem = {
  id: string
  kind: 'category'
  name: string
  date: string
  row: number
  amount: number
  reason: string
  suggested: string
  options: string[]
}

export type ReviewItem = DuplicateItem | CategoryItem

export type ImportFile = {
  name: string
  rows: number
  unreadableRows: number[]
}

export const FILES = {
  clean: { name: 'swedbank_2026-11.csv', rows: 412, unreadableRows: [] },
  withProblems: { name: 'swedbank_2026-11_export.xlsx', rows: 412, unreadableRows: [17, 98, 305] },
} satisfies Record<string, ImportFile>

/** Columns the AI matched with high confidence (≥ 95%): applied automatically. */
export const AUTO_MAPPINGS: ColumnMapping[] = [
  {
    source: 'Bokföringsdatum',
    field: 'Date',
    confidence: 1,
    reason: 'Every value is a valid date in YYYY-MM-DD format, all within November 2026.',
  },
  {
    source: 'Belopp',
    field: 'Amount',
    confidence: 0.99,
    reason: 'Numbers with two decimals, both positive and negative. The column name is Swedish for “amount”.',
  },
  {
    source: 'Text',
    field: 'Description',
    confidence: 0.98,
    reason: 'Free text with merchant names such as ICA, Vattenfall and Swish payments.',
  },
  {
    source: 'Konto',
    field: 'Account',
    confidence: 0.96,
    reason: 'One repeated value that matches the account number on your Household account.',
  },
]

/** A column the AI is unsure about (< 70%): the user decides. */
export const UNCERTAIN_MAPPING = {
  source: 'Referens',
  suggestedField: 'Note',
  confidence: 0.64,
  reason: 'Most values look like payment references: 92% are unique numbers, and none repeat across months.',
}

export const DUPLICATES: DuplicateItem[] = [
  {
    id: 'd1',
    kind: 'duplicate',
    name: 'ICA Maxi Malmö',
    date: '3 Nov 2026',
    row: 214,
    amount: -1250,
    reason: 'Same amount, date and description as row 88. Banks sometimes export a pending and a settled copy.',
  },
  {
    id: 'd2',
    kind: 'duplicate',
    name: 'Netflix',
    date: '1 Nov 2026',
    row: 12,
    amount: -149,
    reason: 'Identical to row 11. Subscriptions are rarely charged twice on the same day.',
  },
  {
    id: 'd3',
    kind: 'duplicate',
    name: 'Skånetrafiken',
    date: '6 Nov 2026',
    row: 240,
    amount: -795,
    reason: 'Same as row 239, one second apart. Likely a double export.',
  },
  {
    id: 'd4',
    kind: 'duplicate',
    name: 'Vattenfall',
    date: '8 Nov 2026',
    row: 251,
    amount: -1120,
    reason: 'Matches row 250, and this bill is already in your last import.',
  },
]

export const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'c1',
    kind: 'category',
    name: 'Swish – A. Lindqvist',
    date: '5 Nov 2026',
    row: 231,
    amount: -8500,
    reason: 'Same amount to the same person on the 5th of each month since June.',
    suggested: 'Rent',
    options: ['Rent', 'Transfer', 'Savings'],
  },
  {
    id: 'c2',
    kind: 'category',
    name: 'Klarna AB',
    date: '11 Nov 2026',
    row: 302,
    amount: -649,
    reason: 'Klarna is a payment provider, so the store behind this purchase is unknown.',
    suggested: 'Shopping',
    options: ['Shopping', 'Home', 'Clothing'],
  },
  {
    id: 'c3',
    kind: 'category',
    name: 'Swish – Malmö Padelcenter',
    date: '14 Nov 2026',
    row: 344,
    amount: -320,
    reason: 'The name suggests a sports venue. You have no category for sport yet.',
    suggested: 'Leisure',
    options: ['Leisure', 'Health', 'Other'],
  },
]

export const REVIEW_ITEMS: ReviewItem[] = [...DUPLICATES, ...CATEGORY_ITEMS]

/** Rows that are clean and need no review. */
export function readyRowCount(file: ImportFile) {
  return file.rows - REVIEW_ITEMS.length - file.unreadableRows.length
}

export function analysisSteps(file: ImportFile) {
  const categorisable = file.rows - DUPLICATES.length - file.unreadableRows.length
  return [
    { label: 'Reading file', result: `${file.rows} rows` },
    { label: 'Matching columns', result: `${AUTO_MAPPINGS.length} of ${AUTO_MAPPINGS.length + 1} matched` },
    { label: 'Looking for duplicates', result: `${DUPLICATES.length} possible` },
    {
      label: 'Categorising transactions',
      result: `${categorisable - CATEGORY_ITEMS.length} of ${categorisable}`,
    },
  ]
}

const sek = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export function formatAmount(n: number) {
  return `${n < 0 ? '−' : '+'} ${sek.format(Math.abs(n))}`
}
