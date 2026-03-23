import { Request, Response, NextFunction } from 'express';
import { validateCreateTask, validateUpdateTask } from '../src/middleware/validation';

const mockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};
const mockNext = jest.fn() as NextFunction;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('validateCreateTask', () => {
  it('rejects request with missing title', () => {
    const req = { body: { priority: 'low' } } as Request;
    const res = mockRes();
    validateCreateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('rejects request with empty title', () => {
    const req = { body: { title: '', priority: 'low' } } as Request;
    const res = mockRes();
    validateCreateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('rejects title longer than 200 chars', () => {
    const req = { body: { title: 'a'.repeat(201), priority: 'low' } } as Request;
    const res = mockRes();
    validateCreateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('rejects invalid priority', () => {
    const req = { body: { title: 'Task', priority: 'urgent' } } as Request;
    const res = mockRes();
    validateCreateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('rejects missing priority', () => {
    const req = { body: { title: 'Task' } } as Request;
    const res = mockRes();
    validateCreateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('passes valid create input', () => {
    const req = { body: { title: 'Valid', priority: 'high' } } as Request;
    const res = mockRes();
    validateCreateTask(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('validateUpdateTask', () => {
  it('rejects invalid status value', () => {
    const req = { body: { status: 'invalid' } } as Request;
    const res = mockRes();
    validateUpdateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('rejects invalid priority value', () => {
    const req = { body: { priority: 'super-high' } } as Request;
    const res = mockRes();
    validateUpdateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('rejects title longer than 200 chars', () => {
    const req = { body: { title: 'x'.repeat(201) } } as Request;
    const res = mockRes();
    validateUpdateTask(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('passes with valid status', () => {
    const req = { body: { status: 'in-progress' } } as Request;
    const res = mockRes();
    validateUpdateTask(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('passes with empty body', () => {
    const req = { body: {} } as Request;
    const res = mockRes();
    validateUpdateTask(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});
