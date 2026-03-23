# GitHub Copilot Review Rules — Task Management System

When reviewing or generating code for this project, enforce the following rules:

## Backend Rules

### 1. JSDoc on All Public Functions
Every exported function in `backend/src/` must have a JSDoc comment with `@param`, `@returns`, and `@throws` (if applicable).

```typescript
// ✅ Required
/**
 * Creates a new task with auto-generated ID and timestamps.
 * @param input - Task creation input (title required, priority required)
 * @returns The created Task object
 * @throws {Error} If title is empty or priority is invalid
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
```

### 2. Input Validation on POST/PUT
All POST and PUT route handlers must apply validation middleware before processing. Never trust raw `req.body`.

```typescript
// ✅ Required
router.post('/', validateCreateTask, async (req, res) => { ... });
router.put('/:id', validateUpdateTask, async (req, res) => { ... });
```

### 3. Correct HTTP Status Codes
| Situation | Required Code |
|-----------|--------------|
| Successful creation | `201` |
| Not found | `404` |
| Validation error | `400` |
| Invalid status transition | `422` |
| Internal error | `500` |

### 4. No Empty Catch Blocks
Every `catch` block must do something — log the error or rethrow it.

```typescript
// ✅ Required
} catch (err) {
  next(err); // or: throw err; or: console.error(err);
}

// ❌ Forbidden
} catch (e) {}
```

### 5. Response Envelope
All API responses must use `{ success: boolean, data?: T, error?: string }`.

```typescript
// ✅ Required
res.json({ success: true, data: task });
res.status(404).json({ success: false, error: 'Task not found' });
```

### 6. No `any` Type
TypeScript `any` is forbidden. Use proper type annotations or `unknown` with type guards.

---

## Frontend Rules

### 7. Loading States
Every component that fetches data must display `<LoadingSpinner />` while loading.

### 8. Error Handling
API errors must be caught and displayed using `<Toast type="error" message={...} />`. Never silently swallow errors.

### 9. Controlled Inputs
All form inputs must be controlled (bound to state via `value` + `onChange`).

### 10. No Inline Styles
Use CSS classes — never `style={{ ... }}` on JSX elements.

---

## Test Rules

### 11. Coverage >80%
Backend unit tests must maintain line coverage above 80%. Run `npm test -- --coverage` to verify.

### 12. Assert Both Status and Body
Every supertest assertion must check `res.status` AND `res.body.success`.
