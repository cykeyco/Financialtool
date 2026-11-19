import { Fragment } from 'react'
import { CheckIcon } from './icons'

const STEPS = ['Upload', 'Review', 'Import']

export function Stepper({ current }: { current: number }) {
  return (
    <ol aria-label="Import steps" className="flex flex-wrap items-center gap-3 text-[13px]">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <Fragment key={label}>
            {i > 0 && (
              <li aria-hidden="true" className="h-px w-8 bg-line">
                <span
                  className="block h-full origin-left bg-ink transition-transform duration-500"
                  style={{ transform: `scaleX(${done || active ? 1 : 0})` }}
                />
              </li>
            )}
            <li
              aria-current={active ? 'step' : undefined}
              className={`flex items-center gap-2 transition-colors ${
                active ? 'font-medium text-ink' : done ? 'text-muted' : 'text-subtle'
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] transition-colors duration-300 ${
                  done
                    ? 'bg-accent text-white'
                    : active
                      ? 'bg-ink text-white'
                      : 'text-subtle shadow-[inset_0_0_0_1px_#d9d9d5]'
                }`}
              >
                {done ? <CheckIcon width={10} height={10} /> : i + 1}
              </span>
              {label}
              {done && <span className="sr-only">(completed)</span>}
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
