import type { ReactNode } from 'react'
import { DocIcon, GridIcon, HomeIcon, ImportIcon, MoonIcon, PieIcon, SunIcon, TrendIcon } from './icons'
import { useTheme } from './useTheme'
import type { Route } from './useHashRoute'

const NAV: { route: Route; label: string; icon: typeof GridIcon }[] = [
  { route: 'overview', label: 'Overview', icon: GridIcon },
  { route: 'monthly', label: 'Monthly entry', icon: DocIcon },
  { route: 'budget', label: 'Budget', icon: PieIcon },
  { route: 'retirement', label: 'Retirement', icon: TrendIcon },
  { route: 'import', label: 'Import data', icon: ImportIcon },
]

export function AppShell({ route, children }: { route: Route; children: ReactNode }) {
  const { theme, toggle } = useTheme()
  const night = theme === 'dark'
  return (
    <div className="flex min-h-screen flex-col bg-backdrop md:flex-row">
      <nav
        aria-label="Main"
        className="flex shrink-0 flex-col gap-8 px-4 py-6 md:sticky md:top-0 md:h-screen md:w-58"
      >
        <a href="#overview" className="flex items-center gap-2.5 px-2 text-ink">
          <span aria-hidden="true" className="flex size-6 items-center justify-center bg-lime text-black">
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
                  className={`flex min-h-9 items-center gap-2.5 px-2.5 py-2 transition-colors ${
                    current
                      ? 'bg-white font-medium text-ink shadow-[0_0_0_1px_var(--color-card-ring)]'
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
        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={night}
            onClick={toggle}
            className="flex min-h-9 cursor-pointer items-center gap-2.5 px-2.5 py-2 text-left text-ink-2 transition-colors hover:bg-white/60 hover:text-ink"
          >
            {night ? <MoonIcon /> : <SunIcon />}
            <span>Night mode</span>
            <span
              aria-hidden="true"
              className={`ml-auto flex h-5 w-9 items-center p-0.5 transition-colors duration-200 ${
                night ? 'bg-accent' : 'bg-line-strong'
              }`}
            >
              <span
                className={`size-4 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-transform duration-200 ${
                  night ? 'translate-x-4' : ''
                }`}
              />
            </span>
          </button>
          <div className="hidden items-center gap-2.5 p-2 md:flex">
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center bg-line text-xs font-semibold text-ink-2"
            >
              FA
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-medium">Family account</span>
              <span className="text-xs text-subtle">2 members</span>
            </span>
          </div>
        </div>
      </nav>
      <main className="m-2 flex min-w-0 flex-1 flex-col bg-panel md:my-3 md:mr-3 md:ml-0">{children}</main>
    </div>
  )
}
