# Task Management System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack Task Management System (REST API + React frontend) demonstrating GitHub Copilot features at every stage.

**Architecture:** Monorepo with `backend/` (Express + TypeScript) and `frontend/` (Vite + React + TypeScript). File-based persistence via `tasks.json`. All API responses wrapped in `{ success, data }` envelope. Status workflow enforced: `todo → in-progress → done`.

**Tech Stack:** Node.js, Express, TypeScript, Vite, React, Jest, Playwright, UUID

---

## Phase 1: Project Scaffolding & Configuration

### Task 1.1: Initialize Monorepo Structure

**Files:**
- Create: `package.json` (root — workspace scripts)
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/jest.config.ts`
- Create: `frontend/` (via `npm create vite@latest`)

- [ ] **Step 1:** Create root `package.json` with scripts to run both backend and frontend (use `concurrently`)
- [ ] **Step 2:** Initialize backend: `mkdir backend && cd backend && npm init -y`
- [ ] **Step 3:** Install backend deps: `express cors uuid` and dev deps: `typescript @types/express @types/cors @types/uuid ts-node nodemon jest ts-jest @types/jest supertest @types/supertest`
- [ ] **Step 4:** Create `backend/tsconfig.json` — target ES2020, module NodeNext, outDir `dist/`, rootDir `src/`
- [ ] **Step 5:** Create `backend/jest.config.ts` — set `preset: 'ts-jest'`, `testEnvironment: 'node'`, roots `['<rootDir>/tests']`
- [ ] **Step 6:** Scaffold frontend: `npm create vite@latest frontend -- --template react-ts`
- [ ] **Step 7:** Install frontend deps: `cd frontend && npm install`
- [ ] **Step 8:** Configure Vite proxy in `frontend/vite.config.ts` — proxy `/api` to `http://localhost:3000`
- [ ] **Step 9:** Install root orchestration: `npm install -D concurrently` in root
- [ ] **Step 10:** Add root scripts: `"dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""`
- [ ] **Step 11:** Commit: `git init && git add . && git commit -m "chore: scaffold monorepo with backend + frontend"`

### Task 1.2: Set Up Playwright for E2E

**Files:**
- Create: `e2e/playwright.config.ts`
- Create: `e2e/package.json`

- [ ] **Step 1:** `mkdir e2e && cd e2e && npm init -y && npm install -D @playwright/test`
- [ ] **Step 2:** Run `npx playwright install` to install browsers
- [ ] **Step 3:** Create `e2e/playwright.config.ts` — baseURL `http://localhost:5173`, webServer config to start both backend + frontend
- [ ] **Step 4:** Commit: `git add . && git commit -m "chore: add Playwright E2E setup"`

---

## Phase 2: GitHub Copilot Configuration Files

### Task 2.1: Create AGENTS.md

**Files:**
- Create: `AGENTS.md`

- [ ] **Step 1:** Write `AGENTS.md` documenting: project architecture (Express + React + TS monorepo), coding standards (ESLint, Prettier, strict TS), API envelope `{ success: bool, data: ... }`, description of 3 sub-agents, patterns to follow (TDD, small functions, proper HTTP status codes), patterns to avoid (`any` type, empty catch blocks, inline styles)
- [ ] **Step 2:** Commit: `git add AGENTS.md && git commit -m "docs: add AGENTS.md"`

### Task 2.2: Create Sub-Agent Definition Files

**Files:**
- Create: `ui-agent.agent.md`
- Create: `backend-agent.agent.md`
- Create: `testing-agent.agent.md`

- [ ] **Step 1:** Create `ui-agent.agent.md` — name, description (frontend specialist), capabilities (React components, CSS, loading states, error toasts, accessibility), context (`frontend/src/**`), instructions (use React functional components, CSS modules or utility classes, always show loading/error states)
- [ ] **Step 2:** Create `backend-agent.agent.md` — name, description (backend specialist), capabilities (Express routes, validation, business logic, file persistence, documentation), context (`backend/src/**`), instructions (validate all inputs, use proper HTTP codes, wrap responses in envelope, add JSDoc)
- [ ] **Step 3:** Create `testing-agent.agent.md` — name, description (testing specialist), capabilities (Jest unit tests, Playwright E2E, coverage >80%), context (`backend/tests/**`, `e2e/**`), instructions (TDD, test edge cases, mock file I/O, assert HTTP status codes)
- [ ] **Step 4:** Commit: `git add *.agent.md && git commit -m "docs: add 3 sub-agent definitions"`

