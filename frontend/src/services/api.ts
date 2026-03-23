/**
 * API Service — HTTP client for all backend /api/tasks endpoints.
 * All functions unwrap the { success, data } envelope and throw on failure.
 */

import type {
  Task,
  TaskStats,
  CreateTaskInput,
  UpdateTaskInput,
  ApiFilters,
} from '../types/task';

const BASE = '/api/tasks';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json() as { success: boolean; data?: T; error?: string };
  if (!json.success) throw new Error(json.error ?? 'Unknown API error');
  return json.data as T;
}

export async function fetchTasks(filters?: ApiFilters): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.priority) params.set('priority', filters.priority);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE}${query}`);
  return handleResponse<Task[]>(res);
}

export async function fetchTaskById(id: string): Promise<Task> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<Task>(res);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  await handleResponse<unknown>(res);
}

export async function completeTask(id: string): Promise<Task> {
  const res = await fetch(`${BASE}/${id}/complete`, { method: 'POST' });
  return handleResponse<Task>(res);
}

export async function fetchStats(): Promise<TaskStats> {
  const res = await fetch(`${BASE}/stats`);
  return handleResponse<TaskStats>(res);
}
