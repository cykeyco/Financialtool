import { useFocusOnMount } from '../components/useFocusOnMount'
import type { ImportFlow } from '../state/importFlow'
import { ErrorBanner } from './review/ErrorBanner'
import { MappingPanel } from './review/MappingPanel'
import { ReviewQueue } from './review/ReviewQueue'
import { SummaryBar } from './review/SummaryBar'

export function ReviewStep({ flow }: { flow: ImportFlow }) {
  const { state, derived, actions } = flow
  const heading = useFocusOnMount<HTMLHeadingElement>()

  return (
    <div className="flex flex-col gap-8">
      <h2 ref={heading} tabIndex={-1} className="sr-only">
        Review your import
      </h2>
      <SummaryBar
        fileName={state.file.name}
        rows={state.file.rows}
        ready={derived.ready}
        pending={derived.pending}
        unreadable={derived.unreadable}
      />
      <ErrorBanner rows={state.file.unreadableRows} />
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <MappingPanel choice={state.mappingChoice} onChoose={actions.chooseMapping} />
        <ReviewQueue
          duplicates={derived.pendingDuplicates}
          categories={derived.pendingCategories}
          decisions={state.decisions}
          lastDecided={state.lastDecided}
          onDecide={actions.decide}
          onUndo={actions.undoDecision}
          onAcceptAll={actions.acceptAll}
        />
      </div>
    </div>
  )
}
