import { AnimatePresence, motion } from 'motion/react'
import { DoneBadge } from '../components/icons'
import { useFocusOnMount } from '../components/useFocusOnMount'
import type { ImportFile } from '../data/mockData'

type Props = {
  file: ImportFile
  steps: { label: string; result: string }[]
  progress: number
}

export function AnalyzingStep({ file, steps, progress }: Props) {
  const heading = useFocusOnMount<HTMLHeadingElement>()

  return (
    <section
      aria-labelledby="analyzing-title"
      className="flex max-w-xl flex-col gap-6 rounded-2xl border border-line p-8"
    >
      <div className="flex flex-col gap-0.5">
        <h2 id="analyzing-title" ref={heading} tabIndex={-1} className="text-[17px] font-semibold outline-none">
          Checking {file.name}
        </h2>
        <p className="text-[13px] text-muted">{file.rows} rows · this takes a few seconds</p>
      </div>

      {/* Thin overall progress bar */}
      <div className="h-1 overflow-hidden rounded-full bg-track" aria-hidden="true">
        <motion.div
          className="h-full rounded-full bg-ink"
          initial={{ width: 0 }}
          animate={{ width: `${(progress / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
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
                done || active ? 'text-ink' : 'text-subtle'
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
                      <DoneBadge />
                    </motion.span>
                  ) : active ? (
                    <motion.span
                      key="active"
                      exit={{ opacity: 0 }}
                      className="size-3.5 animate-spin rounded-full border-2 border-line border-t-ink"
                    />
                  ) : (
                    <span key="todo" className="size-2 rounded-full bg-[#d9d9d5]" />
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
                    className="ml-auto text-[13px] text-subtle"
                  >
                    {s.result}
                  </motion.span>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
