import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Button } from '../components/Button'
import { AiOrb, FlowField } from '../components/Flow'
import { useFocusOnMount } from '../components/useFocusOnMount'
import { num } from '../lib/format'

/** Counts up from zero once, as the money lands. */
function CountUp({ to }: { to: number }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => num(v))
  useEffect(() => {
    const c = animate(mv, to, { duration: 1.2, ease: [0.2, 0.7, 0.2, 1] })
    return () => c.stop()
  }, [mv, to])
  return <motion.span>{text}</motion.span>
}

type DoneProps = {
  imported: number
  skipped: number
  unreadable: number
  rulesLearned: number
  learned: { name: string; category: string }[]
  onFinish: () => void
  onUndo: () => void
}

export function DoneStep({ imported, skipped, unreadable, rulesLearned, learned, onFinish, onUndo }: DoneProps) {
  const heading = useFocusOnMount<HTMLHeadingElement>()
  const rows = [
    ['Imported', imported],
    ['Duplicates skipped', skipped],
    ['Unreadable rows left out', unreadable],
    ['New category rules learned', rulesLearned],
  ] as const

  return (
    <section
      aria-labelledby="done-title"
      className="relative grid overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_1px_var(--color-card-ring)] md:grid-cols-2"
    >
      <FlowField settled />
      <div className="relative flex flex-col gap-6 px-6 pt-48 pb-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] text-muted">Import complete</p>
          <h2 id="done-title" ref={heading} tabIndex={-1} className="flex flex-col outline-none">
            <span className="figure text-[56px] leading-none font-semibold tracking-[-0.035em]">
              <CountUp to={imported} />
            </span>
            <span className="mt-2 text-[15px] font-normal text-muted">transactions added. Your overview and budget are updated.</span>
          </h2>
        </div>

        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5 border-y border-line py-4">
          {rows.map(([label, value], i) => (
            <motion.div
              key={label}
              className="contents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <dt className="text-muted">{label}</dt>
              <dd className="num text-right font-medium">{value}</dd>
            </motion.div>
          ))}
        </dl>

        {learned.length > 0 && (
          <ul aria-label="What the agent learned" className="flex flex-col gap-2.5">
            {learned.map((r, i) => (
              <motion.li
                key={r.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-start gap-2.5 text-[13px] text-muted"
              >
                <span className="mt-[3px]">
                  <AiOrb size={12} />
                </span>
                <span>
                  Future <strong className="font-medium text-ink">{r.name}</strong> payments will be categorised as{' '}
                  <strong className="font-medium text-ink">{r.category}</strong>.
                </span>
              </motion.li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={onFinish}>Go to overview</Button>
          <Button variant="secondary" onClick={onUndo}>
            Undo import
          </Button>
        </div>
        <p className="text-xs text-subtle">You can also undo from Settings › Import history for 30 days.</p>
      </div>
    </section>
  )
}

export function UndoneStep({ removed, onRestart }: { removed: number; onRestart: () => void }) {
  const heading = useFocusOnMount<HTMLHeadingElement>()
  return (
    <section
      aria-labelledby="undone-title"
      className="flex max-w-xl flex-col gap-4 rounded-[20px] bg-white p-10 shadow-[0_0_0_1px_var(--color-card-ring)]"
    >
      <h2
        id="undone-title"
        ref={heading}
        tabIndex={-1}
        className="text-[22px] font-semibold tracking-tight outline-none"
      >
        Import undone
      </h2>
      <p className="text-muted">
        {removed} transactions were removed. Your data is exactly as it was before this import.
      </p>
      <div>
        <Button onClick={onRestart}>Start a new import</Button>
      </div>
    </section>
  )
}
