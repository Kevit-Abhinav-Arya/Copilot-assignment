# AGENTS.md — Task Management System

## Project Architecture

This is a **monorepo** with three top-level packages:

| Directory | Purpose |
|-----------|---------|
| `backend/` | Express + TypeScript REST API, file-based persistence |
| `frontend/` | Vite + React + TypeScript SPA |
| `e2e/` | Playwright end-to-end tests |

### Backend Structure

```
backend/src/
  types/task.ts          # Task interface, union types, input types
  utils/fileStore.ts     # JSON file read/write (data/tasks.json)
  services/taskService.ts # CRUD business logic, status workflow, stats
  middleware/validation.ts # Express request validation
  routes/tasks.ts        # Express router (all /api/tasks endpoints)
  app.ts                 # Express app config (exported for supertest)
  index.ts               # Server entry point (.listen on port 3000)
```

### Frontend Structure

```
frontend/src/
  types/task.ts          # Mirrored Task types from backend
  services/api.ts        # HTTP client for all backend endpoints
  components/
    Badge.tsx            # Color-coded status/priority badges
    Toast.tsx            # Success/error notifications
    LoadingSpinner.tsx   # Loading indicator
    TaskList.tsx         # Main task table
    TaskRow.tsx          # Individual task row with action buttons
    TaskModal.tsx        # Add/Edit form modal
    FilterBar.tsx        # Status/priority dropdowns
    SearchBar.tsx        # Live title search input
  App.tsx                # Root component — state, composition, wiring
```

---

## Coding Standards

### TypeScript
- **Strict mode** enabled — no `any` types, ever
- All public functions must have **JSDoc comments** (`@param`, `@returns`, `@throws`)
- Use `const` by default; only `let` when mutation is necessary
- Prefer explicit return types on exported functions

### API Conventions
- All responses wrapped in **`{ success: boolean, data: T }`** envelope
- Error responses: **`{ success: false, error: string }`**
- HTTP status codes must be semantically correct:
  - `200` OK, `201` Created, `400` Bad Request (validation), `404` Not Found, `422` Unprocessable Entity (business rule violation), `500` Internal Server Error

### Status Workflow (enforced in backend)
Tasks follow a **strict one-way workflow**:
```
todo → in-progress → done
```
Any other transition (e.g., `todo → done`, `done → todo`) must throw an error and return `422`.

### ESLint / Prettier
- No unused variables or imports
- No empty catch blocks — always log or rethrow
- No console.log in production code (use structured error handling)

---

## Sub-Agents

### `@ui-agent` (see `ui-agent.agent.md`)
**Specialist for:** React components, CSS modules, loading/error states, accessibility, modal/toast UI patterns.

Use `@ui-agent` when:
- Building or styling React components
- Adding loading spinners, empty states, or error messages
- Ensuring WCAG 2.1 AA compliance

### `@backend-agent` (see `backend-agent.agent.md`)
**Specialist for:** Express routes, input validation, business logic, file persistence, JSDoc documentation.

Use `@backend-agent` when:
- Adding or modifying API endpoints
- Implementing business logic in the service layer
- Adding JSDoc to backend functions

### `@testing-agent` (see `testing-agent.agent.md`)
**Specialist for:** Jest unit tests, Playwright E2E, mocking file I/O, coverage enforcement, edge cases.

Use `@testing-agent` when:
- Writing or improving unit tests
- Creating or extending Playwright specs
- Debugging test failures or coverage gaps

---

## Patterns to Follow

- **TDD** — write failing tests before implementing features (backend)
- **Small functions** — each function does one thing; max ~30 lines
- **Proper HTTP status codes** — always match the semantic meaning
- **Input validation at boundaries** — validate all POST/PUT request bodies
- **Error envelope** — always return `{ success, data/error }` from API
- **Functional React** — use hooks, no class components

## Patterns to Avoid

- `any` TypeScript type
- Empty catch blocks: `catch (e) {}`
- Inline styles in React components (use CSS classes)
- Business logic in route handlers (keep routes thin, logic in services)
- Mutable global state
- Unhandled promise rejections
