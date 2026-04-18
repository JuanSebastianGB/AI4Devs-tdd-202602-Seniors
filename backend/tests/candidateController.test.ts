jest.mock('../src/application/services/candidateService', () => ({
    addCandidate: jest.fn()
}));

import { Request, Response, NextFunction } from 'express';
import { addCandidateController } from '../src/presentation/controllers/candidateController';
import { addCandidate } from '../src/application/services/candidateService';

const mockAddCandidate = addCandidate as jest.Mock;

describe('CandidateController - Controller Layer', () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        mockReq = {
            body: {}
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        jest.clearAllMocks();
    });

    describe('addCandidateController', () => {
        it('successful candidate creation - returns 201 with data', async () => {
            const mockCandidate = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            mockAddCandidate.mockResolvedValue(mockCandidate);

            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            await addCandidateController(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Candidate added successfully',
                data: mockCandidate
            });
        });

        it('validation error - returns 400 with error message', async () => {
            mockAddCandidate.mockRejectedValue(new Error('Invalid name'));

            mockReq.body = {
                firstName: '',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            await addCandidateController(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Invalid name'
            });
        });

        it('duplicate email error - returns 400 with duplicate message', async () => {
            mockAddCandidate.mockRejectedValue(new Error('The email already exists in the database'));

            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'existing@example.com'
            };

            await addCandidateController(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'The email already exists in the database'
            });
        });

        it('unknown error - returns 400 with unknown error message', async () => {
            mockAddCandidate.mockRejectedValue('Some unknown error');

            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            await addCandidateController(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Unknown error'
            });
        });

        it('empty request body - returns 400 with validation error', async () => {
            mockAddCandidate.mockRejectedValue(new Error('Invalid email'));

            mockReq.body = {};

            await addCandidateController(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Invalid email'
            });
        });
    });
});