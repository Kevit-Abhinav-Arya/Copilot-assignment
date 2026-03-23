/** Task status follows a strict one-way workflow: todo → in-progress → done */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/** Task priority level */
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface TaskStats {
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  total: number;
}

export interface ApiFilters {
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
}
