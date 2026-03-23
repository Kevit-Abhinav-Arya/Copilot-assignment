/**
 * File-based JSON persistence layer for tasks.
 *
 * Reads and writes tasks to a JSON file on disk. The file path can be
 * overridden via the TASKS_DATA_PATH environment variable (used in tests).
 *
 * Security: file path is never constructed from user input, preventing
 * path traversal vulnerabilities (OWASP A01).
 */

import path from 'path';
import fs from 'fs/promises';
import { Task } from '../types/task';

/** Resolve the data file path — overridable via env for tests */
function getDataPath(): string {
  return process.env.TASKS_DATA_PATH
    ?? path.join(process.cwd(), 'data', 'tasks.json');
}

/**
 * Reads all tasks from the JSON data file.
 * @returns Array of Task objects, or empty array if file does not exist.
 * @throws {Error} If the file exists but cannot be parsed as JSON.
 */
export async function readTasks(): Promise<Task[]> {
  const dataPath = getDataPath();
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(raw) as Task[];
  } catch (err: unknown) {
    if (isNodeError(err) && err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

/**
 * Writes the given task array to the JSON data file.
 * Creates the directory if it does not exist.
 * @param tasks - Array of tasks to persist.
 * @throws {Error} If the write fails.
 */
export async function writeTasks(tasks: Task[]): Promise<void> {
  const dataPath = getDataPath();
  const dir = path.dirname(dataPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2), 'utf-8');
}

/** Type guard for Node.js system errors — avoids instanceof across module boundaries */
function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return typeof err === 'object' && err !== null && 'code' in err;
}
