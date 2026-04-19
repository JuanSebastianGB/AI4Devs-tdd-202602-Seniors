/* eslint-disable @typescript-eslint/no-explicit-any */
var prismaMockRef: {
  candidate: { create: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
};

jest.mock('@prisma/client', () => {
  const prismaMock = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  prismaMockRef = prismaMock;
  return {
    PrismaClient: jest.fn(() => prismaMock),
    Prisma: jest.requireActual('@prisma/client').Prisma,
  };
});

import { Prisma } from '@prisma/client';
import { Candidate } from './Candidate';

describe('Candidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('constructs with default collections', () => {
    const c = new Candidate({
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
    });
    expect(c.education).toEqual([]);
    expect(c.workExperience).toEqual([]);
    expect(c.resumes).toEqual([]);
  });

  it('creates a candidate without nested relations', async () => {
    prismaMockRef.candidate.create.mockResolvedValue({ id: 1, firstName: 'A', lastName: 'B', email: 'a@b.com' });
    const c = new Candidate({
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      phone: '612345678',
      address: 'Calle 1',
    });
    const saved = await c.save();
    expect(saved).toMatchObject({ id: 1 });
    expect(prismaMockRef.candidate.create).toHaveBeenCalledWith({
      data: { firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '612345678', address: 'Calle 1' },
    });
  });

  it('includes nested creates when education, work, and resumes are present', async () => {
    prismaMockRef.candidate.create.mockResolvedValue({ id: 9 });
    const c = new Candidate({
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      education: [
        {
          institution: 'Uni',
          title: 'T',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
      workExperience: [
        {
          company: 'Co',
          position: 'P',
          description: 'D',
          startDate: '2021-02-01',
        },
      ],
      resumes: [{ filePath: '/f', fileType: 'application/pdf' }],
    });
    await c.save();
    expect(prismaMockRef.candidate.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          educations: expect.any(Object),
          workExperiences: expect.any(Object),
          resumes: expect.any(Object),
        }),
      }),
    );
  });

  it('updates an existing candidate', async () => {
    prismaMockRef.candidate.update.mockResolvedValue({ id: 2, firstName: 'A', lastName: 'B', email: 'a@b.com' });
    const c = new Candidate({ id: 2, firstName: 'A', lastName: 'B', email: 'a@b.com' });
    await c.save();
    expect(prismaMockRef.candidate.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { firstName: 'A', lastName: 'B', email: 'a@b.com' },
    });
  });

  it('maps Prisma initialization errors on update', async () => {
    prismaMockRef.candidate.update.mockRejectedValue(new Prisma.PrismaClientInitializationError('x', 'y'));
    const c = new Candidate({ id: 2, firstName: 'A', lastName: 'B', email: 'a@b.com' });
    await expect(c.save()).rejects.toThrow('No se pudo conectar con la base de datos');
  });

  it('maps P2025 on update to a not-found error', async () => {
    prismaMockRef.candidate.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('x', { code: 'P2025', clientVersion: '5', meta: {} }),
    );
    const c = new Candidate({ id: 2, firstName: 'A', lastName: 'B', email: 'a@b.com' });
    await expect(c.save()).rejects.toThrow('No se pudo encontrar el registro del candidato con el ID proporcionado.');
  });

  it('rethrows unknown update errors', async () => {
    prismaMockRef.candidate.update.mockRejectedValue(new Error('other'));
    const c = new Candidate({ id: 2, firstName: 'A', lastName: 'B', email: 'a@b.com' });
    await expect(c.save()).rejects.toThrow('other');
  });

  it('maps Prisma initialization errors on create', async () => {
    prismaMockRef.candidate.create.mockRejectedValue(new Prisma.PrismaClientInitializationError('x', 'y'));
    const c = new Candidate({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    await expect(c.save()).rejects.toThrow('No se pudo conectar con la base de datos');
  });

  it('rethrows unknown create errors', async () => {
    prismaMockRef.candidate.create.mockRejectedValue(new Error('boom'));
    const c = new Candidate({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    await expect(c.save()).rejects.toThrow('boom');
  });

  it('returns null from findOne when missing', async () => {
    prismaMockRef.candidate.findUnique.mockResolvedValue(null);
    await expect(Candidate.findOne(99)).resolves.toBeNull();
  });

  it('hydrates from findOne', async () => {
    prismaMockRef.candidate.findUnique.mockResolvedValue({
      id: 3,
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
    });
    const found = await Candidate.findOne(3);
    expect(found).toBeInstanceOf(Candidate);
    expect(found?.email).toBe('a@b.com');
  });
});
