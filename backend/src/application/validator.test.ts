import { validateCandidateData } from './validator';

const base = {
  firstName: 'Ana',
  lastName: 'López',
  email: 'ana@example.com',
};

describe('validateCandidateData', () => {
  it('skips mandatory field checks when id is present (edit flow)', () => {
    expect(() =>
      validateCandidateData({
        id: 1,
        firstName: '1',
        email: 'not-email',
      }),
    ).not.toThrow();
  });

  it('rejects invalid first name', () => {
    expect(() => validateCandidateData({ ...base, firstName: 'A' })).toThrow('Invalid name');
    expect(() => validateCandidateData({ ...base, firstName: '' })).toThrow('Invalid name');
    expect(() => validateCandidateData({ ...base, firstName: 'a'.repeat(101) })).toThrow('Invalid name');
    expect(() => validateCandidateData({ ...base, firstName: 'Ana123' })).toThrow('Invalid name');
  });

  it('rejects invalid last name', () => {
    expect(() => validateCandidateData({ ...base, lastName: 'X' })).toThrow('Invalid name');
  });

  it('rejects invalid email', () => {
    expect(() => validateCandidateData({ ...base, email: 'not-an-email' })).toThrow('Invalid email');
    expect(() => validateCandidateData({ ...base, email: '' })).toThrow('Invalid email');
  });

  it('rejects invalid phone when provided', () => {
    expect(() => validateCandidateData({ ...base, phone: '123456789' })).toThrow('Invalid phone');
  });

  it('allows missing phone', () => {
    expect(() => validateCandidateData({ ...base })).not.toThrow();
  });

  it('rejects address longer than 100 chars', () => {
    expect(() => validateCandidateData({ ...base, address: 'x'.repeat(101) })).toThrow('Invalid address');
  });

  it('validates education entries', () => {
    expect(() =>
      validateCandidateData({
        ...base,
        educations: [{ institution: 'x'.repeat(101), title: 'T', startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid institution');
    expect(() =>
      validateCandidateData({
        ...base,
        educations: [{ institution: 'Uni', title: 'x'.repeat(101), startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid title');
    expect(() =>
      validateCandidateData({
        ...base,
        educations: [{ institution: '', title: 'T', startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid institution');
    expect(() =>
      validateCandidateData({
        ...base,
        educations: [{ institution: 'Uni', title: '', startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid title');
    expect(() =>
      validateCandidateData({
        ...base,
        educations: [{ institution: 'Uni', title: 'T', startDate: 'bad' }],
      }),
    ).toThrow('Invalid date');
    expect(() =>
      validateCandidateData({
        ...base,
        educations: [{ institution: 'Uni', title: 'T', startDate: '2020-01-01', endDate: 'nope' }],
      }),
    ).toThrow('Invalid end date');
    expect(() =>
      validateCandidateData({
        ...base,
        educations: [{ institution: 'Uni', title: 'T', startDate: '2020-01-01' }],
      }),
    ).not.toThrow();
  });

  it('validates work experience entries', () => {
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [{ company: 'x'.repeat(101), position: 'P', startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid company');
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [{ company: 'Co', position: 'x'.repeat(101), startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid position');
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [{ company: '', position: 'P', startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid company');
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [{ company: 'Co', position: '', startDate: '2020-01-01' }],
      }),
    ).toThrow('Invalid position');
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [
          { company: 'Co', position: 'P', startDate: '2020-01-01', description: 'd'.repeat(201) },
        ],
      }),
    ).toThrow('Invalid description');
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [{ company: 'Co', position: 'P', startDate: 'x' }],
      }),
    ).toThrow('Invalid date');
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [
          { company: 'Co', position: 'P', startDate: '2020-01-01', endDate: 'bad' },
        ],
      }),
    ).toThrow('Invalid end date');
    expect(() =>
      validateCandidateData({
        ...base,
        workExperiences: [{ company: 'Co', position: 'P', startDate: '2020-01-01' }],
      }),
    ).not.toThrow();
  });

  it('validates cv when non-empty object', () => {
    expect(() => validateCandidateData({ ...base, cv: {} })).not.toThrow();
    expect(() => validateCandidateData({ ...base, cv: { filePath: '/a', fileType: 'application/pdf' } })).not.toThrow();
    expect(() => validateCandidateData({ ...base, cv: 'x' as unknown as object })).toThrow('Invalid CV data');
    expect(() =>
      validateCandidateData({ ...base, cv: { filePath: 1, fileType: 'application/pdf' } as unknown as object }),
    ).toThrow('Invalid CV data');
    expect(() =>
      validateCandidateData({ ...base, cv: { filePath: '/a', fileType: 2 } as unknown as object }),
    ).toThrow('Invalid CV data');
  });
});
