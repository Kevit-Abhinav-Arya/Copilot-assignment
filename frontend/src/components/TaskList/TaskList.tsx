import type { Task } from '../../types/task';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { TaskRow } from '../TaskRow/TaskRow';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function TaskList({ tasks, loading, onEdit, onDelete, onComplete }: TaskListProps) {
  if (loading) return <LoadingSpinner />;

  if (tasks.length === 0) {
    return (
      <div className="task-list--empty" role="status">
        <p>No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="task-list-wrapper">
      <table className="task-list" aria-label="Task list">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
