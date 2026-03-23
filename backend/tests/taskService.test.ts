import os from 'os';
import path from 'path';
import fs from 'fs/promises';

// Isolate file storage to a temp file
const testDataPath = path.join(os.tmpdir(), `taskService-test-${Date.now()}.json`);

beforeEach(async () => {
  process.env.TASKS_DATA_PATH = testDataPath;
  try {
    await fs.unlink(testDataPath);
  } catch {
    // File may not exist — ignore
  }
});

afterAll(async () => {
  try { await fs.unlink(testDataPath); } catch { /* ignore */ }
  delete process.env.TASKS_DATA_PATH;
});

// Import after setting env
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getStats,
} from '../src/services/taskService';

describe('getAllTasks', () => {
  it('returns all tasks', async () => {
    const tasks = await getAllTasks();
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('filters by status', async () => {
    await createTask({ title: 'A', priority: 'low' });
    const task = await createTask({ title: 'B', priority: 'low' });
    await updateTask(task.id, { status: 'in-progress' });
    const inProgress = await getAllTasks({ status: 'in-progress' });
    expect(inProgress.every((t) => t.status === 'in-progress')).toBe(true);
  });

  it('filters by priority', async () => {
    await createTask({ title: 'High', priority: 'high' });
    await createTask({ title: 'Low', priority: 'low' });
    const highOnly = await getAllTasks({ priority: 'high' });
    expect(highOnly.every((t) => t.priority === 'high')).toBe(true);
  });
});

describe('getTaskById', () => {
  it('returns null for unknown id', async () => {
    expect(await getTaskById('nonexistent')).toBeNull();
  });

  it('returns the task for a known id', async () => {
    const created = await createTask({ title: 'Find me', priority: 'medium' });
    const found = await getTaskById(created.id);
    expect(found?.id).toBe(created.id);
  });
});

describe('createTask', () => {
  it('creates task with auto-generated id and todo status', async () => {
    const task = await createTask({ title: 'Test', priority: 'low' });
    expect(task.id).toBeDefined();
    expect(task.status).toBe('todo');
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
  });

  it('throws when title is missing', async () => {
    await expect(createTask({ title: '', priority: 'low' })).rejects.toThrow();
  });

  it('persists the task so it can be retrieved', async () => {
    const task = await createTask({ title: 'Persist me', priority: 'high' });
    const all = await getAllTasks();
    expect(all.some((t) => t.id === task.id)).toBe(true);
  });
});

describe('updateTask', () => {
  it('allows todo → in-progress transition', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    const updated = await updateTask(task.id, { status: 'in-progress' });
    expect(updated?.status).toBe('in-progress');
  });

  it('rejects todo → done transition', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    await expect(updateTask(task.id, { status: 'done' })).rejects.toThrow();
  });

  it('allows in-progress → done transition', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    await updateTask(task.id, { status: 'in-progress' });
    const done = await updateTask(task.id, { status: 'done' });
    expect(done?.status).toBe('done');
  });

  it('rejects done → todo transition', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    await updateTask(task.id, { status: 'in-progress' });
    await updateTask(task.id, { status: 'done' });
    await expect(updateTask(task.id, { status: 'todo' })).rejects.toThrow();
  });

  it('returns null for nonexistent id on update', async () => {
    expect(await updateTask('bad-id', { title: 'x' })).toBeNull();
  });

  it('updates title without affecting status', async () => {
    const task = await createTask({ title: 'Original', priority: 'low' });
    const updated = await updateTask(task.id, { title: 'Updated' });
    expect(updated?.title).toBe('Updated');
    expect(updated?.status).toBe('todo');
  });
});

describe('deleteTask', () => {
  it('deletes task and returns true', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    expect(await deleteTask(task.id)).toBe(true);
    expect(await getTaskById(task.id)).toBeNull();
  });

  it('returns false for nonexistent id', async () => {
    expect(await deleteTask('nonexistent')).toBe(false);
  });
});

describe('completeTask', () => {
  it('throws when completing a todo task directly', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    await expect(completeTask(task.id)).rejects.toThrow();
  });

  it('completes an in-progress task', async () => {
    const task = await createTask({ title: 'T', priority: 'low' });
    await updateTask(task.id, { status: 'in-progress' });
    const completed = await completeTask(task.id);
    expect(completed.status).toBe('done');
  });

  it('throws for nonexistent id', async () => {
    await expect(completeTask('nonexistent')).rejects.toThrow();
  });
});

describe('getStats', () => {
  it('returns stats grouped by status and priority', async () => {
    const stats = await getStats();
    expect(stats).toHaveProperty('byStatus');
    expect(stats).toHaveProperty('byPriority');
    expect(stats).toHaveProperty('total');
  });

  it('counts tasks correctly', async () => {
    await createTask({ title: 'A', priority: 'high' });
    await createTask({ title: 'B', priority: 'low' });
    const stats = await getStats();
    expect(stats.byStatus.todo).toBeGreaterThanOrEqual(2);
    expect(stats.byPriority.high).toBeGreaterThanOrEqual(1);
    expect(stats.byPriority.low).toBeGreaterThanOrEqual(1);
  });
});
