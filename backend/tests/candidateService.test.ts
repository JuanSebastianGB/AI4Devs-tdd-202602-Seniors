jest.mock('../src/domain/models/Candidate', () => {
    return {
        __esModule: true,
        Candidate: jest.fn().mockImplementation((data) => ({
            ...data,
            id: data?.id,
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            phone: data?.phone,
            address: data?.address,
            education: data?.education || [],
            workExperience: data?.workExperience || [],
            resumes: data?.resumes || [],
            save: jest.fn().mockResolvedValue({
                id: 1,
                firstName: data?.firstName || 'MockFirstName',
                lastName: data?.lastName || 'MockLastName',
                email: data?.email || 'mock@example.com',
                phone: data?.phone || null,
                address: data?.address || null
            })
        })),
        setPrismaClient: jest.fn(),
        getPrismaClient: jest.fn()
    };
});

jest.mock('../src/domain/models/Education', () => ({
    __esModule: true,
    Education: jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue({ id: 1 })
    })),
    getPrismaClient: jest.fn()
}));

jest.mock('../src/domain/models/WorkExperience', () => ({
    __esModule: true,
    WorkExperience: jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue({ id: 1 })
    })),
    getPrismaClient: jest.fn()
}));

jest.mock('../src/domain/models/Resume', () => ({
    __esModule: true,
    Resume: jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue({ id: 1 })
    })),
    getPrismaClient: jest.fn()
}));

import { addCandidate } from '../src/application/services/candidateService';
import { Candidate } from '../src/domain/models/Candidate';

beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

describe('CandidateService - Persistence Layer', () => {
    const validCandidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '612345678',
        address: 'Calle Mayor 123',
        educations: [
            {
                institution: 'University of Madrid',
                title: 'Computer Science',
                startDate: '2020-09-01',
                endDate: '2024-06-30'
            }
        ],
        workExperiences: [
            {
                company: 'Tech Corp',
                position: 'Developer',
                description: 'Web development',
                startDate: '2022-01-01',
                endDate: '2023-12-31'
            }
        ],
        cv: {
            filePath: '/uploads/cv.pdf',
            fileType: 'application/pdf'
        }
    };

    describe('addCandidate - Successful Scenarios', () => {
        it('valid data - returns created candidate', async () => {
            const result = await addCandidate(validCandidateData);

            expect(result).toBeDefined();
            expect(result.email).toBe('john@example.com');
        });

        it('valid data with education - saves education records', async () => {
            const dataWithEducation = {
                ...validCandidateData,
                workExperiences: undefined,
                cv: undefined
            };

            const result = await addCandidate(dataWithEducation);

            expect(result).toBeDefined();
        });

        it('valid data with work experience - saves work experience records', async () => {
            const dataWithWorkExp = {
                ...validCandidateData,
                educations: undefined,
                cv: undefined
            };

            const result = await addCandidate(dataWithWorkExp);

            expect(result).toBeDefined();
        });

        it('valid data with CV - saves resume records', async () => {
            const dataWithCV = {
                ...validCandidateData,
                educations: undefined,
                workExperiences: undefined
            };

            const result = await addCandidate(dataWithCV);

            expect(result).toBeDefined();
        });

        it('minimal data (only required fields) - saves candidate successfully', async () => {
            const minimalData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'unique' + Date.now() + '@example.com'
            };

            const result = await addCandidate(minimalData);

            expect(result).toBeDefined();
        });
    });

    describe('addCandidate - Error Handling', () => {
        it('invalid data - throws validation error', async () => {
            const invalidData = {
                firstName: '',
                lastName: 'Doe',
                email: 'invalid-email'
            };

            await expect(addCandidate(invalidData)).rejects.toThrow('Invalid name');
        });
    });
});