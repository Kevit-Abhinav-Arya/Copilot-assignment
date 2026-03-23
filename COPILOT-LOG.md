# COPILOT-LOG.md — GitHub Copilot Feature Usage Log

> Real examples of every GitHub Copilot feature used during the development of the Task Management System.

---

## Section 1: Inline Suggestions

> Format: `[file]: [comment typed] → [what Copilot generated]`

| # | File | Comment Typed | What Copilot Generated |
|---|------|--------------|----------------------|
| 1 | `backend/src/types/task.ts` | `// Task Management System — Core Type Definitions. Defines the Task entity, status/priority enums, and input types used across the backend service and route layers. Status workflow (strictly enforced): todo → in-progress → done` | Full `Task` interface with `id`, `title`, `description`, `status`, `priority`, `createdAt`, `updatedAt` fields; `TaskStatus` and `TaskPriority` union types; `CreateTaskInput`, `UpdateTaskInput` utility types; and `TaskStats` aggregate type — all exported with correct TypeScript strict annotations |
| 2 | `backend/src/services/taskService.ts` | `// Task Service — Business Logic Layer. Handles all CRUD operations for tasks, enforces the status workflow (todo → in-progress → done), and computes aggregate statistics. All functions read from and write to the file-based store via fileStore. Routes must not contain business logic — call these functions instead.` | Complete service module: `getAllTasks` with optional `status`/`priority` filter params, `getTaskById` returning `Task \| null`, `createTask` using `crypto.randomUUID()` with ISO timestamps, `updateTask` with workflow enforcement throwing on invalid transitions, `deleteTask`, `completeTask` as a shorthand for the final transition, and `getStats` computing counts per status and priority — all with full JSDoc |
| 3 | `backend/src/routes/tasks.ts` | `// Task Routes — Express Router. All /api/tasks endpoints. Route ordering is critical: GET /api/tasks/stats must come BEFORE GET /api/tasks/:id otherwise "stats" is captured as an id parameter. Each route delegates to the task service (no business logic here). All responses use the { success, data } envelope.` | Full router with 7 endpoints in correct order — `GET /` with query-param filters, `GET /stats`, `GET /:id`, `POST /` with `validateCreateTask` middleware, `PUT /:id` with `validateUpdateTask`, `DELETE /:id`, and `POST /:id/complete` — plus a `param()` helper to safely cast `string \| string[]` to `string` |

---

## Section 2: Agent Mode Usage

> Format: Prompt sent → Files changed → Result

### Usage 1 — Generate the entire backend API
**Prompt:**
```
Build the complete Express + TypeScript backend for the Task Management System.
Create: backend/src/types/task.ts, backend/src/utils/fileStore.ts,
backend/src/services/taskService.ts, backend/src/middleware/validation.ts,
backend/src/routes/tasks.ts, backend/src/app.ts, and backend/src/index.ts.
Follow TDD — write tests first in backend/tests/ then implement. Use crypto.randomUUID()
for IDs. Wrap all responses in { success, data } envelope. Enforce status workflow
todo → in-progress → done, return 422 for invalid transitions.
```

**Files changed:**
- `backend/src/types/task.ts` (created)
- `backend/src/utils/fileStore.ts` (created)
- `backend/src/services/taskService.ts` (created)
- `backend/src/middleware/validation.ts` (created)
- `backend/src/routes/tasks.ts` (created)
- `backend/src/app.ts` (created)
- `backend/src/index.ts` (created)
- `backend/tests/fileStore.test.ts` (created)
- `backend/tests/taskService.test.ts` (created)
- `backend/tests/validation.test.ts` (created)
- `backend/tests/routes.test.ts` (created)

**Result:** Generated all 7 source files and 4 test files covering 50 test cases. Final coverage: 93.37% line coverage. One manual fix was needed: downgraded Jest from v30 to v29 to match ts-jest peer dependency, and replaced the `uuid` npm package with Node's built-in `crypto.randomUUID()` to avoid ESM/CommonJS incompatibility in Jest.

---

### Usage 2 — Generate the complete React frontend
**Prompt:**
```
Generate the full Vite + React + TypeScript frontend for the Task Management System.
Create all components: Badge, Toast, LoadingSpinner, TaskList, TaskRow, TaskModal,
FilterBar, SearchBar. Wire them together in App.tsx which manages all state.
Use useCallback for handlers and useMemo for filtered task list (not useEffect).
Apply industrial-utilitarian dark theme with CSS variables, DM Mono and DM Sans fonts,
amber #f5a623 accent — no inline styles, all CSS in separate .css files per component.
Show LoadingSpinner while fetching and Toast on error.
```

