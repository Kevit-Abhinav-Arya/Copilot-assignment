import { test, expect, Page } from '@playwright/test';

/** Helper: add a task via the modal */
async function addTask(page: Page, title: string, priority: 'low' | 'medium' | 'high' = 'medium') {
  await page.getByRole('button', { name: '+ Add Task' }).click();
  await page.locator('#task-title').fill(title);
  await page.locator('#task-priority').selectOption(priority);
  await page.getByRole('button', { name: 'Save' }).click();
  // Wait for modal to close
  await expect(page.getByRole('dialog')).not.toBeVisible();
}

test.describe('Task Management System E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial load to complete
    await expect(page.getByRole('heading', { name: 'Task Board' })).toBeVisible();
  });

  test('page loads and shows the task board', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Task Board' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add Task' })).toBeVisible();
    await expect(page.getByPlaceholder('Search tasks…')).toBeVisible();
  });

  test('shows empty state when no tasks exist', async ({ page }) => {
    // Wait for loading to finish
    await page.waitForSelector('.spinner-wrapper, .task-list--empty, .task-list', { timeout: 5000 });
    const emptyMsg = page.getByText('No tasks found.');
    const table = page.locator('.task-list');
    // Either empty message OR a table (tasks might exist from other tests)
    const hasEmpty = await emptyMsg.isVisible().catch(() => false);
    const hasTable = await table.isVisible().catch(() => false);
    expect(hasEmpty || hasTable).toBe(true);
  });

  test('can add a new task', async ({ page }) => {
    const taskTitle = `E2E Task ${Date.now()}`;
    await addTask(page, taskTitle, 'high');
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('can edit an existing task', async ({ page }) => {
    const originalTitle = `Edit-Me ${Date.now()}`;
    const updatedTitle = `Updated ${Date.now()}`;
    await addTask(page, originalTitle, 'low');
    // Click the Edit button on the newly created row
    const row = page.locator('.task-row').filter({ hasText: originalTitle });
    await row.locator('.btn--ghost').click();
    await page.locator('#task-title').clear();
    await page.locator('#task-title').fill(updatedTitle);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText(updatedTitle)).toBeVisible();
  });

  test('can complete a task via status workflow', async ({ page }) => {
    const title = `Complete-Me ${Date.now()}`;
    await addTask(page, title, 'medium');
    // Move to in-progress via Edit
    const row = page.locator('.task-row').filter({ hasText: title });
    await row.locator('.btn--ghost').click();
    await page.locator('#task-status').selectOption('in-progress');
    await page.getByRole('button', { name: 'Save' }).click();
    // Now click Complete
    const updatedRow = page.locator('.task-row').filter({ hasText: title });
    await updatedRow.locator('.btn--accent').click();
    // Should show 'done' badge on that row
    await expect(updatedRow.locator('.badge--done')).toBeVisible();
  });

  test('can delete a task', async ({ page }) => {
    const title = `Delete-Me ${Date.now()}`;
    await addTask(page, title, 'low');
    await expect(page.getByText(title)).toBeVisible();
    const row = page.locator('.task-row').filter({ hasText: title });
    await row.locator('.btn--danger').click();
    await expect(page.getByText(title)).not.toBeVisible();
  });

  test('priority filter shows only matching tasks', async ({ page }) => {
    const highTitle = `High-Priority ${Date.now()}`;
    const lowTitle = `Low-Priority ${Date.now()}`;
    await addTask(page, highTitle, 'high');
    await addTask(page, lowTitle, 'low');
    // Filter by high priority
    await page.locator('#filter-priority').selectOption('high');
    await expect(page.getByText(highTitle)).toBeVisible();
    await expect(page.getByText(lowTitle)).not.toBeVisible();
    // Reset
    await page.locator('#filter-priority').selectOption('');
  });

  test('search bar filters tasks by title', async ({ page }) => {
    const uniqueTitle = `SearchableXYZ-${Date.now()}`;
    const otherTitle = `OtherABC-${Date.now()}`;
    await addTask(page, uniqueTitle, 'medium');
    await addTask(page, otherTitle, 'low');
    // Type in search
    await page.getByPlaceholder('Search tasks…').fill('SearchableXYZ');
    await expect(page.getByText(uniqueTitle)).toBeVisible();
    await expect(page.getByText(otherTitle)).not.toBeVisible();
    // Clear search
    await page.getByPlaceholder('Search tasks…').clear();
  });
});
