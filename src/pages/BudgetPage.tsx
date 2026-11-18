import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { Button } from '../components/Button'
import { MoneyField, PageHeader, ProgressBar, SectionTitle, TextArea } from '../components/ui'
import { num, pct, sek } from '../lib/format'
import { DAYS_LEFT_IN_MONTH, useHousehold, type Goal } from '../state/household'

type Editing = { mode: 'edit'; id: string } | { mode: 'new' }

export function BudgetPage() {
  const { state, d, dispatch } = useHousehold()
  const [editing, setEditing] = useState<Editing>({ mode: 'edit', id: state.categories[1]?.id ?? '' })
  const selected = editing.mode === 'edit' ? state.categories.find((c) => c.id === editing.id) : undefined
  const perDay = d.budgetLeft > 0 ? d.budgetLeft / DAYS_LEFT_IN_MONTH : 0

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Budget"
        description="What you plan to spend each month, and what you are saving towards."
        actions={
          <>
            <span className="inline-flex h-10 items-center rounded-lg border border-line px-3 font-medium">
              {state.month}
            </span>
            <Button onClick={() => setEditing({ mode: 'new' })}>Add category</Button>
          </>
        }
      />

      {/* Headline: what's left, and what that means per day */}
      <section aria-labelledby="left" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id="left" className="text-[clamp(32px,4.5vw,44px)] leading-none font-semibold tracking-[-0.03em]">
            {sek(Math.abs(d.budgetLeft))}
          </h2>
          <span className="text-lg text-muted">{d.budgetLeft >= 0 ? 'left this month' : 'over budget'}</span>
        </div>
        <ProgressBar value={d.budgetUsed} label="Budget used" tone={d.budgetUsed > 1 ? 'warn' : 'ink'} height={10} />
        <p className="text-muted">
          {sek(d.spending)} of {sek(d.budget)} spent · {DAYS_LEFT_IN_MONTH} days left
          {perDay > 0 && <> · about SEK {num(perDay)} a day</>}
        </p>
      </section>

      <div className="grid items-start gap-8 [&>*]:min-w-0 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Categories */}
        <section aria-labelledby="cats" className="flex flex-col gap-3">
          <SectionTitle id="cats" aside="Select a category to edit">
            Categories
          </SectionTitle>
          <div className="relative overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="bg-canvas text-left text-xs text-muted">
                  <th scope="col" className="border-b border-line px-4 py-2.5 font-medium">
                    Category
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-right font-medium">
                    Budget
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-right font-medium">
                    Spent
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-right font-medium">
                    Left
                  </th>
                  <th scope="col" className="w-36 border-b border-line px-4 py-2.5 font-medium">
                    <span className="sr-only">Progress</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {state.categories.map((c) => {
                    const used = c.budget ? c.spent / c.budget : 0
                    const over = c.spent > c.budget
                    const isSel = selected?.id === c.id
                    return (
                      <motion.tr
                        key={c.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditing({ mode: 'edit', id: c.id })}
                        className={`cursor-pointer transition-colors ${isSel ? 'bg-accent-bg' : 'hover:bg-canvas'}`}
                      >
                        <th scope="row" className="border-b border-line-soft px-4 py-3 text-left font-normal">
                          <button
                            type="button"
                            aria-pressed={isSel}
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditing({ mode: 'edit', id: c.id })
                            }}
                            className="cursor-pointer text-left font-medium"
                          >
                            {c.name}
                          </button>
                        </th>
                        <td className="border-b border-line-soft px-4 py-3 text-right">{num(c.budget)}</td>
                        <td className="border-b border-line-soft px-4 py-3 text-right">{num(c.spent)}</td>
                        <td
                          className={`border-b border-line-soft px-4 py-3 text-right whitespace-nowrap ${over ? 'font-medium text-warn' : ''}`}
                        >
                          {over ? `Over ${num(c.spent - c.budget)}` : num(c.budget - c.spent)}
                        </td>
                        <td className="border-b border-line-soft px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <ProgressBar
                                value={used}
                                label={`${c.name} budget used`}
                                tone={over ? 'warn' : 'ink'}
                                height={6}
                              />
                            </div>
                            <span className={`w-10 text-right text-xs ${over ? 'text-warn' : 'text-subtle'}`}>
                              {pct(used, 0)}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <th scope="row" className="px-4 py-3 text-left">
                    Total
                  </th>
                  <td className="px-4 py-3 text-right">{num(d.budget)}</td>
                  <td className="px-4 py-3 text-right">{num(d.spending)}</td>
                  <td className="px-4 py-3 text-right">{num(d.budgetLeft)}</td>
                  <td className="px-4 py-3 text-xs font-normal text-subtle">{pct(d.budgetUsed)} used</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Editor */}
        <aside aria-label="Category editor" className="rounded-2xl border border-line p-6 lg:sticky lg:top-6">
          <AnimatePresence mode="wait" initial={false}>
            {editing.mode === 'new' ? (
              <motion.div key="new" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <NewCategory
                  onAdd={(name, budget) => {
                    const id = `c${Date.now()}`
                    dispatch({ type: 'addCategory', id, name, budget })
                    setEditing({ mode: 'edit', id })
                  }}
                  onCancel={() => setEditing({ mode: 'edit', id: state.categories[0]?.id ?? '' })}
                />
              </motion.div>
            ) : selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-1">
                  <h2 className="text-[17px] font-semibold">{selected.name}</h2>
                  <p className="text-[13px] text-subtle">Changes save automatically.</p>
                </div>
                <TextField
                  label="Name"
                  value={selected.name}
                  onChange={(name) => dispatch({ type: 'category', id: selected.id, patch: { name } })}
                />
                <MoneyField
                  label="Monthly budget"
                  value={selected.budget}
                  onChange={(budget) => dispatch({ type: 'category', id: selected.id, patch: { budget } })}
                />
                <div className="flex flex-col gap-1">
                  <MoneyField
                    label="Spent so far"
                    value={selected.spent}
                    onChange={(spent) => dispatch({ type: 'category', id: selected.id, patch: { spent } })}
                  />
                  <span className="text-xs text-subtle">Filled in by bank imports. Edit to correct.</span>
                </div>
                <TextArea
                  label="Note"
                  placeholder="What this category covers"
                  value={selected.note}
                  onChange={(note) => dispatch({ type: 'category', id: selected.id, patch: { note } })}
                />
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!px-0 !text-danger hover:!bg-transparent hover:underline"
                    onClick={() => {
                      dispatch({ type: 'removeCategory', id: selected.id })
                      setEditing({ mode: 'edit', id: '' })
                    }}
                  >
                    Delete category
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-6 text-center text-muted"
              >
                Select a category to edit it, or add a new one.
              </motion.p>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* Savings goals are separate from monthly spending */}
      <section aria-labelledby="goals" className="flex flex-col gap-4">
        <SectionTitle id="goals" aside="Set aside each month, outside the spending budget">
          Savings goals
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {state.goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      </section>
    </div>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const left = Math.max(0, goal.target - goal.saved)
  const months = goal.monthly > 0 ? Math.ceil(left / goal.monthly) : null
  const done = new Date(2026, 10 + (months ?? 0), 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-medium">{goal.name}</h3>
        <span className="text-[13px] text-muted">{sek(goal.target)}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[22px] font-semibold tracking-[-0.01em]">{sek(goal.saved)}</span>
        <span className="text-muted">saved</span>
      </div>
      <ProgressBar value={goal.saved / goal.target} label={`${goal.name} progress`} tone="accent" />
      <p className="text-[13px] text-muted">
        SEK {num(goal.monthly)} a month{months !== null && <> · reached by {done}</>}
      </p>
    </div>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (s: string) => void }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] text-muted">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border border-line px-3 text-base outline-none transition-colors focus:border-ink hover:border-[#d2d2ce]"
      />
    </div>
  )
}

function NewCategory({ onAdd, onCancel }: { onAdd: (name: string, budget: number) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState(1000)
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (name.trim()) onAdd(name.trim(), budget)
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[17px] font-semibold">New category</h2>
        <p className="text-[13px] text-subtle">It is added to this month’s budget.</p>
      </div>
      <TextField label="Name" value={name} onChange={setName} />
      <MoneyField label="Monthly budget" value={budget} onChange={setBudget} />
      <div className="flex gap-2">
        <Button type="submit" disabled={!name.trim()}>
          Add category
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
