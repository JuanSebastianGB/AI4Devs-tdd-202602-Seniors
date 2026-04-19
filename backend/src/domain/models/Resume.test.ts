/* eslint-disable @typescript-eslint/no-explicit-any */
var prismaMockRef: {
  resume: { create: jest.Mock };
};

jest.mock('@prisma/client', () => {
  const prismaMock = {
    resume: { create: jest.fn() },
  };
  prismaMockRef = prismaMock;
  return {
    PrismaClient: jest.fn(() => prismaMock),
    Prisma: jest.requireActual('@prisma/client').Prisma,
  };
});

import { Resume } from './Resume';

describe('Resume', () => {
  it('hydrates optional fields defensively', () => {
    const empty = new Resume({});
    expect(empty.id).toBeUndefined();
    expect(empty.candidateId).toBeUndefined();

    const partial = new Resume({ id: 2, filePath: '/x', fileType: 'application/pdf' });
    expect(partial.id).toBe(2);
    expect(partial.filePath).toBe('/x');

    const nullable = new Resume(null as unknown as Record<string, never>);
    expect(nullable.id).toBeUndefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a resume when saving without id', async () => {
    prismaMockRef.resume.create.mockResolvedValue({
      id: 1,
      candidateId: 9,
      filePath: '/cv.pdf',
      fileType: 'application/pdf',
      uploadDate: new Date(),
    });
    const r = new Resume({ candidateId: 9, filePath: '/cv.pdf', fileType: 'application/pdf' });
    const saved = await r.save();
    expect(prismaMockRef.resume.create).toHaveBeenCalled();
    expect(saved).toBeInstanceOf(Resume);
  });

  it('rejects updates to an existing resume id', async () => {
    const r = new Resume({
      id: 1,
      candidateId: 9,
      filePath: '/cv.pdf',
      fileType: 'application/pdf',
    });
    await expect(r.save()).rejects.toThrow('No se permite la actualización de un currículum existente.');
  });
});