**Files changed:**
- `frontend/src/types/task.ts` (created)
- `frontend/src/services/api.ts` (created)
- `frontend/src/components/Badge.tsx` + `Badge.css` (created)
- `frontend/src/components/Toast.tsx` + `Toast.css` (created)
- `frontend/src/components/LoadingSpinner.tsx` + `LoadingSpinner.css` (created)
- `frontend/src/components/TaskList.tsx` + `TaskList.css` (created)
- `frontend/src/components/TaskRow.tsx` + `TaskRow.css` (created)
- `frontend/src/components/TaskModal.tsx` + `TaskModal.css` (created)
- `frontend/src/components/FilterBar.tsx` + `FilterBar.css` (created)
- `frontend/src/components/SearchBar.tsx` + `SearchBar.css` (created)
- `frontend/src/App.tsx` (fully replaced Vite boilerplate)
- `frontend/src/App.css` (full design system with CSS variables)

**Result:** All components generated with TypeScript strict mode passing (`npx tsc --noEmit` clean). LoadingSpinner shown during initial fetch, Toast auto-dismisses after 3 s, Complete button disabled unless task is `in-progress`, TaskModal handles both Add and Edit modes with controlled inputs.

---

### Usage 3 — Generate Playwright E2E test suite from plan
**Prompt:**
```
Generate a Playwright E2E test suite at e2e/tests/tasks.spec.ts covering:
1. Page loads and shows the task list
2. Empty state message when no tasks
3. Add a new task via the modal form
4. Edit an existing task
5. Complete a task using the full todo → in-progress → done workflow
6. Delete a task and verify it disappears
7. Priority filter shows only matching tasks
8. Live search bar filters tasks as you type
Use baseURL http://localhost:5173. Assume the backend is running on port 3000.
```

**Files changed:**
- `e2e/tests/tasks.spec.ts` (created)
- `e2e/playwright.config.ts` (created)

**Result:** 7 Playwright specs generated covering all required flows. The config uses `webServer` to auto-start both backend and frontend before the test run.

---

## Section 3: Sub-Agent Usage

### @ui-agent
**Prompt:**
```
@ui-agent Style all React components (Badge, Toast, TaskModal, TaskList, TaskRow,
FilterBar, SearchBar, LoadingSpinner) with an industrial-utilitarian dark theme.
Use CSS custom properties for the color palette (--bg-primary, --bg-secondary,
--accent, --text-primary, --text-muted, --border). Accent color #f5a623 amber.
No inline styles. Each component gets its own .css file. Ensure WCAG 2.1 AA
color contrast on all interactive elements.
```

**Result:** Generated paired `.css` file for every component. CSS variables defined once in `App.css` and consumed everywhere. Badge colors use distinct palette per status/priority (amber for high, teal for in-progress, etc.). Modal uses centered overlay with backdrop blur. LoadingSpinner is pure CSS keyframe animation. All interactive buttons and inputs have visible `:focus-visible` outlines for accessibility.

---

### @backend-agent
**Prompt:**
```
@backend-agent Add full JSDoc comments to every exported function in
backend/src/services/taskService.ts and backend/src/routes/tasks.ts.
Each JSDoc must include @param (with type and description), @returns (with type),
and @throws where applicable (status workflow violations, not-found errors).
Follow the copilot-instructions.md review rules.
```

**Result:** All 7 service functions and all 7 route handlers received complete JSDoc blocks. `createTask` documents `@throws {Error}` for empty title, `updateTask` documents `@throws {Error}` for invalid workflow transitions (returns 422), `getTaskById` documents `@returns {Promise<Task | null>}`. Routes document the HTTP status codes they return per the `{ success, data }` envelope contract.

---

### @testing-agent
**Prompt:**
```
@testing-agent Generate comprehensive unit tests for the backend using Jest + ts-jest.
Cover: fileStore (ENOENT returns [], persist+retrieve, overwrite), taskService
(getAllTasks filters, getTaskById null/found, createTask auto-id + status,
updateTask valid/invalid transitions, deleteTask not-found, completeTask,
getStats counts), validation middleware (missing title, empty title, title too long,
invalid priority/status, valid body passes), and route integration via supertest
(all 7 endpoints, check both res.status and res.body.success).
Target >80% line coverage.
```

**Result:** Generated 50 tests across 4 files (fileStore: 3, taskService: 21, validation: 11, routes: 15). All 50 pass. Line coverage: 93.37%. Edge cases covered include: ENOENT file not found, status workflow violations (todo→done returns 422), title length boundary (200 chars), concurrent read/write isolation via `TASKS_DATA_PATH` env variable per test suite.

---

## Section 4: Review Agent

**Copilot Chat Prompt Used:**
```
Review backend/src/routes/tasks.ts according to .github/copilot-instructions.md and list issues
```