### Task 2.3: Create copilot-instructions.md

**Files:**
- Create: `.github/copilot-instructions.md`

- [ ] **Step 1:** Create `.github/copilot-instructions.md` with review rules: JSDoc on all public functions, input validation on POST/PUT, correct HTTP status codes (400/404/422/500), no empty catch blocks, frontend loading states + error handling, test coverage >80%
- [ ] **Step 2:** Commit: `git add .github/ && git commit -m "docs: add copilot-instructions.md review rules"`

### Task 2.4: Create Playwright MCP Config

**Files:**
- Create: `.vscode/mcp.json`

- [ ] **Step 1:** Create `.vscode/mcp.json` with content:
  ```json
  { "servers": { "playwright": { "command": "npx", "args": ["@playwright/mcp@latest", "--vision"] } } }
  ```
- [ ] **Step 2:** Commit: `git add .vscode/ && git commit -m "chore: add Playwright MCP config"`

### Task 2.5: Create COPILOT-LOG.md Template

**Files:**
- Create: `COPILOT-LOG.md`

- [ ] **Step 1:** Create `COPILOT-LOG.md` with all 6 sections as specified in requirements (Inline Suggestions, Agent Mode, Sub-Agent Usage, Review Agent, Skills, Playwright MCP) — leave as template to fill during development
- [ ] **Step 2:** Commit: `git add COPILOT-LOG.md && git commit -m "docs: add COPILOT-LOG.md template"`

---

## Phase 3: Backend — Data Model & Persistence

> **REQUIRED SKILL for this phase:**
> - **backend-development** — Load and follow for all backend code (Tasks 3.1–3.3). Apply its API design patterns, input validation, testing strategies (70-20-10 pyramid), OWASP security best practices, and code quality (SOLID principles, clean code) guidelines.

### Task 3.1: Define Task Types

**Files:**
- Create: `backend/src/types/task.ts`

- [ ] **Step 1:** Write descriptive comment block explaining the Task interface (for Copilot inline suggestion demo)
- [ ] **Step 2:** Accept/define `Task` interface: `id` (string/UUID), `title` (string), `description` (string | undefined), `status` ('todo' | 'in-progress' | 'done'), `priority` ('low' | 'medium' | 'high'), `createdAt` (string/ISO), `updatedAt` (string/ISO)
- [ ] **Step 3:** Export `TaskStatus` and `TaskPriority` union types
- [ ] **Step 4:** Export `CreateTaskInput` and `UpdateTaskInput` types (pick/partial of Task)
- [ ] **Step 5:** Commit: `git add backend/src/types/ && git commit -m "feat: add Task type definitions"`

### Task 3.2: File-Based Storage

**Files:**
- Create: `backend/src/utils/fileStore.ts`
- Test: `backend/tests/fileStore.test.ts`

- [ ] **Step 1:** Write failing test: `readTasks()` returns empty array when file doesn't exist

  ```typescript
  it('returns empty array when file does not exist', async () => {
    const tasks = await readTasks();
    expect(tasks).toEqual([]);
  });
  ```

- [ ] **Step 2:** Run test, verify it fails: `cd backend && npm test -- tests/fileStore.test.ts`
  Expected: FAIL with "readTasks is not defined"

- [ ] **Step 3:** Implement `fileStore.ts` with `readTasks()` and `writeTasks(tasks)` — reads/writes `data/tasks.json`, creates directory if missing. Follow **backend-development** security practices: validate/sanitize file paths, handle I/O errors gracefully, avoid path traversal vulnerabilities

- [ ] **Step 4:** Run test, verify it passes: `cd backend && npm test -- tests/fileStore.test.ts`
  Expected: PASS

- [ ] **Step 5:** Write failing test: `writeTasks()` persists and `readTasks()` retrieves

  ```typescript
  it('persists tasks and retrieves them', async () => {
    const task = { id: '1', title: 'Test', status: 'todo', priority: 'low', createdAt: '', updatedAt: '' };
    await writeTasks([task]);
    const tasks = await readTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('1');
  });
  ```

- [ ] **Step 6:** Run test, verify it passes
- [ ] **Step 7:** Commit: `git add backend/src/utils/ backend/tests/ && git commit -m "feat: add file-based task storage"`

### Task 3.3: Task Service (Business Logic)

**Files:**
- Create: `backend/src/services/taskService.ts`
- Test: `backend/tests/taskService.test.ts`

