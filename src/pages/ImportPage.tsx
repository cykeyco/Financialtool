import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Stepper } from '../components/Stepper'
import { go } from '../components/useHashRoute'
import { CATEGORY_ITEMS } from '../data/mockData'
import { useImportFlow, type Screen } from '../state/importFlow'
import { AnalyzingStep } from '../steps/AnalyzingStep'
import { DoneStep, UndoneStep } from '../steps/ResultSteps'
import { ReviewStep } from '../steps/ReviewStep'
import { UploadStep } from '../steps/UploadStep'

const STEP_INDEX: Record<Screen, number> = { upload: 0, analyzing: 0, review: 1, done: 3, undone: 3 }

export function ImportPage() {
  const flow = useImportFlow()
  const { state, derived, actions } = flow
  // Don't steal focus on first page load; do move it when the user comes back to upload.
  const [hasStarted, setHasStarted] = useState(false)
  const start: typeof actions.start = (file) => {
    setHasStarted(true)
    actions.start(file)
  }

  return (
    <>
      <div className="flex-1 px-6 pt-10 pb-12 md:px-12">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-[36px] leading-[1.1] font-light tracking-[-0.02em]">Import data</h1>
            <p className="text-muted">Bring in transactions from a bank export. Nothing is saved until you confirm.</p>
          </header>

          <Stepper current={STEP_INDEX[state.screen]} />

          <AnimatePresence mode="wait">
            <motion.div
              key={state.screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {state.screen === 'upload' && <UploadStep onStart={start} focus={hasStarted} />}
              {state.screen === 'analyzing' && (
                <AnalyzingStep file={state.file} steps={derived.steps} progress={state.progress} />
              )}
              {state.screen === 'review' && <ReviewStep flow={flow} />}
              {state.screen === 'done' && (
                <DoneStep
                  imported={derived.importCount}
                  skipped={derived.skippedDuplicates}
                  unreadable={derived.unreadable}
                  rulesLearned={CATEGORY_ITEMS.length}
                  learned={CATEGORY_ITEMS.flatMap((c) => {
                    const category = state.decisions[c.id]
                    return category ? [{ name: c.name, category }] : []
                  })}
                  onFinish={() => {
                    actions.reset()
                    go('overview')
                  }}
                  onUndo={actions.undo}
                />
              )}
              {state.screen === 'undone' && <UndoneStep removed={derived.importCount} onRestart={actions.reset} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {state.screen === 'review' && (
          <motion.footer
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="sticky bottom-0 rounded-b-[20px] border-t border-line bg-panel/90 px-6 py-4 backdrop-blur md:px-12"
          >
            <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-muted" aria-live="polite">
                {derived.pending > 0
                  ? `Review ${derived.pending} ${derived.pending === 1 ? 'item' : 'items'} to continue. Nothing is saved until you import.`
                  : 'Ready. You can undo this import for 30 days.'}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={actions.reset}>
                  Back
                </Button>
                <Button disabled={derived.pending > 0} onClick={actions.importNow}>
                  Import {derived.importCount} transactions
                </Button>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </>
  )
}
