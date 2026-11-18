import { motion } from 'motion/react'
import { Button } from '../components/Button'
import { DoneBadge } from '../components/icons'
import { useFocusOnMount } from '../components/useFocusOnMount'

type DoneProps = {
  imported: number
  skipped: number
  unreadable: number
  rulesLearned: number
  onFinish: () => void
  onUndo: () => void
}

export function DoneStep({ imported, skipped, unreadable, rulesLearned, onFinish, onUndo }: DoneProps) {
  const heading = useFocusOnMount<HTMLHeadingElement>()
  const rows = [
    ['Imported', imported],
    ['Duplicates skipped', skipped],
    ['Unreadable rows left out', unreadable],
    ['New category rules learned', rulesLearned],
  ] as const

  return (
    <section aria-labelledby="done-title" className="flex max-w-xl flex-col gap-6 rounded-2xl border border-line p-10">
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
        className="self-start"
      >
        <DoneBadge size={36} />
      </motion.span>
      <div className="flex flex-col gap-1">
        <h2
          id="done-title"
          ref={heading}
          tabIndex={-1}
          className="text-[22px] font-semibold tracking-tight outline-none"
        >
          {imported} transactions imported
        </h2>
        <p className="text-muted">Your overview and budget are updated.</p>
      </div>
      <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5 border-y border-line py-4">
        {rows.map(([label, value], i) => (
          <motion.div
            key={label}
            className="contents"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06 }}
          >
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </motion.div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onFinish}>Go to overview</Button>
        <Button variant="secondary" onClick={onUndo}>
          Undo import
        </Button>
      </div>
      <p className="text-xs text-subtle">You can also undo from Settings › Import history for 30 days.</p>
    </section>
  )
}

export function UndoneStep({ removed, onRestart }: { removed: number; onRestart: () => void }) {
  const heading = useFocusOnMount<HTMLHeadingElement>()
  return (
    <section
      aria-labelledby="undone-title"
      className="flex max-w-xl flex-col gap-4 rounded-2xl border border-line p-10"
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
