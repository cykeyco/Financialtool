import { AnimatePresence, motion } from 'motion/react'
import { AiOrb, FlowField } from '../components/Flow'
import { DoneBadge } from '../components/icons'
import { useFocusOnMount } from '../components/useFocusOnMount'
import type { ImportFile } from '../data/mockData'

type Props = {
  file: ImportFile
  steps: { label: string; result: string }[]
  progress: number
}

/** What the agent is doing right now, in plain words. */
const STATUS = [
  'Reading every row',
  'Matching Swedish column names',
  'Comparing amounts, dates and descriptions',
  'Learning from your past categories',
]

export function AnalyzingStep({ file, steps, progress }: Props) {
  const heading = useFocusOnMount<HTMLHeadingElement>()
  const finished = progress >= steps.length
  const status = finished ? 'Done' : (STATUS[progress] ?? steps[progress]?.label)

  return (
    <section
      aria-labelledby="analyzing-title"
      className="relative grid min-h-[380px] overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.03),0_0_0_1px_rgb(0_0_0/0.035)] md:grid-cols-2"
    >
      <FlowField phase={Math.min(progress, steps.length)} settled={finished} />

      <div className="relative flex flex-col gap-6 px-6 pt-48 pb-8 md:px-10 md:py-9">
        <div className="flex flex-col gap-1">
          <h2 id="analyzing-title" ref={heading} tabIndex={-1} className="text-[17px] font-medium outline-none">
            Checking {file.name}
          </h2>
          <p className="flex items-center gap-1.5 text-[13px] text-muted" aria-live="polite">
            <span
              aria-hidden="true"
              className={`size-[5px] rounded-full ${finished ? 'bg-accent' : 'animate-pulse bg-flow-sage'}`}
            />
            {status} · {file.rows} rows
          </p>
        </div>

        {/* Overall progress, drawn in the flow gradient */}
        <div className="h-1 overflow-hidden rounded-full bg-track" aria-hidden="true">
          <motion.div
            className="flow-line h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0.04, (progress + (finished ? 0 : 0.5)) / steps.length) * 100}%` }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        <ul className="flex flex-col gap-3.5" aria-live="polite">
          {steps.map((s, i) => {
            const done = progress > i
            const active = progress === i
            return (
              <li
                key={s.label}
                className={`flex items-center gap-3 transition-colors duration-200 ${
                  done ? 'text-ink' : active ? 'font-medium text-ink' : 'text-faint'
                }`}
              >
                <span aria-hidden="true" className="flex size-5 items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        <DoneBadge size={16} />
                      </motion.span>
                    ) : active ? (
                      <motion.span key="active" exit={{ opacity: 0 }} className="flex">
                        <AiOrb size={16} spinning />
                      </motion.span>
                    ) : (
                      <span key="todo" className="size-4 rounded-full shadow-[inset_0_0_0_1px_#d4d4d8]" />
                    )}
                  </AnimatePresence>
                </span>
                <span>
                  {s.label}
                  {done && <span className="sr-only"> — done</span>}
                </span>
                <AnimatePresence>
                  {done && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-auto text-[13px] font-normal whitespace-nowrap text-subtle"
                    >
                      {s.result}
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
