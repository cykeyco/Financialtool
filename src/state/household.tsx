/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'

// ---------- Types ----------

export type AccountKind = 'cash' | 'investment' | 'pension' | 'other'
export type Account = { id: string; name: string; kind: AccountKind; last: number; current: number }
export type Category = { id: string; name: string; budget: number; spent: number; note: string }
export type Goal = { id: string; name: string; target: number; saved: number; monthly: number }

export type Household = {
  month: string
  accounts: Account[]
  liabilities: { name: string; last: number; current: number }
  income: { salary: number; other: number }
  categories: Category[]
  goals: Goal[]
  retirement: {
    age: number
    retireAge: number
    monthly: number
    returnPct: number
    inflationPct: number
    goal: number
  }
  notes: { thisMonth: string; nextMonth: string }
  savedAt: string | null
}

// ---------- Sample data (fictional) ----------

export const SAMPLE: Household = {
  month: 'November 2026',
  accounts: [
    { id: 'everyday', name: 'Everyday account', kind: 'cash', last: 38200, current: 45000 },
    { id: 'savings', name: 'Savings account', kind: 'cash', last: 355000, current: 360000 },
    { id: 'isk', name: 'Investment account (ISK)', kind: 'investment', last: 863200, current: 860000 },
    { id: 'pension', name: 'Private pension', kind: 'pension', last: 375000, current: 380000 },
    { id: 'other', name: 'Other assets', kind: 'other', last: 35000, current: 35000 },
  ],
  liabilities: { name: 'Mortgage', last: 240000, current: 240000 },
  income: { salary: 30000, other: 6000 },
  categories: [
    { id: 'housing', name: 'Housing', budget: 9000, spent: 8500, note: 'Rent and electricity' },
    { id: 'food', name: 'Groceries & dining', budget: 6000, spent: 6350, note: '' },
    { id: 'transport', name: 'Transport', budget: 2000, spent: 1420, note: 'Monthly pass' },
    { id: 'shopping', name: 'Shopping', budget: 3500, spent: 2830, note: '' },
    { id: 'leisure', name: 'Leisure', budget: 2500, spent: 1900, note: '' },
    { id: 'other', name: 'Other', budget: 2000, spent: 1400, note: '' },
  ],
  goals: [
    { id: 'travel', name: 'Summer trip to Japan', target: 30000, saved: 12000, monthly: 2500 },
    { id: 'education', name: 'Children’s education', target: 60000, saved: 36000, monthly: 1500 },
  ],
  retirement: { age: 35, retireAge: 55, monthly: 5000, returnPct: 5, inflationPct: 2, goal: 4000000 },
  notes: { thisMonth: '', nextMonth: '' },
  savedAt: null,
}

/** Net worth at the end of each of the 11 months before this one (Dec 2025 – Oct 2026). */
export const NET_WORTH_HISTORY = [
  { label: 'Dec', value: 1282000 },
  { label: 'Jan', value: 1296000 },
  { label: 'Feb', value: 1305000 },
  { label: 'Mar', value: 1318000 },
  { label: 'Apr', value: 1331000 },
  { label: 'May', value: 1339000 },
  { label: 'Jun', value: 1352000 },
  { label: 'Jul', value: 1367000 },
  { label: 'Aug', value: 1381000 },
  { label: 'Sep', value: 1398000 },
  { label: 'Oct', value: 1426400 },
]

export const INVESTMENT_RETURN = { rate: 0.068, amount: 54800 } // year to date, illustrative

// ---------- Actions ----------

type Action =
  | { type: 'account'; id: string; current: number }
  | { type: 'liabilities'; current: number }
  | { type: 'income'; field: 'salary' | 'other'; value: number }
  | { type: 'category'; id: string; patch: Partial<Omit<Category, 'id'>> }
  | { type: 'addCategory'; id: string; name: string; budget: number }
  | { type: 'removeCategory'; id: string }
  | { type: 'retirement'; patch: Partial<Household['retirement']> }
  | { type: 'notes'; patch: Partial<Household['notes']> }
  | { type: 'saved'; at: string }
  | { type: 'reset' }

function reducer(s: Household, a: Action): Household {
  switch (a.type) {
    case 'account':
      return { ...s, accounts: s.accounts.map((x) => (x.id === a.id ? { ...x, current: a.current } : x)) }
    case 'liabilities':
      return { ...s, liabilities: { ...s.liabilities, current: a.current } }
    case 'income':
      return { ...s, income: { ...s.income, [a.field]: a.value } }
    case 'category':
      return { ...s, categories: s.categories.map((c) => (c.id === a.id ? { ...c, ...a.patch } : c)) }
    case 'addCategory':
      return {
        ...s,
        categories: [...s.categories, { id: a.id, name: a.name, budget: a.budget, spent: 0, note: '' }],
      }
    case 'removeCategory':
      return { ...s, categories: s.categories.filter((c) => c.id !== a.id) }
    case 'retirement':
      return { ...s, retirement: { ...s.retirement, ...a.patch } }
    case 'notes':
      return { ...s, notes: { ...s.notes, ...a.patch } }
    case 'saved':
      return { ...s, savedAt: a.at }
    case 'reset':
      return SAMPLE
  }
}

// ---------- Derived numbers, shared by every page ----------

export function derive(s: Household) {
  const assets = s.accounts.reduce((t, a) => t + a.current, 0)
  const assetsLast = s.accounts.reduce((t, a) => t + a.last, 0)
  const netWorth = assets - s.liabilities.current
  const netWorthLast = assetsLast - s.liabilities.last
  const income = s.income.salary + s.income.other
  const budget = s.categories.reduce((t, c) => t + c.budget, 0)
  const spending = s.categories.reduce((t, c) => t + c.spent, 0)
  const saved = income - spending
  const byKind = (k: AccountKind) => s.accounts.filter((a) => a.kind === k).reduce((t, a) => t + a.current, 0)
  return {
    assets,
    netWorth,
    netWorthChange: netWorth - netWorthLast,
    netWorthChangePct: netWorthLast ? (netWorth - netWorthLast) / netWorthLast : 0,
    income,
    budget,
    spending,
    budgetLeft: budget - spending,
    budgetUsed: budget ? spending / budget : 0,
    saved,
    savingsRate: income ? saved / income : 0,
    overBudget: s.categories.filter((c) => c.spent > c.budget),
    allocation: [
      { label: 'Investments', value: byKind('investment') },
      { label: 'Cash & savings', value: byKind('cash') },
      { label: 'Pension', value: byKind('pension') },
      { label: 'Other', value: byKind('other') },
    ],
  }
}

// Days left in the sample month (the prototype is set on 18 November 2026).
export const DAYS_LEFT_IN_MONTH = 12

// ---------- Context ----------

const KEY = 'household-prototype-v1'

function load(): Household {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...SAMPLE, ...JSON.parse(raw) } : SAMPLE
  } catch {
    return SAMPLE
  }
}

type Ctx = { state: Household; d: ReturnType<typeof derive>; dispatch: (a: Action) => void }
const HouseholdContext = createContext<Ctx | null>(null)

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: the prototype still works, it just won't remember edits */
    }
  }, [state])
  const value = useMemo(() => ({ state, d: derive(state), dispatch }), [state])
  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext)
  if (!ctx) throw new Error('useHousehold must be used inside <HouseholdProvider>')
  return ctx
}
