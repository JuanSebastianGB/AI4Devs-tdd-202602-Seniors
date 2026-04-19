/* eslint-disable @typescript-eslint/no-explicit-any */
var prismaMockRef: {
  education: { create: jest.Mock; update: jest.Mock };
};

jest.mock('@prisma/client', () => {
  const prismaMock = {
    education: {
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

import { Education } from './Education';

describe('Education', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new education record', async () => {
    prismaMockRef.education.create.mockResolvedValue({ id: 1 });
    const edu = new Education({
      institution: 'Uni',
      title: 'Title',
      startDate: '2020-01-01',
      candidateId: 5,
    });
    await edu.save();
    expect(prismaMockRef.education.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        institution: 'Uni',
        title: 'Title',
        candidateId: 5,
      }),
    });
  });

  it('updates an existing education record', async () => {
    prismaMockRef.education.update.mockResolvedValue({ id: 2 });
    const edu = new Education({
      id: 2,
      institution: 'Uni',
      title: 'Title',
      startDate: '2020-01-01',
    });
    await edu.save();
    expect(prismaMockRef.education.update).toHaveBeenCalled();
  });
});
