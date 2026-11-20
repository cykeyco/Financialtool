import { Button } from '../components/Button'
import { LineChart } from '../components/LineChart'
import { MoneyField, NumberField, PageHeader, ProgressBar, SectionTitle } from '../components/ui'
import { go } from '../components/useHashRoute'
import { compact, k, num, pct, sek, sekDelta } from '../lib/format'
import { summarise, type RetirementInputs } from '../lib/retirement'
import { useHousehold, type Household } from '../state/household'

export function RetirementPage() {
  const { state, d, dispatch } = useHousehold()
  const r = state.retirement
  const inputs: RetirementInputs = { ...r, savings: d.netWorth }
  const s = summarise(inputs)
  const onTrack = s.difference >= 0
  const set = (patch: Partial<Household['retirement']>) => dispatch({ type: 'retirement', patch })

  // Extra monthly saving needed to close a shortfall.
  const real = (1 + r.returnPct / 100) / (1 + r.inflationPct / 100) - 1
  const growth = (1 + real) ** s.years
  const annuity = real === 0 ? s.years : (growth - 1) / real
  const extraMonthly = !onTrack && annuity > 0 ? -s.difference / annuity / 12 : 0

  // What-ifs: each shows its effect, and can be applied with one click.
  const whatIfs: { label: string; patch: Partial<Household['retirement']> }[] = [
    { label: `Save ${sek(1000)} more a month`, patch: { monthly: r.monthly + 1000 } },
    { label: 'Retire 2 years later', patch: { retireAge: r.retireAge + 2 } },
    { label: 'Returns 1 point lower', patch: { returnPct: Math.round((r.returnPct - 1) * 10) / 10 } },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Retirement"
        description="Where your savings and habits take you. All amounts are in today’s money."
      />

      <div className="grid items-start gap-8 [&>*]:min-w-0 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Inputs */}
        <section
          aria-labelledby="assumptions"
          className="flex flex-col gap-4 border border-line p-6 lg:sticky lg:top-6"
        >
          <SectionTitle id="assumptions">Your assumptions</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Age now"
              unit="years"
              value={r.age}
              min={18}
              max={80}
              onChange={(age) => set({ age })}
            />
            <NumberField
              label="Retire at"
              unit="years"
              value={r.retireAge}
              min={r.age + 1}
              max={90}
              onChange={(retireAge) => set({ retireAge })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-muted">Saved today</span>
            <span className="flex h-10 items-center justify-end gap-1.5 bg-canvas px-3">
              <span className="num text-base">{num(d.netWorth)}</span>
              <span className="text-[13px] text-subtle">kr</span>
            </span>
            <span className="text-xs text-subtle">
              Your net worth, from{' '}
              <Button variant="link" className="text-xs" onClick={() => go('monthly')}>
                Monthly entry
              </Button>
            </span>
          </div>
          <MoneyField label="Saved each month" value={r.monthly} onChange={(monthly) => set({ monthly })} />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Yearly return"
              unit="%"
              step={0.5}
              value={r.returnPct}
              onChange={(returnPct) => set({ returnPct })}
            />
            <NumberField
              label="Inflation"
              unit="%"
              step={0.5}
              value={r.inflationPct}
              onChange={(inflationPct) => set({ inflationPct })}
            />
          </div>
          <MoneyField label="Goal at retirement" value={r.goal} onChange={(goal) => set({ goal })} />
        </section>

        <div className="flex min-w-0 flex-col gap-8">
          {/* Verdict first */}
          <section aria-labelledby="verdict" className="flex flex-col gap-2">
            <span
              className={`w-fit px-2.5 py-0.5 text-xs font-medium ${
                onTrack ? 'bg-accent-bg text-accent' : 'bg-warn-pill text-warn'
              }`}
            >
              {onTrack ? 'On track' : 'Not on track yet'}
            </span>
            <h2 id="verdict" className="text-[clamp(26px,3.6vw,36px)] leading-tight font-semibold tracking-[-0.02em]">
              <span className="figure">{sek(k(s.atRetirement))}</span> at {r.retireAge}
            </h2>
            <p className="max-w-[60ch] text-muted">
              {onTrack ? (
                <>
                  That is {sek(k(s.difference))} more than your goal
                  {s.reachAge !== null && s.reachAge < r.retireAge && <>, and you reach the goal at {s.reachAge}</>}.
                </>
              ) : (
                <>
                  That is {sek(k(-s.difference))} short of your goal. Saving about {sek(Math.ceil(extraMonthly / 100) * 100)} more a month would close the gap.
                </>
              )}
            </p>
          </section>

          <LineChart
            points={s.points.map((p) => ({ label: String(p.age), value: p.value }))}
            ariaLabel={`Projected savings from age ${r.age} to ${r.retireAge}, ending at ${sek(k(s.atRetirement))}. Goal ${sek(r.goal)}.`}
            formatAxis={compact}
            height={260}
            target={{ value: r.goal, label: `Goal ${compact(r.goal)}` }}
            endLabel={compact(s.atRetirement)}
          />

          <dl className="grid grid-cols-3 border-y border-line">
            <div className="flex flex-col gap-1 py-4 pr-4">
              <dt className="text-[13px] text-muted">Progress today</dt>
              <dd className="figure text-[22px] font-semibold">{pct(s.progressToday, 0)}</dd>
            </div>
            <div className="flex flex-col gap-1 border-l border-line py-4 pl-5">
              <dt className="text-[13px] text-muted">Still to save</dt>
              <dd className="figure text-[22px] font-semibold">{compact(s.gapToday)}</dd>
            </div>
            <div className="flex flex-col gap-1 border-l border-line py-4 pl-5">
              <dt className="text-[13px] text-muted">Years to go</dt>
              <dd className="figure text-[22px] font-semibold">{s.years}</dd>
            </div>
          </dl>
          <ProgressBar value={s.progressToday} label="Progress towards retirement goal today" tone="accent" />

          {/* What if */}
          <section aria-labelledby="whatif" className="flex flex-col gap-3">
            <SectionTitle id="whatif">What if…</SectionTitle>
            <ul className="overflow-hidden border border-line">
              {whatIfs.map((w) => {
                const alt = summarise({ ...inputs, ...w.patch })
                const delta = alt.atRetirement - s.atRetirement
                return (
                  <li
                    key={w.label}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line-soft px-4 py-3 last:border-0"
                  >
                    <span className="flex-1">{w.label}</span>
                    <span className={`num font-medium whitespace-nowrap ${delta >= 0 ? 'text-accent' : 'text-danger'}`}>
                      {sekDelta(k(delta))}
                    </span>
                    <Button size="sm" variant="secondary" onClick={() => set(w.patch)}>
                      Apply
                    </Button>
                  </li>
                )
              })}
            </ul>
            <p className="text-xs text-subtle">
              A simple estimate: steady returns, savings added yearly, no taxes or state pension. Not financial advice.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
