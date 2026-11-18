# Household — finance tool prototype

A working prototype of a household finance tool with five pages:

- **Overview** — net worth and its trend, this month in four numbers, assets, budget, retirement goal
- **Monthly entry** — update account balances and income; totals and the summary update live
- **Budget** — what's left, per-category budgets with an editor, savings goals kept separate
- **Retirement** — live projection in today's money, on-track verdict, what-if scenarios
- **Import data** — an AI matches columns, flags duplicates and suggests categories; the user reviews anything uncertain

Pages share one data store, so a change in one shows up everywhere (edit a budget → Overview updates).
Edits are remembered in the browser (localStorage). Clear site data to get the sample data back.

All data is fictional and hard-coded in `src/data/mockData.ts`. Nothing is parsed or saved.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
```

## Build and deploy

```bash
npm run build                 # dist/ — deploy to Vercel or Netlify
npm run build -- --mode single  # dist-single/index.html — one self-contained file
```

On Vercel: import the repo, framework preset "Vite", no other settings.

## Stack

React 19 · TypeScript · Tailwind CSS v4 · Motion (animations) · Vite

## Where things are

| Path | What |
| --- | --- |
| `src/index.css` | Design tokens: colours, fonts, tabular numbers |
| `src/App.tsx` | Page routing (#overview, #monthly, #budget, #retirement, #import) |
| `src/state/household.tsx` | Shared household data, sample numbers, derived totals |
| `src/pages/*.tsx` | One file per page |
| `src/components/ui.tsx` | Page header, fields, progress bar, stat |
| `src/components/LineChart.tsx` | Line chart used on Overview and Retirement |
| `src/lib/retirement.ts` | Retirement projection maths |
| `src/data/mockData.ts` | File, columns, duplicates, categories, AI reasoning text |
| `src/state/importFlow.ts` | Flow state (reducer), fake analysis timing, derived counts |
| `src/steps/UploadStep.tsx` | Drop zone + sample files (clean / with problems) |
| `src/steps/AnalyzingStep.tsx` | Step-by-step analysis progress |
| `src/steps/review/MappingPanel.tsx` | Column mapping with confidence and “why” |
| `src/steps/review/ReviewQueue.tsx` | Duplicates and categories, accept all, single-step undo |
| `src/steps/ResultSteps.tsx` | Imported summary and undone state |
| `src/pages/ImportPage.tsx` | Import flow: stepper, screen transitions, sticky footer |

## Design rules built in

- Confidence ≥ 95% is applied automatically; below that the user decides.
- Every AI decision shows its reason, collapsed by default.
- Import is blocked until everything is reviewed; the count updates live.
- Every decision can be undone: one item at a time, or the whole import.
- Respects “reduce motion”; focus moves to each new screen’s heading.
