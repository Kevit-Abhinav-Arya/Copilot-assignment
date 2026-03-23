import request from 'supertest';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

// Must set env BEFORE importing app (which loads taskService → fileStore)
const testDataPath = path.join(os.tmpdir(), `routes-test-${Date.now()}.json`);
process.env['TASKS_DATA_PATH'] = testDataPath;

import app from '../src/app';

beforeEach(async () => {
  try { await fs.unlink(testDataPath); } catch { /* ignore */ }
});

afterAll(async () => {
  try { await fs.unlink(testDataPath); } catch { /* ignore */ }
  delete process.env['TASKS_DATA_PATH'];
});

describe('GET /api/tasks', () => {
  it('returns success envelope with array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/tasks', () => {
  it('creates a task and returns 201', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task', priority: 'medium' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('New Task');
    expect(res.body.data.status).toBe('todo');
  });

  it('returns 400 with missing title', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'low' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 with invalid priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'T', priority: 'urgent' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/tasks/stats', () => {
  it('returns byStatus and byPriority counts', async () => {
    const res = await request(app).get('/api/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('byStatus');
    expect(res.body.data).toHaveProperty('byPriority');
    expect(res.body.data).toHaveProperty('total');
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/tasks/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns the task for a known id', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Find me', priority: 'low' });
    const res = await request(app).get(`/api/tasks/${created.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(created.body.data.id);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('updates the task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'T', priority: 'low' });
    const res = await request(app)
      .put(`/api/tasks/${created.body.data.id}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/api/tasks/nonexistent').send({ title: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 422 for invalid status transition', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'T', priority: 'low' });
    const res = await request(app)
      .put(`/api/tasks/${created.body.data.id}`)
      .send({ status: 'done' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/tasks/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('deletes an existing task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Del me', priority: 'low' });
    const res = await request(app).delete(`/api/tasks/${created.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/tasks/:id/complete', () => {
  it('returns 422 if task is todo', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'T', priority: 'low' });
    const res = await request(app).post(`/api/tasks/${created.body.data.id}/complete`);
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('completes an in-progress task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'T', priority: 'low' });
    await request(app).put(`/api/tasks/${created.body.data.id}`).send({ status: 'in-progress' });
    const res = await request(app).post(`/api/tasks/${created.body.data.id}/complete`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('done');
  });

  it('returns 404 for nonexistent id', async () => {
    const res = await request(app).post('/api/tasks/nonexistent/complete');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