**Issues Found:**
- Missing JSDoc comments on all exported route handler functions
- `POST /` and `PUT /:id` handlers needed explicit confirmation that validation middleware was wired before the async handler
- `req.params['id']` typed as `string | string[]` — not safe to pass directly to service functions expecting `string`
- Error handler in `app.ts` needed all 4 parameters `(err, req, res, next)` to be recognized as an Express error handler
- `catch` block in one route was initially empty — violates the no-empty-catch rule in copilot-instructions.md

**Fixes Applied:**
- Added JSDoc with `@param`, `@returns`, and `@throws` to all 7 route handlers in `backend/src/routes/tasks.ts`
- Confirmed `validateCreateTask` and `validateUpdateTask` middleware are applied before handlers on POST and PUT
- Added `param(req, 'id')` helper function that safely extracts a `string` from `req.params` regardless of type
- Updated `app.ts` global error handler signature to include all 4 Express error-handler parameters
- Added `next(err)` call in all catch blocks to propagate errors to the global handler

---

## Section 5: Skills Integration

| Skill | Prompt Used | Changes Made |
|-------|------------|--------------|
| `backend-development` | "Apply backend-development skill patterns to the Express API: OWASP security practices, SOLID principles, 70-20-10 test pyramid, structured error handling" | (1) File I/O wrapped with `isNodeError` type guard to avoid swallowing unknown errors; (2) CORS restricted to `localhost:5173` and `localhost:5174` only — not wildcard; (3) JSON body limit set to `1mb` to prevent oversized payload attacks; (4) All catch blocks call `next(err)` for centralized error handling |
| `vercel-react-best-practices` | "Apply Vercel React best practices to App.tsx: avoid useEffect for derived state, use useCallback for stable handler references, useMemo for expensive computations" | (1) Replaced `useEffect` + state for filtered tasks with `useMemo` — filtering now happens synchronously during render with no extra re-render; (2) All event handlers (`handleCreate`, `handleUpdate`, `handleDelete`, `handleComplete`) wrapped in `useCallback` with correct dependency arrays — prevents unnecessary re-renders of child components |
| `backend-testing` | "Apply backend-testing skill: TDD cycle, Jest configuration for TypeScript, test isolation via environment variables, supertest for route integration tests" | (1) Each test suite overrides `TASKS_DATA_PATH` to a temp file — tests never touch the real `data/tasks.json`; (2) `afterEach` cleanup deletes temp files so tests are fully isolated; (3) Jest config uses inline `tsconfig` override in `transform` to enforce CommonJS module resolution in test environment |
| `frontend-design` | "Apply frontend-design skill: design system with CSS custom properties, industrial-utilitarian aesthetic, accessible color contrast, micro-interactions" | (1) Defined 12 CSS custom properties in `:root` (colors, spacing, border-radius, shadows) in `App.css` — consistent across all 9 components; (2) DM Mono + DM Sans loaded via Google Fonts; (3) Button `:hover` and `:active` states with translate transforms for tactile feel; (4) Focus rings on all interactive elements using `outline-offset` |

---

## Section 6: Playwright MCP

**MCP config:** `.vscode/mcp.json` — `npx @playwright/mcp@latest --vision`

**Screenshot taken:** Yes — Playwright MCP navigated to `http://localhost:5173` during an Agent Mode session and captured the live app state.

**Prompt used:**
```
Use the Playwright MCP to navigate to http://localhost:5173, take a screenshot,
then generate an E2E test in e2e/tests/tasks.spec.ts that:
1. Verifies the page title and empty state message
2. Opens the Add Task modal, fills in title "Buy groceries" with priority High, submits
3. Verifies the new task appears in the list with the correct priority badge
4. Clicks Complete to advance the task through todo → in-progress → done
5. Verifies the status badge reflects each transition
```

**E2E test generated:** `e2e/tests/tasks.spec.ts`

**Tests in file:** 8 specs
- `page loads and shows the task board`
- `shows empty state when no tasks exist`
- `can add a new task`
- `can edit an existing task`
- `can complete a task via status workflow`
- `can delete a task`
- `priority filter shows only matching tasks`
- `search bar filters tasks by title`

**Test run result:** All 8 tests passed (`npx playwright test` — 11.2s)

**Fixes applied during test run debugging:**
- Selector `getByLabel('Title')` was ambiguous (matched both search bar and modal input) — fixed to `#task-title`
- Selector `select[name="priority"]` was ambiguous (matched filter bar and modal) — fixed to `#task-priority` / `#filter-priority`
- `getByRole('button', { name: 'Edit' })` matched all 3 action buttons (aria-labels include task title) — fixed to CSS class selectors `.btn--ghost`, `.btn--accent`, `.btn--danger`
- `nodemon` was restarting the backend on every write to `data/tasks.json` causing request failures — fixed by adding `nodemon.json` with `"watch": ["src"], "ignore": ["data/"]`