- [ ] **Step 1:** Write descriptive comment block for Copilot inline suggestion demo

- [ ] **Step 2:** Write failing test: `getAllTasks()` returns all tasks

  ```typescript
  it('returns all tasks', async () => {
    const tasks = await getAllTasks();
    expect(Array.isArray(tasks)).toBe(true);
  });
  ```

- [ ] **Step 3:** Implement `getAllTasks(filters?: { status?: TaskStatus, priority?: TaskPriority })` — read from store, apply optional filters
- [ ] **Step 4:** Run tests: `cd backend && npm test -- tests/taskService.test.ts`, verify pass

- [ ] **Step 5:** Write failing test: `getTaskById(id)` returns task or null

  ```typescript
  it('returns null for unknown id', async () => {
    expect(await getTaskById('nonexistent')).toBeNull();
  });
  ```

- [ ] **Step 6:** Implement `getTaskById(id: string): Promise<Task | null>`

- [ ] **Step 7:** Write failing test: `createTask()` generates UUID, sets status='todo', timestamps

  ```typescript
  it('creates task with auto-generated id and todo status', async () => {
    const task = await createTask({ title: 'Test', priority: 'low' });
    expect(task.id).toBeDefined();
    expect(task.status).toBe('todo');
    expect(task.createdAt).toBeDefined();
  });
  ```

- [ ] **Step 8:** Implement `createTask(input: CreateTaskInput): Promise<Task>`

- [ ] **Step 9:** Write failing test: `updateTask()` — valid transition and invalid transition

  ```typescript
  it('allows todo → in-progress transition', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    const updated = await updateTask(task.id, { status: 'in-progress' });
    expect(updated?.status).toBe('in-progress');
  });
  it('rejects todo → done transition', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    await expect(updateTask(task.id, { status: 'done' })).rejects.toThrow();
  });
  ```

- [ ] **Step 10:** Implement `updateTask(id, updates)` with status workflow enforcement: `todo → in-progress → done` only

- [ ] **Step 11:** Write failing test: `deleteTask(id)` removes task

  ```typescript
  it('deletes task and returns true', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    expect(await deleteTask(task.id)).toBe(true);
    expect(await getTaskById(task.id)).toBeNull();
  });
  ```

- [ ] **Step 12:** Implement `deleteTask(id: string): Promise<boolean>`

- [ ] **Step 13:** Write failing test: `completeTask(id)` only works from 'in-progress'

  ```typescript
  it('throws when completing a todo task directly', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    await expect(completeTask(task.id)).rejects.toThrow();
  });
  ```

- [ ] **Step 14:** Implement `completeTask(id: string): Promise<Task>`

- [ ] **Step 15:** Write failing test: `getStats()` returns counts by status and priority

  ```typescript
  it('returns stats grouped by status and priority', async () => {
    const stats = await getStats();
    expect(stats).toHaveProperty('byStatus');
    expect(stats).toHaveProperty('byPriority');
  });
  ```

- [ ] **Step 16:** Implement `getStats()`

- [ ] **Step 17:** Write edge case tests: missing title throws, invalid priority throws, not found returns null

  ```typescript
  it('throws when title is missing', async () => {
    await expect(createTask({ title: '', priority: 'low' })).rejects.toThrow();
  });
  it('returns null for nonexistent id on update', async () => {
    expect(await updateTask('bad-id', { title: 'x' })).toBeNull();
  });
  ```

- [ ] **Step 18:** Run full test suite: `cd backend && npm test -- --coverage`, verify >80% coverage
- [ ] **Step 19:** Commit: `git add backend/src/services/ backend/tests/ && git commit -m "feat: add task service with business logic and tests"`

---

## Phase 4: Backend — API Routes & Middleware

> **REQUIRED SKILL for this phase:**
> - **backend-development** — Load and follow for all route/middleware code (Tasks 4.1–4.3). Apply its REST API design best practices (proper HTTP status codes, error handling, envelope pattern), input validation and sanitization (OWASP Top 10 — injection prevention, parameterized queries mindset), rate limiting awareness, and testing strategies for integration tests.

### Task 4.1: Validation Middleware

**Files:**
- Create: `backend/src/middleware/validation.ts`
- Test: `backend/tests/validation.test.ts`

- [ ] **Step 1:** Write failing test: validates `title` is present and 1-200 chars on create

  ```typescript
  it('rejects request with missing title', () => {
    const req = { body: { priority: 'low' } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();
    validateCreateTask(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
  ```

