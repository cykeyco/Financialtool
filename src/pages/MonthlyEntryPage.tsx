import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { Button } from '../components/Button'
import { MoneyField, PageHeader, ProgressBar, SectionTitle, TextArea } from '../components/ui'
import { go } from '../components/useHashRoute'
import { num, pct, sek, sekDelta } from '../lib/format'
import { useHousehold } from '../state/household'

export function MonthlyEntryPage() {
  const { state, d, dispatch } = useHousehold()
  const [toast, setToast] = useState<string | null>(null)

  const save = () => {
    const at = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    dispatch({ type: 'saved', at })
    setToast(`${state.month} saved. Overview is updated.`)
    window.setTimeout(() => setToast(null), 3200)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Monthly entry"
        description="Update balances and income once a month. Spending comes from your budget."
        actions={
          <>
            <Button variant="secondary" onClick={() => go('import')}>
              Import from bank
            </Button>
            <Button onClick={save}>Save {state.month.split(' ')[0]}</Button>
          </>
        }
      />

      <div className="grid items-start gap-8 [&>*]:min-w-0 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-10">
          {/* Balances */}
          <section aria-labelledby="balances" className="flex flex-col gap-3">
            <SectionTitle id="balances" aside={`Balances on 30 ${state.month}`}>
              Account balances
            </SectionTitle>
            <div className="relative overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr className="bg-canvas text-left text-xs text-muted">
                    <th scope="col" className="border-b border-line px-4 py-2.5 font-medium">
                      Account
                    </th>
                    <th scope="col" className="border-b border-line px-4 py-2.5 text-right font-medium">
                      Last month
                    </th>
                    <th scope="col" className="w-48 border-b border-line px-4 py-2.5 text-right font-medium">
                      This month
                    </th>
                    <th scope="col" className="border-b border-line px-4 py-2.5 text-right font-medium">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.accounts.map((a) => (
                    <Row
                      key={a.id}
                      name={a.name}
                      last={a.last}
                      current={a.current}
                      onChange={(n) => dispatch({ type: 'account', id: a.id, current: n })}
                    />
                  ))}
                  <Row
                    name={state.liabilities.name}
                    last={state.liabilities.last}
                    current={state.liabilities.current}
                    liability
                    onChange={(n) => dispatch({ type: 'liabilities', current: n })}
                  />
                </tbody>
              </table>
            </div>
            <dl className="grid grid-cols-3 gap-4 rounded-xl bg-canvas px-5 py-4">
              <div className="flex flex-col">
                <dt className="text-xs text-muted">Assets</dt>
                <dd className="text-lg font-semibold">
                  <AnimatedNumber value={d.assets} />
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xs text-muted">Liabilities</dt>
                <dd className="text-lg font-semibold">
                  − <AnimatedNumber value={state.liabilities.current} />
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xs text-muted">Net worth</dt>
                <dd className="text-lg font-semibold">
                  <AnimatedNumber value={d.netWorth} />
                </dd>
                <dd className={`text-xs ${d.netWorthChange >= 0 ? 'text-accent' : 'text-danger'}`}>
                  {sekDelta(d.netWorthChange)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Income */}
          <section aria-labelledby="income" className="flex flex-col gap-3">
            <SectionTitle id="income" aside={<>Total {sek(d.income)}</>}>
              Income this month
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <MoneyField
                label="Salary after tax"
                value={state.income.salary}
                onChange={(n) => dispatch({ type: 'income', field: 'salary', value: n })}
              />
              <MoneyField
                label="Other income"
                value={state.income.other}
                onChange={(n) => dispatch({ type: 'income', field: 'other', value: n })}
              />
            </div>
          </section>
        </div>

        {/* Summary: sticky on wide screens so it stays in view while editing */}
        <aside
          aria-label="Month summary"
          className="flex flex-col gap-6 rounded-2xl border border-line p-6 lg:sticky lg:top-6"
        >
          <SectionTitle aside={state.savedAt ? `Saved ${state.savedAt}` : 'Not saved yet'}>{state.month}</SectionTitle>
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
            <dt className="text-muted">Income</dt>
            <dd className="num text-right font-medium">{sek(d.income)}</dd>
            <dt className="text-muted">
              Spending{' '}
              <Button variant="link" className="text-[13px]" onClick={() => go('budget')}>
                from budget
              </Button>
            </dt>
            <dd className="num text-right font-medium">− {sek(d.spending)}</dd>
            <div className="col-span-2 border-t border-line" />
            <dt className="font-medium">Saved</dt>
            <dd className={`num text-right text-lg font-semibold ${d.saved < 0 ? 'text-danger' : 'text-accent'}`}>
              {sek(d.saved)}
            </dd>
          </dl>
          <p className="-mt-3 text-[13px] text-subtle">Savings rate {pct(d.savingsRate)}</p>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-muted">Budget used</span>
              <span className="font-medium">{pct(d.budgetUsed)}</span>
            </div>
            <ProgressBar value={d.budgetUsed} label="Budget used" tone={d.budgetUsed > 1 ? 'warn' : 'ink'} />
            {d.overBudget.map((c) => (
              <p key={c.id} className="rounded-lg bg-warn-bg px-3 py-2 text-[13px] text-warn">
                {c.name} is {sek(c.spent - c.budget)} over budget.
              </p>
            ))}
          </div>

          <TextArea
            label="Notes for this month"
            placeholder="e.g. Bought winter tyres, one-off"
            value={state.notes.thisMonth}
            onChange={(s) => dispatch({ type: 'notes', patch: { thisMonth: s } })}
          />
          <TextArea
            label="Plan for next month"
            placeholder="e.g. Cook at home more, groceries back under 6 000 kr"
            value={state.notes.nextMonth}
            onChange={(s) => dispatch({ type: 'notes', patch: { nextMonth: s } })}
          />
        </aside>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-ink px-4 py-3 text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({
  name,
  last,
  current,
  onChange,
  liability,
}: {
  name: string
  last: number
  current: number
  onChange: (n: number) => void
  liability?: boolean
}) {
  const change = current - last
  // For a loan, going down is good.
  const good = liability ? change <= 0 : change >= 0
  return (
    <tr className={liability ? 'bg-canvas/50' : ''}>
      <th scope="row" className="border-b border-line-soft px-4 py-2 text-left font-normal">
        {name}
        {liability && <span className="ml-2 text-xs text-subtle">Liability</span>}
      </th>
      <td className="num border-b border-line-soft px-4 py-2 text-right text-muted">{num(last)}</td>
      <td className="border-b border-line-soft px-4 py-2">
        <MoneyField label={`${name}, this month`} hideLabel value={current} onChange={onChange} />
      </td>
      <td
        className={`num border-b border-line-soft px-4 py-2 text-right whitespace-nowrap ${
          change === 0 ? 'text-subtle' : good ? 'text-accent' : 'text-danger'
        }`}
      >
        {change === 0 ? '—' : `${change > 0 ? '+' : '−'} ${num(Math.abs(change))}`}
      </td>
    </tr>
  )
}
