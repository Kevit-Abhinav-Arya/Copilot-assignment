/**
 * Task Management System — Core Type Definitions
 *
 * Defines the Task entity, status/priority enums, and input types
 * used across the backend service and route layers.
 *
 * Status workflow (strictly enforced):
 *   todo → in-progress → done
 */

/** Valid values for a task's lifecycle status */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/** Valid values for a task's priority level */
export type TaskPriority = 'low' | 'medium' | 'high';

/** Core Task entity as persisted and returned by the API */
export interface Task {
  /** UUID v4 identifier, auto-generated on creation */
  id: string;
  /** Short description of the task (1–200 characters) */
  title: string;
  /** Optional long-form description */
  description?: string;
  /** Current lifecycle status — follows todo → in-progress → done */
  status: TaskStatus;
  /** Urgency level of the task */
  priority: TaskPriority;
  /** ISO 8601 timestamp set at creation */
  createdAt: string;
  /** ISO 8601 timestamp updated on every mutation */
  updatedAt: string;
}

/** Input accepted when creating a new task */
export interface CreateTaskInput {
  /** Required: task title, 1–200 chars */
  title: string;
  /** Optional additional details */
  description?: string;
  /** Required: urgency level */
  priority: TaskPriority;
}

/** Input accepted when updating an existing task — all fields optional */
export interface UpdateTaskInput {
  /** New title (1–200 chars) */
  title?: string;
  /** New description */
  description?: string;
  /** New status — must follow valid workflow transitions */
  status?: TaskStatus;
  /** New priority */
  priority?: TaskPriority;
}

/** Aggregated statistics returned by GET /api/tasks/stats */
export interface TaskStats {
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  total: number;
}
