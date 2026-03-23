/**
 * Task Routes — Express Router
 *
 * All /api/tasks endpoints. Route ordering is critical:
 *   GET  /api/tasks/stats  must come BEFORE  GET /api/tasks/:id
 * otherwise "stats" is captured as an id parameter.
 *
 * Each route delegates to the task service (no business logic here).
 * All responses use the { success, data } envelope.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { validateCreateTask, validateUpdateTask } from '../middleware/validation';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getStats,
} from '../services/taskService';
import { TaskStatus, TaskPriority } from '../types/task';

const router = Router();

/** Helper — safely extract a single string param value */
function param(req: Request, key: string): string {
  const val = req.params[key];
  return Array.isArray(val) ? val[0] ?? '' : val ?? '';
}

/**
 * GET /api/tasks
 * Returns all tasks, optionally filtered by ?status= and ?priority=
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, priority } = req.query as { status?: TaskStatus; priority?: TaskPriority };
    const tasks = await getAllTasks({ status, priority });
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tasks/stats
 * Returns task counts grouped by status and priority.
 * ⚠️ Must be registered BEFORE /:id to avoid "stats" being captured as an id.
 */
router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tasks/:id
 * Returns a single task by UUID, or 404 if not found.
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await getTaskById(param(req, 'id'));
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tasks
 * Creates a new task. Requires title and priority in request body.
 * Returns 201 on success.
 */
router.post('/', validateCreateTask, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await createTask(req.body as Parameters<typeof createTask>[0]);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/tasks/:id
 * Updates an existing task. Returns 404 if not found, 422 for invalid transitions.
 */
router.put('/:id', validateUpdateTask, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await updateTask(param(req, 'id'), req.body as Parameters<typeof updateTask>[1]);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    res.json({ success: true, data: task });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Invalid status transition')) {
      res.status(422).json({ success: false, error: err.message });
      return;
    }
    next(err);
  }
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task. Returns 200 on success, 404 if not found.
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await deleteTask(param(req, 'id'));
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    res.json({ success: true, data: { id: param(req, 'id') } });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tasks/:id/complete
 * Moves task to 'done'. Task must be in 'in-progress' status.
 * Returns 422 if the transition is invalid, 404 if not found.
 */
router.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await completeTask(param(req, 'id'));
    res.json({ success: true, data: task });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes('not found')) {
        res.status(404).json({ success: false, error: err.message });
        return;
      }
      if (err.message.includes('in-progress') || err.message.includes('transition')) {
        res.status(422).json({ success: false, error: err.message });
        return;
      }
    }
    next(err);
  }
});

export default router;
