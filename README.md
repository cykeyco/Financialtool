# Import data — AI review prototype

A clickable prototype of a bank-import flow where an AI matches columns, flags
possible duplicates and suggests categories, and the user reviews anything
uncertain before import.

**Flow:** Upload → AI analysis → Review (column mapping + review queue) → Imported → Undo

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
| `src/data/mockData.ts` | File, columns, duplicates, categories, AI reasoning text |
| `src/state/importFlow.ts` | Flow state (reducer), fake analysis timing, derived counts |
| `src/steps/UploadStep.tsx` | Drop zone + sample files (clean / with problems) |
| `src/steps/AnalyzingStep.tsx` | Step-by-step analysis progress |
| `src/steps/review/MappingPanel.tsx` | Column mapping with confidence and “why” |
| `src/steps/review/ReviewQueue.tsx` | Duplicates and categories, accept all, single-step undo |
| `src/steps/ResultSteps.tsx` | Imported summary and undone state |
| `src/App.tsx` | Page shell, stepper, screen transitions, sticky footer |

## Design rules built in

- Confidence ≥ 95% is applied automatically; below that the user decides.
- Every AI decision shows its reason, collapsed by default.
- Import is blocked until everything is reviewed; the count updates live.
- Every decision can be undone: one item at a time, or the whole import.
- Respects “reduce motion”; focus moves to each new screen’s heading.
