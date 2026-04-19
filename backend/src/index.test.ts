/* eslint-disable @typescript-eslint/no-explicit-any */
var prismaMockRef: {
  candidate: { create: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
  education: { create: jest.Mock };
  workExperience: { create: jest.Mock };
  resume: { create: jest.Mock };
};

jest.mock('@prisma/client', () => {
  const prismaMock = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    education: { create: jest.fn() },
    workExperience: { create: jest.fn() },
    resume: { create: jest.fn() },
  };
  prismaMockRef = prismaMock;
  return {
    PrismaClient: jest.fn(() => prismaMock),
    Prisma: jest.requireActual('@prisma/client').Prisma,
  };
});

import type { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { app, serverErrorHandler, startHttpServer } from './index';

describe('Express app wiring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prismaMockRef.candidate.create.mockResolvedValue({
      id: 1,
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
    });
    prismaMockRef.education.create.mockResolvedValue({});
    prismaMockRef.workExperience.create.mockResolvedValue({});
    prismaMockRef.resume.create.mockResolvedValue({});
  });

  it('GET / returns the public greeting', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hola LTI!');
  });

  it('POST /candidates creates a candidate', async () => {
    const res = await request(app).post('/candidates').send({
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
    });
    expect(res.status).toBe(201);
  });

  it('POST /upload rejects non-multipart requests without a file', async () => {
    const res = await request(app).post('/upload');
    expect([400, 500]).toContain(res.status);
  });

  it('starts listening and logs the boot message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const listenSpy = jest.spyOn(app, 'listen').mockImplementation(((p: unknown, cb: unknown) => {
      if (typeof cb === 'function') (cb as () => void)();
      return {} as any;
    }) as any);
    startHttpServer();
    expect(listenSpy).toHaveBeenCalledWith(3010, expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith('Server is running at http://localhost:3010');
    listenSpy.mockRestore();
    logSpy.mockRestore();
  });
});

describe('serverErrorHandler', () => {
  it('returns a 500 plain-text response', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('x');
    const send = jest.fn();
    const res: any = {};
    res.type = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue({ send });

    serverErrorHandler(err, {} as Request, res as Response, (() => {}) as NextFunction);

    expect(res.type).toHaveBeenCalledWith('text/plain');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith('Something broke!');
    jest.restoreAllMocks();
  });
});
