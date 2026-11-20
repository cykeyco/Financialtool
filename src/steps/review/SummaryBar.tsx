import { AnimatedNumber } from '../../components/AnimatedNumber'

type Props = { fileName: string; rows: number; ready: number; pending: number; unreadable: number }

export function SummaryBar({ fileName, rows, ready, pending, unreadable }: Props) {
  const stats = [
    { label: 'Ready', value: ready, tone: 'text-subtle' },
    { label: 'To review', value: pending, tone: pending ? 'text-warn' : 'text-subtle' },
    { label: 'Unreadable', value: unreadable, tone: unreadable ? 'text-danger' : 'text-subtle' },
  ]
  return (
    <section
      aria-label="Check summary"
      className="flex flex-wrap items-center gap-x-8 gap-y-3 bg-white px-5 py-4 shadow-[0_0_0_1px_var(--color-card-ring)]"
    >
      <div className="flex min-w-60 flex-1 flex-col leading-snug">
        <span className="font-medium">{fileName}</span>
        <span className="text-xs text-subtle">{rows} rows checked</span>
      </div>
      <dl className="flex flex-wrap gap-x-7 gap-y-2">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className={`text-xs transition-colors ${s.tone}`}>{s.label}</dt>
            <dd className="text-xl font-normal tracking-[-0.02em]">
              <AnimatedNumber value={s.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
