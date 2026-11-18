import type { ReactNode } from 'react'
import { DocIcon, GridIcon, HomeIcon, ImportIcon, PieIcon, TrendIcon } from './icons'
import type { Route } from './useHashRoute'

const NAV: { route: Route; label: string; icon: typeof GridIcon }[] = [
  { route: 'overview', label: 'Overview', icon: GridIcon },
  { route: 'monthly', label: 'Monthly entry', icon: DocIcon },
  { route: 'budget', label: 'Budget', icon: PieIcon },
  { route: 'retirement', label: 'Retirement', icon: TrendIcon },
  { route: 'import', label: 'Import data', icon: ImportIcon },
]

export function AppShell({ route, children }: { route: Route; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <nav
        aria-label="Main"
        className="flex shrink-0 flex-col gap-8 border-b border-line bg-canvas px-4 py-6 md:sticky md:top-0 md:h-screen md:w-58 md:border-r md:border-b-0"
      >
        <a href="#overview" className="flex items-center gap-2.5 px-2 text-ink">
          <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-md bg-ink text-white">
            <HomeIcon />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Household</span>
        </a>
        <ul className="flex flex-wrap gap-0.5 md:flex-col">
          {NAV.map(({ route: r, label, icon: Icon }) => {
            const current = r === route
            return (
              <li key={r}>
                <a
                  href={`#${r}`}
                  aria-current={current ? 'page' : undefined}
                  className={`flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
                    current
                      ? 'bg-white font-medium text-ink shadow-[0_0_0_1px_var(--color-line)]'
                      : 'text-ink-2 hover:bg-white/60 hover:text-ink'
                  }`}
                >
                  <Icon />
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
        <div className="mt-auto hidden items-center gap-2.5 p-2 md:flex">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-full bg-line text-xs font-semibold text-ink-2"
          >
            FA
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-medium">Family account</span>
            <span className="text-xs text-subtle">2 members</span>
          </span>
        </div>
      </nav>
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  )
}