- [ ] **Step 2:** Implement `validateCreateTask` middleware — check title exists, length 1-200, priority is valid enum; return `{ success: false, error: '...' }` with 400 on failure
- [ ] **Step 3:** Write failing test: validates `status` and `priority` enums on update

  ```typescript
  it('rejects invalid status value', () => {
    const req = { body: { status: 'invalid' } } as Request;
    // ... assert 422 response
  });
  ```

- [ ] **Step 4:** Implement `validateUpdateTask` middleware — check status/priority are valid enums if present; return 422 on invalid values
- [ ] **Step 5:** Run tests: `cd backend && npm test -- tests/validation.test.ts`, verify pass
- [ ] **Step 6:** Commit: `git add backend/src/middleware/ backend/tests/ && git commit -m "feat: add input validation middleware"`

### Task 4.2: API Routes

**Files:**
- Create: `backend/src/routes/tasks.ts`
- Test: `backend/tests/routes.test.ts`

> **⚠️ Route ordering:** Register `/api/tasks/stats` BEFORE `/api/tasks/:id` in the Express router. Otherwise `"stats"` gets captured as the `:id` parameter.

- [ ] **Step 1:** Write descriptive comment block for Copilot inline suggestion demo

- [ ] **Step 2:** Write failing test: `GET /api/tasks` returns envelope

  ```typescript
  it('GET /api/tasks returns success envelope', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
  ```

- [ ] **Step 3:** Implement `GET /api/tasks` — reads `?status=` and `?priority=` query params, calls `getAllTasks(filters)`, returns `{ success: true, data: tasks }`

- [ ] **Step 4:** Write failing test: `POST /api/tasks` returns 201

  ```typescript
  it('POST /api/tasks creates a task and returns 201', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'New Task', priority: 'medium' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('New Task');
  });
  ```

- [ ] **Step 5:** Implement `POST /api/tasks` — apply `validateCreateTask`, call `createTask()`, return 201 `{ success: true, data: task }`

- [ ] **Step 6:** Write failing test: `POST /api/tasks` with missing title returns 400

  ```typescript
  it('POST /api/tasks with no title returns 400', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'low' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
  ```

- [ ] **Step 7:** Run test, verify pass (validation middleware handles this)

- [ ] **Step 8:** Write failing test: `GET /api/tasks/stats` returns grouped counts

  ```typescript
  it('GET /api/tasks/stats returns byStatus and byPriority', async () => {
    const res = await request(app).get('/api/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('byStatus');
    expect(res.body.data).toHaveProperty('byPriority');
  });
  ```

- [ ] **Step 9:** Implement `GET /api/tasks/stats` — **register this route BEFORE `:id` routes**, calls `getStats()`, returns envelope

- [ ] **Step 10:** Write failing test: `GET /api/tasks/:id` returns task or 404

  ```typescript
  it('GET /api/tasks/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/tasks/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
  ```

- [ ] **Step 11:** Implement `GET /api/tasks/:id` — call `getTaskById()`, return 404 if null

- [ ] **Step 12:** Write failing test: `PUT /api/tasks/:id` updates task

  ```typescript
  it('PUT /api/tasks/:id updates the task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'T', priority: 'low' });
    const res = await request(app).put(`/api/tasks/${created.body.data.id}`).send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated');
  });
  ```

- [ ] **Step 13:** Implement `PUT /api/tasks/:id` — apply `validateUpdateTask`, call `updateTask()`, return 404 if not found, 422 if invalid transition

- [ ] **Step 14:** Write failing test: `DELETE /api/tasks/:id` returns 200 or 404

  ```typescript
  it('DELETE /api/tasks/:id returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/tasks/nonexistent');
    expect(res.status).toBe(404);
  });
  ```

- [ ] **Step 15:** Implement `DELETE /api/tasks/:id` — call `deleteTask()`, return 200 or 404

- [ ] **Step 16:** Write failing test: `POST /api/tasks/:id/complete` returns 422 for invalid transition

  ```typescript
  it('POST /api/tasks/:id/complete returns 422 if task is todo', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'T', priority: 'low' });
    const res = await request(app).post(`/api/tasks/${created.body.data.id}/complete`);
    expect(res.status).toBe(422);
  });
  ```

- [ ] **Step 17:** Implement `POST /api/tasks/:id/complete` — call `completeTask()`, return 200 or 404/422 on errors

