import { useEffect, useRef } from 'react'

/**
 * Moves keyboard / screen-reader focus to the new screen's heading when the
 * flow changes screens, so the user is not left on a button that disappeared.
 */
export function useFocusOnMount<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (enabled) ref.current?.focus({ preventScroll: true })
  }, [enabled])
  return ref
}
