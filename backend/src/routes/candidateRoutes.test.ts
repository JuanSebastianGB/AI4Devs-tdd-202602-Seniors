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

import express from 'express';
import request from 'supertest';
import candidateRoutes from './candidateRoutes';
import * as candidateService from '../application/services/candidateService';

const app = express();
app.use(express.json());
app.use('/', candidateRoutes);

describe('candidateRoutes', () => {
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

  it('POST / returns 201 when the payload is valid', async () => {
    const res = await request(app).post('/').send({
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
    });
    expect(res.status).toBe(201);
  });

  it('POST / returns 400 when validation fails', async () => {
    const res = await request(app).post('/').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('POST / returns 500 when the service rejects with a non-Error', async () => {
    jest.spyOn(candidateService, 'addCandidate').mockRejectedValueOnce('boom');
    const res = await request(app).post('/').send({
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
    });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('An unexpected error occurred');
  });
});
