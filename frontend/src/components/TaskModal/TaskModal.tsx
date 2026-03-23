import { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';
import './TaskModal.css';

interface TaskModalProps {
  mode: 'add' | 'edit';
  task?: Task;
  onClose: () => void;
  onSave: (isAdd: boolean) => void;
}

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];

export function TaskModal({ mode, task, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo');
  const [error, setError] = useState('');

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const submitting = createMutation.isPending || updateMutation.isPending;

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'add') {
      createMutation.mutate(
        { title, description: description || undefined, priority },
        {
          onSuccess: () => onSave(true),
          onError: (err: unknown) =>
            setError(err instanceof Error ? err.message : 'Failed to create task'),
        }
      );
    } else if (task) {
      updateMutation.mutate(
        { id: task.id, input: { title, description: description || undefined, priority, status } },
        {
          onSuccess: () => onSave(false),
          onError: (err: unknown) =>
            setError(err instanceof Error ? err.message : 'Failed to update task'),
        }
      );
    }
  };

  return ( 
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {mode === 'add' ? 'Add Task' : 'Edit Task'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">×</button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit}>
          {error && <p className="modal__error" role="alert">{error}</p>}

          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              className="form-input form-input--textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">Priority *</label>
            <select
              id="task-priority"
              name="priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>

          {mode === 'edit' && (
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={task?.status === 'done'} // Prevent changing status if already done
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <footer className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
