import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { AppShell } from './components/AppShell'
import { useHashRoute, type Route } from './components/useHashRoute'
import { BudgetPage } from './pages/BudgetPage'
import { ImportPage } from './pages/ImportPage'
import { MonthlyEntryPage } from './pages/MonthlyEntryPage'
import { OverviewPage } from './pages/OverviewPage'
import { RetirementPage } from './pages/RetirementPage'
import { HouseholdProvider } from './state/household'

const TITLES: Record<Route, string> = {
  overview: 'Overview',
  monthly: 'Monthly entry',
  budget: 'Budget',
  retirement: 'Retirement',
  import: 'Import data',
}

export default function App() {
  const route = useHashRoute()

  useEffect(() => {
    document.title = `${TITLES[route]} — Household`
  }, [route])

  return (
    <MotionConfig reducedMotion="user">
      <HouseholdProvider>
        <AppShell route={route}>
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              className="flex flex-1 flex-col"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {route === 'import' ? (
                <ImportPage />
              ) : (
                <div className="flex-1 px-6 pt-10 pb-16 md:px-12">
                  <div className="mx-auto max-w-[1120px]">
                    {route === 'overview' && <OverviewPage />}
                    {route === 'monthly' && <MonthlyEntryPage />}
                    {route === 'budget' && <BudgetPage />}
                    {route === 'retirement' && <RetirementPage />}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </AppShell>
      </HouseholdProvider>
    </MotionConfig>
  )
}
