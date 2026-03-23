import { useState, useCallback, useMemo } from 'react';
import type { Task, ApiFilters } from './types/task';
import { useDeleteTask, useCompleteTask, useTasks } from './hooks/useTasks';
import { TaskList } from './components/TaskList/TaskList';
import { TaskModal } from './components/TaskModal/TaskModal';
import { FilterBar } from './components/FilterBar/FilterBar';
import { SearchBar } from './components/SearchBar/SearchBar';
import { Toast } from './components/Toast/Toast';
import './App.css';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface ModalState {
  mode: 'add' | 'edit';
  task?: Task;
}

export default function App() {
  const [filters, setFilters] = useState<ApiFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const { data: tasks = [], isLoading, isError, error } = useTasks(filters);

  const deleteMutation = useDeleteTask();
  const completeMutation = useCompleteTask();

  // Derive filtered tasks during render — no useEffect needed
  const displayedTasks = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    const lower = searchTerm.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description?.toLowerCase().includes(lower)
    );
  }, [tasks, searchTerm]);

  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setToast({ message: 'Task deleted.', type: 'success' }),
      onError: (err: unknown) =>
        setToast({
          message: err instanceof Error ? err.message : 'Failed to delete task',
          type: 'error',
        }),
    });
  }, [deleteMutation]);

  const handleComplete = useCallback((id: string) => {
    completeMutation.mutate(id, {
      onSuccess: () => setToast({ message: 'Task marked as done!', type: 'success' }),
      onError: (err: unknown) =>
        setToast({
          message: err instanceof Error ? err.message : 'Failed to complete task',
          type: 'error',
        }),
    });
  }, [completeMutation]);

  const handleSave = useCallback((isAdd: boolean) => {
    setToast({ message: isAdd ? 'Task created!' : 'Task updated!', type: 'success' });
    setModal(null);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // Surface query-level errors as a toast (first render only)
  if (isError && !toast) {
    setToast({
      message: error instanceof Error ? error.message : 'Failed to load tasks',
      type: 'error',
    });
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Task Board</h1>
        <span className="app__count">
          {displayedTasks.length} task{displayedTasks.length !== 1 ? 's' : ''}
        </span>
      </header>

      <main className="app__main">
        <div className="app__toolbar">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <FilterBar filters={filters} onChange={setFilters} />
          <button
            className="btn btn--primary"
            onClick={() => setModal({ mode: 'add' })}
          >
            + Add Task
          </button>
        </div>

        <TaskList
          tasks={displayedTasks}
          loading={isLoading}
          onEdit={(task) => setModal({ mode: 'edit', task })}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      </main>

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}
