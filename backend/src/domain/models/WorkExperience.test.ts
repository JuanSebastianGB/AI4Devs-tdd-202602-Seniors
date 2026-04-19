/* eslint-disable @typescript-eslint/no-explicit-any */
var prismaMockRef: {
  workExperience: { create: jest.Mock; update: jest.Mock };
};

jest.mock('@prisma/client', () => {
  const prismaMock = {
    workExperience: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  prismaMockRef = prismaMock;
  return {
    PrismaClient: jest.fn(() => prismaMock),
    Prisma: jest.requireActual('@prisma/client').Prisma,
  };
});

import { WorkExperience } from './WorkExperience';

describe('WorkExperience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows missing end dates', () => {
    const exp = new WorkExperience({
      company: 'Co',
      position: 'Dev',
      startDate: '2020-01-01',
    });
    expect(exp.endDate).toBeUndefined();
  });

  it('creates a new work experience record', async () => {
    prismaMockRef.workExperience.create.mockResolvedValue({ id: 1 });
    const exp = new WorkExperience({
      company: 'Co',
      position: 'Dev',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      candidateId: 7,
    });
    await exp.save();
    expect(prismaMockRef.workExperience.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        company: 'Co',
        position: 'Dev',
        candidateId: 7,
      }),
    });
  });

  it('updates an existing work experience record', async () => {
    prismaMockRef.workExperience.update.mockResolvedValue({ id: 3 });
    const exp = new WorkExperience({
      id: 3,
      company: 'Co',
      position: 'Dev',
      startDate: '2020-01-01',
    });
    await exp.save();
    expect(prismaMockRef.workExperience.update).toHaveBeenCalled();
  });
});
