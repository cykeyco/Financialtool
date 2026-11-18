import { useCallback, useEffect, useReducer, useRef } from 'react'
import {
  CATEGORY_ITEMS,
  DUPLICATES,
  FILES,
  REVIEW_ITEMS,
  analysisSteps,
  readyRowCount,
  type ImportFile,
} from '../data/mockData'

export type Screen = 'upload' | 'analyzing' | 'review' | 'done' | 'undone'
export type DuplicateChoice = 'skip' | 'keep'
export type MappingChoice = 'use-suggestion' | 'skip'

type State = {
  screen: Screen
  file: ImportFile
  progress: number // analysis steps completed
  mappingChoice: MappingChoice | null
  decisions: Record<string, string> // item id → 'skip' | 'keep' | category name
  lastDecided: string | null // for the one-step "Undo" after a single decision
}

type Action =
  | { type: 'start'; file: ImportFile }
  | { type: 'progress'; value: number }
  | { type: 'analysisDone' }
  | { type: 'chooseMapping'; choice: MappingChoice | null }
  | { type: 'decide'; id: string; choice: string; bulk?: boolean }
  | { type: 'undecide'; id: string }
  | { type: 'import' }
  | { type: 'undo' }
  | { type: 'reset' }

const initial: State = {
  screen: 'upload',
  file: FILES.clean,
  progress: 0,
  mappingChoice: null,
  decisions: {},
  lastDecided: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return { ...initial, screen: 'analyzing', file: action.file }
    case 'progress':
      return { ...state, progress: action.value }
    case 'analysisDone':
      return { ...state, screen: 'review' }
    case 'chooseMapping':
      return { ...state, mappingChoice: action.choice }
    case 'decide':
      return {
        ...state,
        decisions: { ...state.decisions, [action.id]: action.choice },
        lastDecided: action.bulk ? null : action.id,
      }
    case 'undecide': {
      const decisions = { ...state.decisions }
      delete decisions[action.id]
      return { ...state, decisions, lastDecided: null }
    }
    case 'import':
      return pendingCount(state) === 0 ? { ...state, screen: 'done' } : state
    case 'undo':
      return { ...state, screen: 'undone' }
    case 'reset':
      return initial
  }
}

function pendingCount(state: State) {
  const items = REVIEW_ITEMS.filter((i) => !(i.id in state.decisions)).length
  return items + (state.mappingChoice ? 0 : 1)
}

const STEP_MS = 700

export function useImportFlow() {
  const [state, dispatch] = useReducer(reducer, initial)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  // Fake analysis: tick through the steps, then move to review.
  useEffect(() => {
    if (state.screen !== 'analyzing') return
    const steps = analysisSteps(state.file).length
    for (let n = 1; n <= steps; n++) later(() => dispatch({ type: 'progress', value: n }), n * STEP_MS)
    later(() => dispatch({ type: 'analysisDone' }), steps * STEP_MS + 500)
    return clearTimers
  }, [state.screen, state.file, later, clearTimers])

  useEffect(() => clearTimers, [clearTimers])

  const pendingItems = REVIEW_ITEMS.filter((i) => !(i.id in state.decisions))
  const keptDuplicates = DUPLICATES.filter((d) => state.decisions[d.id] === 'keep').length
  const skippedDuplicates = DUPLICATES.filter((d) => state.decisions[d.id] === 'skip').length
  const ready = readyRowCount(state.file)

  const derived = {
    ready,
    pending: pendingCount(state),
    pendingDuplicates: DUPLICATES.filter((d) => !(d.id in state.decisions)),
    pendingCategories: CATEGORY_ITEMS.filter((c) => !(c.id in state.decisions)),
    importCount: ready + CATEGORY_ITEMS.length + keptDuplicates,
    skippedDuplicates,
    unreadable: state.file.unreadableRows.length,
    steps: analysisSteps(state.file),
  }

  const actions = {
    start: (file: ImportFile) => dispatch({ type: 'start', file }),
    chooseMapping: (choice: MappingChoice | null) => dispatch({ type: 'chooseMapping', choice }),
    decide: (id: string, choice: string) => dispatch({ type: 'decide', id, choice }),
    /** Accept every suggestion, one after another, so the user sees each item resolve. */
    acceptAll: () => {
      if (!state.mappingChoice) dispatch({ type: 'chooseMapping', choice: 'use-suggestion' })
      pendingItems.forEach((item, i) => {
        const choice = item.kind === 'category' ? item.suggested : 'skip'
        later(() => dispatch({ type: 'decide', id: item.id, choice, bulk: true }), i * 90)
      })
    },
    undoDecision: (id: string) => dispatch({ type: 'undecide', id }),
    importNow: () => dispatch({ type: 'import' }),
    undo: () => dispatch({ type: 'undo' }),
    reset: () => {
      clearTimers()
      dispatch({ type: 'reset' })
    },
  }

  return { state, derived, actions }
}

export type ImportFlow = ReturnType<typeof useImportFlow>
