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

import { addCandidate } from './candidateService';

describe('addCandidate', () => {
  const validPayload = {
    firstName: 'Ana',
    lastName: 'López',
    email: 'ana@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMockRef.candidate.create.mockResolvedValue({
      id: 1,
      firstName: validPayload.firstName,
      lastName: validPayload.lastName,
      email: validPayload.email,
      phone: null,
      address: null,
    });
    prismaMockRef.education.create.mockResolvedValue({ id: 10 });
    prismaMockRef.workExperience.create.mockResolvedValue({ id: 20 });
    prismaMockRef.resume.create.mockResolvedValue({
      id: 30,
      candidateId: 1,
      filePath: '/cv.pdf',
      fileType: 'application/pdf',
      uploadDate: new Date(),
    });
  });

  it('persists the candidate via prisma.candidate.create with basic fields', async () => {
    const result = await addCandidate(validPayload);

    expect(prismaMockRef.candidate.create).toHaveBeenCalledTimes(1);
    expect(prismaMockRef.candidate.create).toHaveBeenCalledWith({
      data: {
        firstName: validPayload.firstName,
        lastName: validPayload.lastName,
        email: validPayload.email,
      },
    });
    expect(result).toMatchObject({
      id: 1,
      email: validPayload.email,
    });
  });

  it('wraps validation errors', async () => {
    await expect(
      addCandidate({
        ...validPayload,
        email: 'bad',
      }),
    ).rejects.toThrow();
  });

  it('persists nested educations, work experiences, and resume', async () => {
    await addCandidate({
      ...validPayload,
      educations: [
        {
          institution: 'Uni',
          title: 'Degree',
          startDate: '2018-09-01',
          endDate: '2022-06-01',
        },
      ],
      workExperiences: [
        {
          company: 'Acme',
          position: 'Dev',
          description: 'Build',
          startDate: '2022-07-01',
        },
      ],
      cv: { filePath: '/uploads/cv.pdf', fileType: 'application/pdf' },
    });

    expect(prismaMockRef.education.create).toHaveBeenCalled();
    expect(prismaMockRef.workExperience.create).toHaveBeenCalled();
    expect(prismaMockRef.resume.create).toHaveBeenCalled();
  });

  it('maps duplicate email (P2002) to a friendly error', async () => {
    prismaMockRef.candidate.create.mockRejectedValue({ code: 'P2002' });

    await expect(addCandidate(validPayload)).rejects.toThrow('The email already exists in the database');
  });

  it('rethrows unexpected persistence errors', async () => {
    const boom = new Error('db down');
    prismaMockRef.candidate.create.mockRejectedValue(boom);

    await expect(addCandidate(validPayload)).rejects.toThrow('db down');
  });
});
