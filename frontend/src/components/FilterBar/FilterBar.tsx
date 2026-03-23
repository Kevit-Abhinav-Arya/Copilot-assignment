import type { TaskStatus, TaskPriority, ApiFilters } from '../../types/task';
import './FilterBar.css';

interface FilterBarProps {
  filters: ApiFilters;
  onChange: (filters: ApiFilters) => void;
}

const STATUSES: Array<TaskStatus | ''> = ['', 'todo', 'in-progress', 'done'];
const PRIORITIES: Array<TaskPriority | ''> = ['', 'low', 'medium', 'high'];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          name="status"
          className="filter-bar__select"
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value as TaskStatus | '' })
          }
        >
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          name="priority"
          className="filter-bar__select"
          value={filters.priority ?? ''}
          onChange={(e) =>
            onChange({ ...filters, priority: e.target.value as TaskPriority | '' })
          }
        >
          <option value="">All priorities</option>
          {PRIORITIES.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
