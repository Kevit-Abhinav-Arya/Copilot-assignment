/**
 * Task Service — Business Logic Layer
 *
 * Handles all CRUD operations for tasks, enforces the status workflow
 * (todo → in-progress → done), and computes aggregate statistics.
 *
 * All functions read from and write to the file-based store via fileStore.
 * Routes must not contain business logic — call these functions instead.
 */

import { randomUUID } from 'crypto';
import { readTasks, writeTasks } from '../utils/fileStore';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskStats,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

/** Valid status transitions: maps current status → allowed next statuses */
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in-progress'],
  'in-progress': ['done'],
  done: [],
};

/**
 * Retrieves all tasks, optionally filtered by status and/or priority.
 * @param filters - Optional status and priority filters
 * @returns Filtered array of tasks
 */
export async function getAllTasks(
  filters?: { status?: TaskStatus; priority?: TaskPriority }
): Promise<Task[]> {
  let tasks = await readTasks();
  if (filters?.status) {
    tasks = tasks.filter((t) => t.status === filters.status);
  }
  if (filters?.priority) {
    tasks = tasks.filter((t) => t.priority === filters.priority);
  }
  return tasks;
}

/**
 * Retrieves a single task by its ID.
 * @param id - The UUID of the task
 * @returns The task, or null if not found
 */
export async function getTaskById(id: string): Promise<Task | null> {
  const tasks = await readTasks();
  return tasks.find((t) => t.id === id) ?? null;
}

/**
 * Creates a new task with a generated UUID and default status of 'todo'.
 * @param input - Task creation input (title required, priority required)
 * @returns The created Task object
 * @throws {Error} If title is empty
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('Task title is required');
  }
  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    title: input.title.trim(),
    description: input.description,
    status: 'todo',
    priority: input.priority,
    createdAt: now,
    updatedAt: now,
  };
  const tasks = await readTasks();
  await writeTasks([...tasks, task]);
  return task;
}

/**
 * Updates an existing task by ID. Enforces status workflow transitions.
 * @param id - UUID of the task to update
 * @param updates - Partial fields to update
 * @returns The updated Task, or null if not found
 * @throws {Error} If the status transition is invalid
 */
export async function updateTask(
  id: string,
  updates: UpdateTaskInput
): Promise<Task | null> {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const existing = tasks[index];

  if (updates.status && updates.status !== existing.status) {
    const allowed = VALID_TRANSITIONS[existing.status];
    if (!allowed.includes(updates.status)) {
      throw new Error(
        `Invalid status transition: ${existing.status} → ${updates.status}`
      );
    }
  }

  const updated: Task = {
    ...existing,
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.status !== undefined && { status: updates.status }),
    ...(updates.priority !== undefined && { priority: updates.priority }),
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  await writeTasks(tasks);
  return updated;
}

/**
 * Deletes a task by ID.
 * @param id - UUID of the task to delete
 * @returns true if deleted, false if not found
 */
export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await readTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  await writeTasks(filtered);
  return true;
}

/**
 * Moves an in-progress task to 'done'. Enforces that the task must be
 * in 'in-progress' status before completing.
 * @param id - UUID of the task to complete
 * @returns The completed Task
 * @throws {Error} If task is not found or not in 'in-progress' status
 */
export async function completeTask(id: string): Promise<Task> {
  const task = await getTaskById(id);
  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }
  if (task.status !== 'in-progress') {
    throw new Error(
      `Task must be 'in-progress' to complete. Current status: ${task.status}`
    );
  }
  const updated = await updateTask(id, { status: 'done' });
  return updated!;
}

/**
 * Returns aggregate statistics grouped by status and priority.
 * @returns TaskStats with counts by status, by priority, and total
 */
export async function getStats(): Promise<TaskStats> {
  const tasks = await readTasks();
  const byStatus: Record<TaskStatus, number> = { todo: 0, 'in-progress': 0, done: 0 };
  const byPriority: Record<TaskPriority, number> = { low: 0, medium: 0, high: 0 };

  for (const task of tasks) {
    byStatus[task.status]++;
    byPriority[task.priority]++;
  }

  return { byStatus, byPriority, total: tasks.length };
}
