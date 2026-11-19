import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AnimatedNumber } from '../../components/AnimatedNumber'
import { Button } from '../../components/Button'
import { AgentNote, AiOrb } from '../../components/Flow'
import { DoneBadge } from '../../components/icons'
import { REVIEW_ITEMS, formatAmount, type CategoryItem, type DuplicateItem } from '../../data/mockData'

type Props = {
  duplicates: DuplicateItem[]
  categories: CategoryItem[]
  decisions: Record<string, string>
  lastDecided: string | null
  onDecide: (id: string, choice: string) => void
  onUndo: (id: string) => void
  onAcceptAll: () => void
}

// Items slide out to the right and the list closes the gap.
const itemMotion = {
  layout: true,
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', x: 0 },
  exit: { opacity: 0, x: 32, height: 0, transition: { duration: 0.25, ease: 'easeIn' as const } },
  transition: { duration: 0.25, ease: 'easeOut' as const },
}

export function ReviewQueue(props: Props) {
  const { duplicates, categories, decisions, lastDecided, onDecide, onUndo, onAcceptAll } = props
  const remaining = duplicates.length + categories.length
  const last = REVIEW_ITEMS.find((i) => i.id === lastDecided)

  return (
    <section aria-labelledby="queue-title" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 id="queue-title" className="flex items-center gap-2 text-[15px] font-semibold" aria-live="polite">
          <AiOrb />
          Needs your review{' '}
          <span className="font-normal text-subtle">
            · <AnimatedNumber value={remaining} />
          </span>
        </h3>
        {remaining > 0 && (
          <Button size="sm" onClick={onAcceptAll}>
            Accept all suggestions
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(0_0_0/0.03),0_0_0_1px_rgb(0_0_0/0.035)]">
        <AnimatePresence initial={false}>
          {duplicates.length > 0 && <GroupHeader key="h-dup" label="Possible duplicates" count={duplicates.length} />}
          {duplicates.map((d) => (
            <motion.div key={d.id} {...itemMotion} className="overflow-hidden">
              <ItemShell name={d.name} meta={`${d.date} · Row ${d.row}`} amount={d.amount} reason={d.reason}>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onDecide(d.id, 'skip')}>
                    Skip this row
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => onDecide(d.id, 'keep')}>
                    Keep both
                  </Button>
                </div>
              </ItemShell>
            </motion.div>
          ))}

          {categories.length > 0 && <GroupHeader key="h-cat" label="Need a category" count={categories.length} />}
          {categories.map((c) => (
            <motion.div key={c.id} {...itemMotion} className="overflow-hidden">
              <ItemShell name={c.name} meta={`${c.date} · Row ${c.row}`} amount={c.amount} reason={c.reason}>
                <div role="group" aria-label={`Category for ${c.name}`} className="flex flex-wrap items-center gap-1.5">
                  {c.options.map((opt) => {
                    const suggested = opt === c.suggested
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onDecide(c.id, opt)}
                        className={`inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] transition-[transform,border-color] active:scale-[0.97] ${
                          suggested ? 'flow-outline font-medium' : 'border border-line bg-white hover:border-faint'
                        }`}
                      >
                        {suggested && <AiOrb size={8} />}
                        {opt}
                        {suggested && <span className="sr-only">(suggested)</span>}
                      </button>
                    )
                  })}
                </div>
              </ItemShell>
            </motion.div>
          ))}

          {remaining === 0 && (
            <motion.div
              key="clear"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center gap-2 px-4 py-8 text-center"
            >
              <DoneBadge size={28} />
              <span className="font-medium">All reviewed</span>
              <span className="text-[13px] text-muted">
                Your choices will be remembered for future imports from this bank.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* One-step undo for the most recent single decision */}
      <div className="min-h-6" aria-live="polite">
        <AnimatePresence>
          {last && (
            <motion.p
              key={last.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[13px] text-muted"
            >
              {describe(last.name, decisions[last.id])}
              <Button variant="link" className="text-[13px]" onClick={() => onUndo(last.id)}>
                Undo
              </Button>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function describe(name: string, choice?: string) {
  if (choice === 'skip') return `Skipped ${name}.`
  if (choice === 'keep') return `Kept both ${name} rows.`
  return `${name} → ${choice}.`
}

function GroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden border-b border-line bg-canvas px-4 py-2.5 text-xs text-muted"
    >
      {label} · {count}
    </motion.div>
  )
}

function ItemShell({
  name,
  meta,
  amount,
  reason,
  children,
}: {
  name: string
  meta: string
  amount: number
  reason: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-line-soft px-4 py-3.5">
      <div className="flex justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-subtle">{meta}</span>
        </div>
        <span className="font-medium whitespace-nowrap">{formatAmount(amount)}</span>
      </div>
      <AgentNote>{reason}</AgentNote>
      {children}
    </div>
  )
}
