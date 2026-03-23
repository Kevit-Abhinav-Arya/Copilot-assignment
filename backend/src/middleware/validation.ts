/**
 * Input Validation Middleware
 *
 * Validates request bodies for POST and PUT /api/tasks endpoints.
 * Returns structured error responses and calls next() only on valid input.
 * Never trusts raw req.body — sanitizes and validates all fields.
 */

import { Request, Response, NextFunction } from 'express';

const VALID_STATUSES = ['todo', 'in-progress', 'done'] as const;
const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;

/**
 * Validates the request body for creating a new task.
 * Requires: title (non-empty, max 200 chars), priority (valid enum).
 * @param req - Express request with body containing title and priority
 * @param res - Express response for sending validation errors
 * @param next - Express next function, called only on valid input
 */
export function validateCreateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { title, priority } = req.body as Record<string, unknown>;

  if (typeof title !== 'string' || title.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Title is required' });
    return;
  }

  if (title.trim().length > 200) {
    res.status(400).json({ success: false, error: 'Title must be 200 characters or fewer' });
    return;
  }

  if (!VALID_PRIORITIES.includes(priority as typeof VALID_PRIORITIES[number])) {
    res.status(400).json({
      success: false,
      error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
    return;
  }

  next();
}

/**
 * Validates the request body for updating an existing task.
 * All fields are optional, but when present must be valid values.
 * Returns 422 for invalid enum values, 400 for invalid title length.
 * @param req - Express request with optional body fields
 * @param res - Express response for sending validation errors
 * @param next - Express next function, called only on valid input
 */
export function validateUpdateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as Record<string, unknown>;

  if ('title' in body) {
    const title = body['title'];
    if (typeof title === 'string' && title.length > 200) {
      res.status(400).json({ success: false, error: 'Title must be 200 characters or fewer' });
      return;
    }
  }

  if ('status' in body) {
    const status = body['status'];
    if (!VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      res.status(422).json({
        success: false,
        error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }
  }

  if ('priority' in body) {
    const priority = body['priority'];
    if (!VALID_PRIORITIES.includes(priority as typeof VALID_PRIORITIES[number])) {
      res.status(422).json({
        success: false,
        error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
      return;
    }
  }

  next();
}