- [ ] **Step 18:** Run full route tests: `cd backend && npm test -- tests/routes.test.ts`, verify all pass
- [ ] **Step 19:** Commit: `git add backend/src/routes/ backend/tests/ && git commit -m "feat: add all API routes with tests"`

### Task 4.3: Express Server Entry Point

**Files:**
- Create: `backend/src/app.ts`
- Create: `backend/src/index.ts`

- [ ] **Step 1:** Create `backend/src/app.ts` — configure Express app: JSON body parser, CORS, mount task routes at `/api/tasks`, global error handler. Export the app without `.listen()` (for testing with supertest). Follow **backend-development** security checklist: set security headers (helmet), configure CORS properly, add request size limits, implement structured error handling that doesn't leak internals
- [ ] **Step 2:** Create `backend/src/index.ts` — import app from `app.ts`, call `.listen()` on port 3000
- [ ] **Step 3:** Add backend scripts to `backend/package.json`: `"dev": "nodemon --exec ts-node src/index.ts"`, `"test": "jest --coverage"`
- [ ] **Step 4:** Verify backend starts: `cd backend && npm run dev`
  Expected: `Server listening on port 3000`
- [ ] **Step 5:** Commit: `git add backend/ && git commit -m "feat: configure Express server entry point"`

---

## Phase 5: Frontend — React Components

> **REQUIRED SKILLS for this phase:**
> - **frontend-design** — Load and follow for all component creation (Tasks 5.2–5.6). Apply its design thinking process, typography/color/motion guidelines, and avoid generic AI aesthetics.
> - **vercel-react-best-practices** — Load and follow for all React code (Tasks 5.1–5.6). Apply rules for re-render optimization, bundle size, client-side data fetching, and eliminating waterfalls.
> - **web-design-guidelines** — After Phase 5 is complete, run a review of all `frontend/src/components/**` files against the Web Interface Guidelines.

### Task 5.1: Shared Types & API Service

**Files:**
- Create: `frontend/src/types/task.ts`
- Create: `frontend/src/services/api.ts`

- [ ] **Step 1:** Create `frontend/src/types/task.ts` — mirror backend Task interface (same fields, same union types)
- [ ] **Step 2:** Load the **vercel-react-best-practices** skill. Keep its rules in mind for all API service and component code that follows.
- [ ] **Step 3:** Create `frontend/src/services/api.ts` with functions:
  - `fetchTasks(filters?: { status?: string, priority?: string }): Promise<Task[]>`
  - `createTask(input: CreateTaskInput): Promise<Task>`
  - `updateTask(id: string, input: UpdateTaskInput): Promise<Task>`
  - `deleteTask(id: string): Promise<void>`
  - `completeTask(id: string): Promise<Task>`
  - `fetchStats(): Promise<Stats>`

  All functions: call `/api/tasks` endpoints, unwrap `response.data`, throw `Error(response.error)` on `success: false`.
  Apply **vercel-react-best-practices** rules: `async-parallel` (use `Promise.all` for independent fetches), `client-swr-dedup` (consider SWR for request deduplication if multiple components fetch the same data).
- [ ] **Step 4:** Commit: `git add frontend/src/types/ frontend/src/services/ && git commit -m "feat: add frontend types and API service"`

### Task 5.2: Core UI Components

**Files:**
- Create: `frontend/src/components/Badge.tsx`
- Create: `frontend/src/components/Toast.tsx`
- Create: `frontend/src/components/LoadingSpinner.tsx`

- [ ] **Step 1:** Load the **frontend-design** skill. Apply its Design Thinking section: choose a bold aesthetic direction (tone, color palette, typography) for the entire app before writing any component code. Document the chosen direction in a comment at the top of `Badge.tsx`.
- [ ] **Step 2:** Create `Badge.tsx` — accepts `type: 'priority' | 'status'` and `value: string`. Colors: priority red=high, orange=medium, green=low; status gray=todo, blue=in-progress, green=done. Follow **frontend-design** typography and color guidelines — use distinctive, non-generic color choices
- [ ] **Step 3:** Create `Toast.tsx` — accepts `message: string`, `type: 'error' | 'success'`, `onDismiss: () => void`. Auto-dismisses after 3s via `useEffect`. Apply **frontend-design** motion guidelines for entrance/exit animations.
- [ ] **Step 4:** Create `LoadingSpinner.tsx` — CSS spinner with centered layout. Follow **frontend-design** motion and spatial composition guidelines.
- [ ] **Step 5:** Commit: `git add frontend/src/components/ && git commit -m "feat: add Badge, Toast, LoadingSpinner components"`

