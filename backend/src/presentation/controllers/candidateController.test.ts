jest.mock('../../application/services/candidateService', () => ({
  addCandidate: jest.fn(),
}));

import { addCandidate } from '../../application/services/candidateService';
import { addCandidateController } from './candidateController';

describe('addCandidateController', () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res: any = { status, json };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 201 when candidate creation succeeds', async () => {
    (addCandidate as jest.Mock).mockResolvedValue({ id: 1 });
    await addCandidateController({ body: { firstName: 'Ana' } } as any, res);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      message: 'Candidate added successfully',
      data: { id: 1 },
    });
  });

  it('returns 400 when addCandidate rejects with an Error', async () => {
    (addCandidate as jest.Mock).mockRejectedValue(new Error('bad'));
    await addCandidateController({ body: {} } as any, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'Error adding candidate',
      error: 'bad',
    });
  });

  it('returns 400 when addCandidate rejects with a non-Error value', async () => {
    (addCandidate as jest.Mock).mockRejectedValue('weird');
    await addCandidateController({ body: {} } as any, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'Error adding candidate',
      error: 'Unknown error',
    });
  });
});
