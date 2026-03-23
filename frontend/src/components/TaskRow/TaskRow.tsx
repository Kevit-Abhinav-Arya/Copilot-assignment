import type { Task } from '../../types/task';
import { Badge } from '../Badge/Badge';
import './TaskRow.css';

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function TaskRow({ task, onEdit, onDelete, onComplete }: TaskRowProps) {
  const isDone = task.status === 'done';
  const canComplete = task.status === 'in-progress';
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <tr className="task-row">
      <td className="task-row__title">{task.title}</td>
      <td className="task-row__badge">
        <Badge type="priority" value={task.priority} />
      </td>
      <td className="task-row__badge">
        <Badge type="status" value={task.status} />
      </td>
      <td className="task-row__date">{formattedDate}</td>
      <td className="task-row__actions">
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => onEdit(task)}
          disabled={isDone}
          aria-label={`Edit task: ${task.title}`}
          title={isDone ? 'Cannot edit a completed task' : 'Edit task'}
        >
          Edit
        </button>
        <button
          className="btn btn--accent btn--sm"
          onClick={() => onComplete(task.id)}
          disabled={!canComplete}
          title={canComplete ? 'Mark as done' : 'Task must be in-progress to complete'}
          aria-label={`Complete task: ${task.title}`}
        >
          Complete
        </button>
        <button
          className="btn btn--danger btn--sm"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
