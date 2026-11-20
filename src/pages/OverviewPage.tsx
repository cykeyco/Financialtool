import { Button } from '../components/Button'
import { LineChart } from '../components/LineChart'
import { PageHeader, ProgressBar, SectionTitle, Stat } from '../components/ui'
import { go } from '../components/useHashRoute'
import { compact, num, pct, sek, sekDelta } from '../lib/format'
import { DAYS_LEFT_IN_MONTH, INVESTMENT_RETURN, NET_WORTH_HISTORY, useHousehold } from '../state/household'

const ALLOC_COLORS = ['var(--color-accent)', 'var(--color-violet)', 'var(--color-orange)', 'var(--color-line-strong)']

export function OverviewPage() {
  const { state, d } = useHousehold()
  const history = [...NET_WORTH_HISTORY, { label: 'Nov', value: d.netWorth }]
  const ret = state.retirement
  const retProgress = ret.goal ? d.netWorth / ret.goal : 0
  const up = d.netWorthChange >= 0

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Overview"
        description="Your household finances at a glance."
        actions={
          <>
            <span className="inline-flex h-10 items-center border border-line-strong px-4 font-medium">
              {state.month}
            </span>
            <Button onClick={() => go('monthly')}>Add monthly entry</Button>
          </>
        }
      />

      {/* Net worth: the one number that matters most, with its trend */}
      <section
        aria-labelledby="nw"
        className="grid items-end gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
      >
        <div className="flex flex-col gap-3">
          <h2 id="nw" className="text-[13px] font-medium text-muted">
            Net worth
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="figure text-[clamp(36px,5vw,48px)] leading-none font-semibold tracking-[-0.035em]">
              {num(d.netWorth)}
            </span>
            <span className="text-lg text-subtle">kr</span>
          </div>
          <p className={`font-medium ${up ? 'text-accent' : 'text-danger'}`}>
            {sekDelta(d.netWorthChange)} this month{' '}
            <span className="font-normal text-subtle">
              ({up ? '+' : '−'}
              {pct(Math.abs(d.netWorthChangePct))})
            </span>
          </p>
          <dl className="mt-2 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1 text-[13px]">
            <dt className="text-subtle">Assets</dt>
            <dd className="num text-right">{sek(d.assets)}</dd>
            <dt className="text-subtle">{state.liabilities.name}</dt>
            <dd className="num text-right">− {sek(state.liabilities.current)}</dd>
          </dl>
        </div>
        <LineChart
          points={history}
          ariaLabel={`Net worth over the last 12 months, from ${sek(history[0].value)} to ${sek(d.netWorth)}`}
          formatAxis={compact}
          height={220}
        />
      </section>

      {/* This month in four numbers */}
      <section aria-label="This month" className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {[
          { label: 'Income', value: sek(d.income), sub: 'Salary and other income' },
          { label: 'Spending', value: sek(d.spending), sub: `${pct(d.budgetUsed)} of budget` },
          { label: 'Saved', value: sek(d.saved), sub: `${pct(d.savingsRate)} savings rate` },
          {
            label: 'Investment return',
            value: pct(INVESTMENT_RETURN.rate),
            sub: `Year to date · ${sekDelta(INVESTMENT_RETURN.amount)}`,
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`py-5 pr-4 ${i % 2 ? 'border-l border-line pl-6' : ''} ${
              i === 2 ? 'lg:border-l lg:border-line lg:pl-6' : ''
            } ${i >= 2 ? 'border-t border-line lg:border-t-0' : ''}`}
          >
            <Stat label={s.label} value={s.value} sub={s.sub} />
          </div>
        ))}
      </section>

      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        {/* Allocation */}
        <section aria-labelledby="alloc" className="flex flex-col gap-4">
          <SectionTitle id="alloc" aside={sek(d.assets)}>
            Assets
          </SectionTitle>
          <div
            role="img"
            aria-label={d.allocation.map((a) => `${a.label} ${pct(a.value / d.assets)}`).join(', ')}
            className="flex h-2 gap-0.5 overflow-hidden"
          >
            {d.allocation.map((a, i) => (
              <div key={a.label} style={{ width: `${(a.value / d.assets) * 100}%`, background: ALLOC_COLORS[i] }} />
            ))}
          </div>
          <ul>
            {d.allocation.map((a, i) => (
              <li
                key={a.label}
                className="grid grid-cols-[10px_1fr_auto_52px] items-center gap-2.5 border-b border-line-soft py-2 last:border-0"
              >
                <span aria-hidden="true" className="size-2" style={{ background: ALLOC_COLORS[i] }} />
                <span>{a.label}</span>
                <span className="num">{num(a.value)}</span>
                <span className="num text-right text-subtle">{pct(a.value / d.assets)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Budget */}
        <section aria-labelledby="ov-budget" className="flex flex-col gap-4">
          <SectionTitle
            id="ov-budget"
            aside={
              <Button variant="link" className="text-[13px]" onClick={() => go('budget')}>
                View budget
              </Button>
            }
          >
            {state.month.split(' ')[0]} budget
          </SectionTitle>
          <div className="flex items-baseline gap-2">
            <span className="figure text-[28px] font-semibold tracking-[-0.02em]">{sek(Math.abs(d.budgetLeft))}</span>
            <span className="text-muted">{d.budgetLeft >= 0 ? 'left to spend' : 'over budget'}</span>
          </div>
          <ProgressBar value={d.budgetUsed} label="Budget used" tone={d.budgetUsed > 1 ? 'warn' : 'ink'} />
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[13px]">
            <dt className="text-muted">Spent</dt>
            <dd className="num text-right">{sek(d.spending)}</dd>
            <dt className="text-muted">Budget</dt>
            <dd className="num text-right">{sek(d.budget)}</dd>
            <dt className="text-muted">Days left in month</dt>
            <dd className="num text-right">{DAYS_LEFT_IN_MONTH}</dd>
          </dl>
          {d.overBudget.length > 0 && (
            <p className="text-[13px] text-warn">
              Over budget: {d.overBudget.map((c) => `${c.name} (+${num(c.spent - c.budget)})`).join(', ')}
            </p>
          )}
        </section>

        {/* Retirement */}
        <section aria-labelledby="ov-ret" className="flex flex-col gap-4">
          <SectionTitle
            id="ov-ret"
            aside={
              <Button variant="link" className="text-[13px]" onClick={() => go('retirement')}>
                Adjust
              </Button>
            }
          >
            Retirement goal
          </SectionTitle>
          <div className="flex items-baseline gap-2">
            <span className="figure text-[28px] font-semibold tracking-[-0.02em]">{pct(retProgress, 0)}</span>
            <span className="text-muted">of {sek(ret.goal)}</span>
          </div>
          <ProgressBar value={retProgress} label="Retirement goal progress" tone="accent" />
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[13px]">
            <dt className="text-muted">Saved so far</dt>
            <dd className="num text-right">{sek(d.netWorth)}</dd>
            <dt className="text-muted">Remaining</dt>
            <dd className="num text-right">{sek(Math.max(0, ret.goal - d.netWorth))}</dd>
            <dt className="text-muted">Target age</dt>
            <dd className="num text-right">{ret.retireAge}</dd>
          </dl>
        </section>
      </div>
    </div>
  )
}
