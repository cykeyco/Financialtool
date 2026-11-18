import { useEffect, useState } from 'react'

export const ROUTES = ['overview', 'monthly', 'budget', 'retirement', 'import'] as const
export type Route = (typeof ROUTES)[number]

const parse = (): Route => {
  const h = window.location.hash.replace('#', '')
  return (ROUTES as readonly string[]).includes(h) ? (h as Route) : 'overview'
}

/** Tiny hash router: #overview, #monthly, #budget, #retirement, #import */
export function useHashRoute() {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => {
      setRoute(parse())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const go = (r: Route) => {
  window.location.hash = r
}