### Task 5.3: Task List & Table

**Files:**
- Create: `frontend/src/components/TaskList.tsx`
- Create: `frontend/src/components/TaskRow.tsx`

- [ ] **Step 1:** Create `TaskRow.tsx` — props: `task: Task`, `onEdit`, `onDelete`, `onComplete`. Renders: title, `<Badge type="priority">`, `<Badge type="status">`, formatted `createdAt` date, three action buttons. Complete button shown on all rows but `disabled` when status is not `'in-progress'`, with `title` tooltip explaining the workflow constraint.
- [ ] **Step 2:** Create `TaskList.tsx` — props: `tasks: Task[]`, `loading: boolean`, callbacks. Shows `<LoadingSpinner>` when `loading` is true. Shows "No tasks found." when tasks array is empty. Renders `<table>` with header + one `<TaskRow>` per task.
- [ ] **Step 3:** Commit: `git add frontend/src/components/ && git commit -m "feat: add TaskList and TaskRow components"`

### Task 5.4: Task Modal (Add/Edit)

**Files:**
- Create: `frontend/src/components/TaskModal.tsx`

- [ ] **Step 1:** Create `TaskModal.tsx` — props: `mode: 'add' | 'edit'`, `task?: Task`, `onClose: () => void`, `onSave: () => void`. Form fields: title (required input, maxLength 200), description (optional textarea), priority (select: low/medium/high), status (select, only shown in edit mode). Submit button shows "Saving…" and is disabled while submitting. On success: call `onSave()` and `onClose()`. On error: show error message inside modal.
- [ ] **Step 2:** Commit: `git add frontend/src/components/ && git commit -m "feat: add TaskModal component"`

### Task 5.5: Filter Bar & Search

**Files:**
- Create: `frontend/src/components/FilterBar.tsx`
- Create: `frontend/src/components/SearchBar.tsx`

- [ ] **Step 1:** Create `FilterBar.tsx` — props: `filters: { status: string, priority: string }`, `onChange: (filters) => void`. Two `<select>` elements: status (all/todo/in-progress/done) and priority (all/low/medium/high). Calls `onChange` immediately on change — no page reload.
- [ ] **Step 2:** Create `SearchBar.tsx` — props: `value: string`, `onChange: (val: string) => void`. Controlled `<input type="text">` with placeholder "Search tasks…". Calls `onChange` on every keystroke.
- [ ] **Step 3:** Commit: `git add frontend/src/components/ && git commit -m "feat: add FilterBar and SearchBar components"`

