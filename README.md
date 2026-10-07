# fe-interview-prep

Five self-contained **React + TypeScript** features, each on its own route and shipped as its own pull
request, merged into `main` in order Q1 → Q5.

> 🎥 **Walkthrough video:** _add YouTube link here after recording._

## Stack & tooling

| Concern     | Choice                                          | Why                                                                                     |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| Build tool  | **Vite** (`@vitejs/plugin-react-swc`)           | Fast dev server + build; first-class TS.                                                |
| Language    | **TypeScript, strict mode**                     | Required; catches bugs at the type level.                                               |
| Routing     | **react-router-dom**                            | Each question is a route; standard SPA routing.                                         |
| State       | **Zustand**                                     | Minimal typed stores for feature state; less boilerplate than Redux for small features. |
| Forms       | **React Hook Form + Zod**                       | Uncontrolled perf + schema validation with inferred types.                              |
| Styling     | **Tailwind CSS v4**                             | Utility-first; no component library doing the work for us.                              |
| Testing     | **Vitest + Testing Library**                    | Vite-native runner; tests drive the UI like a user.                                     |
| Lint/format | **ESLint (flat, typescript-eslint) + Prettier** | `--max-warnings=0` gate; Prettier for formatting.                                       |

**Rule honoured:** no library does the _core work_ of a question — the Kanban drag-and-drop uses native
HTML5 drag events and the Dashboard charts are hand-drawn SVG. Libraries that are _not_ the point of a
question (router, state, forms, styling) are used freely.

## Features

| Q   | Route        | Feature                                             | Branch                 |
| --- | ------------ | --------------------------------------------------- | ---------------------- |
| 1   | `/cart`      | Shopping cart with quantity controls & live total   | `feature/q1-cart`      |
| 2   | `/feed`      | Infinite feed that never fires duplicate page loads | `feature/q2-feed`      |
| 3   | `/kanban`    | Drag-and-drop Kanban board (native DnD)             | `feature/q3-kanban`    |
| 4   | `/dashboard` | Metrics dashboard with filters & hand-rolled charts | `feature/q4-dashboard` |
| 5   | `/comments`  | Nested, editable threaded comments                  | `feature/q5-comments`  |

On `main` each route renders a brief placeholder; the real implementation lands on its feature branch.

## Getting started

```bash
npm install
npm run dev      # start the dev server
```

## Scripts

| Script               | Does                                        |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Vite dev server                             |
| `npm run build`      | Type-check (`tsc -b`) then production build |
| `npm run preview`    | Preview the production build                |
| `npm run lint`       | ESLint, fails on any warning                |
| `npm run typecheck`  | Type-check without emitting                 |
| `npm test`           | Run the test suite once (Vitest)            |
| `npm run test:watch` | Vitest in watch mode                        |
| `npm run format`     | Prettier write                              |

## Project structure

```
src/
  main.tsx            app entry (BrowserRouter)
  App.tsx             layout + nav + <Routes>, generated from routes.tsx
  routes.tsx          single source of truth for nav + router
  pages/              one page per route (Q1–Q5 + Home)
  components/         shared components
  features/<q>/       each feature's components, store and logic (added per branch)
  test/setup.ts       Testing Library + jest-dom setup
```

## Workflow

Each question is **one branch, one PR, one merge**, in order:

```bash
git switch main && git pull --ff-only
git switch -c feature/q1-cart
# … build + commit in small, meaningful steps …
git push -u origin HEAD
gh pr create --base main --title "Q1: shopping cart" --body-file pr-body.md   # uses the PR template
# review your own diff, merge, then pull main before the next branch
```

PRs use the template in `.github/PULL_REQUEST_TEMPLATE.md` (Problem / Approach / Decisions &
trade-offs / Screenshots / How to test).
