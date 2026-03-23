import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { readTasks, writeTasks } from '../src/utils/fileStore';

const testDataPath = path.join(os.tmpdir(), `tasks-test-${Date.now()}.json`);

beforeEach(async () => {
  process.env.TASKS_DATA_PATH = testDataPath;
  try {
    await fs.unlink(testDataPath);
  } catch {
    // File may not exist — ignore
  }
});

afterAll(async () => {
  try {
    await fs.unlink(testDataPath);
  } catch {
    // Ignore
  }
  delete process.env.TASKS_DATA_PATH;
});

describe('fileStore', () => {
  it('returns empty array when file does not exist', async () => {
    const tasks = await readTasks();
    expect(tasks).toEqual([]);
  });

  it('persists tasks and retrieves them', async () => {
    const task = {
      id: '1',
      title: 'Test',
      status: 'todo' as const,
      priority: 'low' as const,
      createdAt: '',
      updatedAt: '',
    };
    await writeTasks([task]);
    const tasks = await readTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('1');
  });

  it('overwrites existing tasks on writeTasks', async () => {
    const taskA = { id: 'a', title: 'A', status: 'todo' as const, priority: 'low' as const, createdAt: '', updatedAt: '' };
    const taskB = { id: 'b', title: 'B', status: 'todo' as const, priority: 'high' as const, createdAt: '', updatedAt: '' };
    await writeTasks([taskA]);
    await writeTasks([taskB]);
    const tasks = await readTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('b');
  });
});
