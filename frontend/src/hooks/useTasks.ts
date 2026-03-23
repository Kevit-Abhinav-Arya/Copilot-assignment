/**
 * TanStack Query hooks for all task operations.
 * Centralises query keys, fetching, and cache invalidation.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiFilters, CreateTaskInput, UpdateTaskInput } from '../types/task';
import {
  fetchTasks,
  fetchStats,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} from '../services/api';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters: ApiFilters) => ['tasks', 'list', filters] as const,
  stats: () => ['tasks', 'stats'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTasks(filters: ApiFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => fetchTasks(filters),
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: fetchStats,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