### Task 5.6: App Integration

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/index.css` (or create `frontend/src/App.css`)

- [ ] **Step 1:** Wire up `App.tsx`:
  - State: `tasks`, `filters`, `searchTerm`, `loading`, `toast`, `modal`
  - On mount + when `filters` change: call `fetchTasks(filters)` and set loading state
  - Client-side: filter displayed tasks by `searchTerm` against title/description
  - Compose: `<SearchBar>` + `<FilterBar>` + "Add Task" button at top, `<TaskList>`, `<TaskModal>` (conditional), `<Toast>` (conditional)
  - Apply **vercel-react-best-practices**: `rerender-memo` (memoize expensive list rendering), `rerender-derived-state-no-effect` (derive filtered tasks during render, not in useEffect), `rerender-defer-reads` (don't subscribe to state only used in callbacks), `rerender-functional-setstate` (use functional setState for stable callbacks).
- [ ] **Step 2:** Style in CSS following **frontend-design** skill guidelines: distinctive typography (no generic fonts), bold color palette with CSS variables, motion/micro-interactions on key moments, spatial composition with intentional layout. Avoid cookie-cutter design.
- [ ] **Step 3:** Test manually: `npm run dev` from root, verify create/edit/delete/complete/filter/search in browser
- [ ] **Step 4:** Run a **web-design-guidelines** skill review against all `frontend/src/components/**` and `frontend/src/App.tsx`. Fix any accessibility, UX, or guideline violations found.
- [ ] **Step 5:** Commit: `git add frontend/ && git commit -m "feat: integrate all frontend components"`

---

## Phase 6: E2E Tests (Playwright)

### Task 6.1: Write Playwright E2E Tests

**Files:**
- Create: `e2e/tests/tasks.spec.ts`

- [ ] **Step 1:** Test: page loads with empty state

  ```typescript
  test('page loads and shows empty task list', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('No tasks found')).toBeVisible();
  });
  ```

- [ ] **Step 2:** Test: add a new task via modal

  ```typescript
  test('can add a new task', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByLabel('Title').fill('My E2E Task');
    await page.selectOption('select[name="priority"]', 'high');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('My E2E Task')).toBeVisible();
  });
  ```

- [ ] **Step 3:** Test: complete a task (must move todo → in-progress → done)

  ```typescript
  test('can complete a task via status workflow', async ({ page }) => {
    // Create, move to in-progress, then complete
    await page.goto('/');
    // ... create task, edit to in-progress, click Complete
    await expect(page.getByText('done')).toBeVisible();
  });
  ```

- [ ] **Step 4:** Test: delete a task

  ```typescript
  test('can delete a task', async ({ page }) => {
    await page.goto('/');
    // create task then delete
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await expect(page.getByText('My E2E Task')).not.toBeVisible();
  });
  ```

- [ ] **Step 5:** Test: priority filter shows only matching tasks

  ```typescript
  test('priority filter shows only matching tasks', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select[name="priority"]', 'high');
    // verify only high-priority tasks visible
  });
  ```

- [ ] **Step 6:** Test: search bar filters by title

  ```typescript
  test('search bar filters tasks by title', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search tasks').fill('E2E');
    // verify only matching tasks visible
  });
  ```

- [ ] **Step 7:** Run all E2E tests: `cd e2e && npx playwright test`
  Expected: all tests green
- [ ] **Step 8:** Commit: `git add e2e/ && git commit -m "test: add Playwright E2E tests"`

---

## Phase 7: Copilot Feature Demonstration & Logging

> These tasks are iterative — perform them throughout Phases 3–6, not as a batch at the end.

### Task 7.1: Inline Comment Suggestions (Requirement 1)

- [ ] **Step 1:** In `backend/src/types/task.ts`, `backend/src/services/taskService.ts`, and `backend/src/routes/tasks.ts` — write only a descriptive comment block at the top of each file, press Tab to accept Copilot's generated code
- [ ] **Step 2:** Log at least 3 examples in `COPILOT-LOG.md` Section 1 format: `[file]: [comment typed] → [what Copilot generated]`

### Task 7.2: Agent Mode Usage (Requirement 2)

- [ ] **Step 1:** Use Agent Mode to generate the full frontend (Phase 5) with a single prompt spanning multiple components
- [ ] **Step 2:** Use Agent Mode to add a missing backend route + the matching frontend API call together
- [ ] **Step 3:** Use Agent Mode to wire up filter/search integration across `App.tsx`, `FilterBar.tsx`, and `SearchBar.tsx`
- [ ] **Step 4:** Log all 3 prompts and results in `COPILOT-LOG.md` Section 2

### Task 7.3: Sub-Agent Usage (Requirement 3)

- [ ] **Step 1:** Use `@ui-agent` for at least one frontend task (e.g., styling the modal or badge component) — log prompt + result in `COPILOT-LOG.md` Section 3
- [ ] **Step 2:** Use `@backend-agent` for at least one backend task (e.g., adding JSDoc to routes) — log prompt + result
- [ ] **Step 3:** Use `@testing-agent` for at least one testing task (e.g., generating edge-case unit tests) — log prompt + result

### Task 7.4: Review Agent (Requirement 5)

- [ ] **Step 1:** In Copilot Chat run: `Review backend/src/routes/tasks.ts according to .github/copilot-instructions.md and list issues`
- [ ] **Step 2:** Fix all issues Copilot identifies
- [ ] **Step 3:** Log findings and fixes in `COPILOT-LOG.md` Section 4

### Task 7.5: Skills Integration (Requirement 6)

- [ ] **Step 1:** Install skills: `npx skills add vercel-labs/agent-skills`
- [ ] **Step 2:** Use a skill in at least one Agent Mode prompt
- [ ] **Step 3:** Apply at least 2 suggestions from the skill to your code
- [ ] **Step 4:** Log in `COPILOT-LOG.md` Section 5: `Skill: [name] | Prompt: [prompt] | Changes: [what improved]`

### Task 7.6: Playwright MCP (Requirement 6)

- [ ] **Step 1:** Start the app (`npm run dev`), then in Agent Mode with Playwright MCP active, prompt: `Take a screenshot of the running app at http://localhost:5173`
- [ ] **Step 2:** Use Playwright MCP to generate at least one E2E test from browser observation
- [ ] **Step 3:** Log in `COPILOT-LOG.md` Section 6: screenshot taken (yes/no), E2E test filename generated

---

## Phase 8: Final Verification & Submission

### Task 8.1: Final Checks

- [ ] **Step 1:** Run backend unit tests with coverage: `cd backend && npm test -- --coverage`
  Expected: >80% coverage, all tests green

- [ ] **Step 2:** Run E2E tests: `cd e2e && npx playwright test`
  Expected: all 6 specs green

- [ ] **Step 3:** Verify `COPILOT-LOG.md` has all 6 sections with real (not placeholder) examples

- [ ] **Step 4:** Verify all required files exist:
  ```
  AGENTS.md
  COPILOT-LOG.md
  ui-agent.agent.md
  backend-agent.agent.md
  testing-agent.agent.md
  .github/copilot-instructions.md
  .vscode/mcp.json
  ```

- [ ] **Step 5:** Final commit and push:
  ```bash
  git add .
  git commit -m "chore: final verification complete"
  git remote add origin <your-public-repo-url>
  git push -u origin main
  ```

---

## Relevant Files

**Backend:**
- `backend/src/types/task.ts` — Task interface, status/priority types, input types
- `backend/src/utils/fileStore.ts` — JSON file read/write for persistence
- `backend/src/services/taskService.ts` — All business logic: CRUD, status workflow, stats
- `backend/src/middleware/validation.ts` — Request validation for POST/PUT
- `backend/src/routes/tasks.ts` — Express router with all 7 endpoints
- `backend/src/app.ts` — Express app configuration (exported for supertest)
- `backend/src/index.ts` — Server entry point (.listen)
- `backend/tests/` — Jest unit tests for service, routes, validation, fileStore

**Frontend:**
- `frontend/src/types/task.ts` — Mirrored Task types
- `frontend/src/services/api.ts` — HTTP client for all endpoints
- `frontend/src/components/TaskList.tsx` — Main task table
- `frontend/src/components/TaskRow.tsx` — Individual task row with actions
- `frontend/src/components/TaskModal.tsx` — Add/Edit form modal
- `frontend/src/components/FilterBar.tsx` — Status/priority dropdown filters
- `frontend/src/components/SearchBar.tsx` — Live search input
- `frontend/src/components/Badge.tsx` — Color-coded status/priority badges
- `frontend/src/components/Toast.tsx` — Error/success notifications
- `frontend/src/components/LoadingSpinner.tsx` — Loading indicator
- `frontend/src/App.tsx` — Root component wiring everything together

**E2E:**
- `e2e/tests/tasks.spec.ts` — Playwright tests for all required flows
- `e2e/playwright.config.ts` — Playwright configuration

**Copilot Config:**
- `AGENTS.md` — Project architecture, standards, agent descriptions
- `.github/copilot-instructions.md` — Review rules for Copilot
- `ui-agent.agent.md` — Frontend sub-agent definition
- `backend-agent.agent.md` — Backend sub-agent definition
- `testing-agent.agent.md` — Testing sub-agent definition
- `.vscode/mcp.json` — Playwright MCP server config
- `COPILOT-LOG.md` — Copilot usage documentation

---

## Verification Checklist

1. **Unit tests >80% coverage:** `cd backend && npm test -- --coverage` → all green
2. **E2E tests pass:** `cd e2e && npx playwright test` → all 6 specs green
3. **Manual smoke test:** Create, edit, filter, search, complete, delete all work in browser
4. **API envelope:** All 7 endpoints return `{ success: boolean, data: ... }`
5. **Status workflow enforced:** `todo → done` directly returns 422
6. **Validation:** Empty title → 400, nonexistent ID → 404, invalid priority → 422
7. **Config files:** All 7 Copilot files present and well-formed
8. **COPILOT-LOG.md:** All 6 sections filled with real examples, not placeholders

---

## Key Decisions

- **Monorepo** with separate `backend/` and `frontend/` directories
- **File persistence** via `data/tasks.json` in backend
- **App/server split** — `app.ts` exports app (testable with supertest), `index.ts` calls `.listen()`
- **Client-side search** (SearchBar filters locally on already-fetched tasks)
- **Server-side filtering** (status/priority sent as `?status=&priority=` query params)
- **Strict status workflow** — `todo → in-progress → done`, no skipping; `/complete` only works from `in-progress`
- **Phase 7 is iterative** — Copilot logging happens during Phases 3–6, not as a separate batch at the end
