/**
 * Badge — Color-coded status/priority badge
 *
 * Aesthetic direction: Industrial-utilitarian with sharp, confident colors.
 * Dark background chips with bold uppercase labels — data-first, no frills.
 */

import type { TaskStatus, TaskPriority } from '../../types/task';
import './Badge.css';

interface StatusBadgeProps {
  type: 'status';
  value: TaskStatus;
}

interface PriorityBadgeProps {
  type: 'priority';
  value: TaskPriority;
}

type BadgeProps = StatusBadgeProps | PriorityBadgeProps;

export function Badge({ type, value }: BadgeProps) {
  const cls = `badge badge--${type} badge--${value.replace('-', '_')}`;
  return <span className={cls}>{value}</span>;
}
