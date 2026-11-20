import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { AgentNote, AiOrb } from '../../components/Flow'
import { ArrowRightIcon, CheckIcon, ChevronDownIcon } from '../../components/icons'
import { AUTO_MAPPINGS, UNCERTAIN_MAPPING } from '../../data/mockData'
import type { MappingChoice } from '../../state/importFlow'

const ROW = 'grid grid-cols-[1fr_16px_1fr_72px_28px] items-center gap-3'
const pct = (n: number) => `${Math.round(n * 100)}%`

export function MappingPanel({
  choice,
  onChoose,
}: {
  choice: MappingChoice | null
  onChoose: (c: MappingChoice | null) => void
}) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section aria-labelledby="mapping-title" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 id="mapping-title" className="flex items-center gap-2 text-[15px] font-semibold">
          <AiOrb />
          Column mapping
        </h3>
        <span className="text-[13px] text-muted">Select a row to see why</span>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_var(--color-card-ring)]">
        <div className={`${ROW} border-b border-line bg-canvas px-4 py-2.5 text-xs text-muted`}>
          <span>In your file</span>
          <span />
          <span>Maps to</span>
          <span className="text-right">Confidence</span>
          <span />
        </div>

        {AUTO_MAPPINGS.map((m) => {
          const isOpen = open === m.source
          return (
            <div key={m.source} className="border-b border-line-soft">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : m.source)}
                className={`${ROW} w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-canvas`}
              >
                <span className="font-mono text-[13px]">{m.source}</span>
                <ArrowRightIcon className="text-faint" />
                <span className="font-medium">{m.field}</span>
                <span className="flex items-center justify-end gap-1.5 text-[13px] text-muted">
                  <CheckIcon className="text-accent" />
                  {pct(m.confidence)}
                </span>
                <ChevronDownIcon
                  className={`text-subtle transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden px-4 text-[13px] text-ink-2"
                  >
                    <span className="block pb-3.5">
                      <AgentNote>{m.reason}</AgentNote>
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        <AnimatePresence mode="wait" initial={false}>
          {choice === null ? (
            <motion.div
              key="pending"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-3 bg-warn-bg p-4"
            >
              <div className={ROW}>
                <span className="font-mono text-[13px]">{UNCERTAIN_MAPPING.source}</span>
                <ArrowRightIcon className="text-faint" />
                <span className="font-medium text-warn">Choose a field</span>
                <span className="justify-self-end rounded-full bg-warn-pill px-2 py-0.5 text-xs font-medium text-warn">
                  {pct(UNCERTAIN_MAPPING.confidence)}
                </span>
                <span />
              </div>
              <AgentNote>
                {UNCERTAIN_MAPPING.reason} Suggested field:{' '}
                <strong className="font-semibold text-ink">{UNCERTAIN_MAPPING.suggestedField}</strong>.
              </AgentNote>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => onChoose('use-suggestion')}>
                  Use “{UNCERTAIN_MAPPING.suggestedField}”
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onChoose('skip')}>
                  Skip column
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="decided"
              initial={{ opacity: 0, backgroundColor: 'var(--color-accent-bg)' }}
              animate={{ opacity: 1, backgroundColor: 'rgba(255,255,255,0)' }}
              transition={{ duration: 0.8 }}
              className={`${ROW} px-4 py-3`}
            >
              <span className="font-mono text-[13px]">{UNCERTAIN_MAPPING.source}</span>
              <ArrowRightIcon className="text-faint" />
              <span className="font-medium">
                {choice === 'use-suggestion' ? UNCERTAIN_MAPPING.suggestedField : 'Skipped'}
              </span>
              <span className="text-right text-[13px] text-muted">You chose</span>
              <Button
                variant="link"
                className="text-[13px]"
                aria-label={`Change mapping for ${UNCERTAIN_MAPPING.source}`}
                onClick={() => onChoose(null)}
              >
                Edit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-xs text-subtle">Matches above 95% are applied automatically.</p>
    </section>
  )
}
