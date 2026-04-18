import { validateCandidateData, validateName, validateEmail, validatePhone, validateDate, validateAddress, validateEducation, validateExperience, validateCV } from '../src/application/validator';

describe('Validator - Validation Layer', () => {
    describe('validateName', () => {
        it('valid name - passes without error', () => {
            expect(() => validateName('John')).not.toThrow();
        });

        it('valid name with accented characters - passes without error', () => {
            expect(() => validateName('José María')).not.toThrow();
        });

        it('empty name - throws error', () => {
            expect(() => validateName('')).toThrow('Invalid name');
        });

        it('null name - throws error', () => {
            expect(() => validateName(null as any)).toThrow('Invalid name');
        });

        it('name too short - throws error', () => {
            expect(() => validateName('A')).toThrow('Invalid name');
        });

        it('name too long - throws error', () => {
            expect(() => validateName('A'.repeat(101))).toThrow('Invalid name');
        });

        it('name with numbers - throws error', () => {
            expect(() => validateName('John123')).toThrow('Invalid name');
        });

        it('name with special characters - throws error', () => {
            expect(() => validateName('John-Doe')).toThrow('Invalid name');
        });
    });

    describe('validateEmail', () => {
        it('valid email - passes without error', () => {
            expect(() => validateEmail('test@example.com')).not.toThrow();
        });

        it('valid email with subdomain - passes without error', () => {
            expect(() => validateEmail('test@mail.example.com')).not.toThrow();
        });

        it('valid email with plus - passes without error', () => {
            expect(() => validateEmail('test+tag@example.com')).not.toThrow();
        });

        it('empty email - throws error', () => {
            expect(() => validateEmail('')).toThrow('Invalid email');
        });

        it('null email - throws error', () => {
            expect(() => validateEmail(null as any)).toThrow('Invalid email');
        });

        it('email without @ - throws error', () => {
            expect(() => validateEmail('testexample.com')).toThrow('Invalid email');
        });

        it('email without domain - throws error', () => {
            expect(() => validateEmail('test@')).toThrow('Invalid email');
        });

        it('email without TLD - throws error', () => {
            expect(() => validateEmail('test@example')).toThrow('Invalid email');
        });
    });

    describe('validatePhone', () => {
        it('valid phone (mobile Spain 6) - passes without error', () => {
            expect(() => validatePhone('612345678')).not.toThrow();
        });

        it('valid phone (mobile Spain 7) - passes without error', () => {
            expect(() => validatePhone('712345678')).not.toThrow();
        });

        it('valid phone (mobile Spain 9) - passes without error', () => {
            expect(() => validatePhone('912345678')).not.toThrow();
        });

        it('empty phone - passes without error', () => {
            expect(() => validatePhone('')).not.toThrow();
        });

        it('null phone - passes without error', () => {
            expect(() => validatePhone(null as any)).not.toThrow();
        });

        it('phone too short - throws error', () => {
            expect(() => validatePhone('61234567')).toThrow('Invalid phone');
        });

        it('phone with letter - throws error', () => {
            expect(() => validatePhone('61234567a')).toThrow('Invalid phone');
        });

        it('phone with wrong prefix - throws error', () => {
            expect(() => validatePhone('512345678')).toThrow('Invalid phone');
        });
    });

    describe('validateDate', () => {
        it('valid date - passes without error', () => {
            expect(() => validateDate('2024-01-15')).not.toThrow();
        });

        it('empty date - throws error', () => {
            expect(() => validateDate('')).toThrow('Invalid date');
        });

        it('null date - throws error', () => {
            expect(() => validateDate(null as any)).toThrow('Invalid date');
        });

        it('invalid format (DD-MM-YYYY) - throws error', () => {
            expect(() => validateDate('15-01-2024')).toThrow('Invalid date');
        });

        it('invalid format (numeric) - throws error', () => {
            expect(() => validateDate('20240115')).toThrow('Invalid date');
        });
    });

    describe('validateAddress', () => {
        it('valid address - passes without error', () => {
            expect(() => validateAddress('Calle Mayor 123')).not.toThrow();
        });

        it('empty address - passes without error', () => {
            expect(() => validateAddress('')).not.toThrow();
        });

        it('null address - passes without error', () => {
            expect(() => validateAddress(null as any)).not.toThrow();
        });

        it('address too long - throws error', () => {
            expect(() => validateAddress('A'.repeat(101))).toThrow('Invalid address');
        });
    });

    describe('validateEducation', () => {
        const validEducation = {
            institution: 'University of Madrid',
            title: 'Computer Science Degree',
            startDate: '2020-09-01',
            endDate: '2024-06-30'
        };

        it('valid education - passes without error', () => {
            expect(() => validateEducation(validEducation)).not.toThrow();
        });

        it('education without endDate - passes without error', () => {
            expect(() => validateEducation({ ...validEducation, endDate: undefined })).not.toThrow();
        });

        it('education without institution - throws error', () => {
            const edu = { ...validEducation, institution: '' };
            expect(() => validateEducation(edu)).toThrow('Invalid institution');
        });

        it('education with long institution - throws error', () => {
            const edu = { ...validEducation, institution: 'A'.repeat(101) };
            expect(() => validateEducation(edu)).toThrow('Invalid institution');
        });

        it('education without title - throws error', () => {
            const edu = { ...validEducation, title: '' };
            expect(() => validateEducation(edu)).toThrow('Invalid title');
        });

        it('education with invalid startDate - throws error', () => {
            const edu = { ...validEducation, startDate: 'invalid' };
            expect(() => validateEducation(edu)).toThrow('Invalid date');
        });

        it('education with invalid endDate - throws error', () => {
            const edu = { ...validEducation, endDate: 'invalid' };
            expect(() => validateEducation(edu)).toThrow('Invalid end date');
        });
    });

    describe('validateExperience', () => {
        const validExperience = {
            company: 'Tech Corp',
            position: 'Software Developer',
            description: 'Developing web applications',
            startDate: '2022-01-01',
            endDate: '2023-12-31'
        };

        it('valid experience - passes without error', () => {
            expect(() => validateExperience(validExperience)).not.toThrow();
        });

        it('experience without endDate - passes without error', () => {
            expect(() => validateExperience({ ...validExperience, endDate: undefined })).not.toThrow();
        });

        it('experience without description - passes without error', () => {
            const exp = { ...validExperience, description: undefined };
            expect(() => validateExperience(exp)).not.toThrow();
        });

        it('experience without company - throws error', () => {
            const exp = { ...validExperience, company: '' };
            expect(() => validateExperience(exp)).toThrow('Invalid company');
        });

        it('experience with long company - throws error', () => {
            const exp = { ...validExperience, company: 'A'.repeat(101) };
            expect(() => validateExperience(exp)).toThrow('Invalid company');
        });

        it('experience without position - throws error', () => {
            const exp = { ...validExperience, position: '' };
            expect(() => validateExperience(exp)).toThrow('Invalid position');
        });

        it('experience with long description - throws error', () => {
            const exp = { ...validExperience, description: 'A'.repeat(201) };
            expect(() => validateExperience(exp)).toThrow('Invalid description');
        });

        it('experience with invalid startDate - throws error', () => {
            const exp = { ...validExperience, startDate: 'invalid' };
            expect(() => validateExperience(exp)).toThrow('Invalid date');
        });
    });

    describe('validateCV', () => {
        const validCV = {
            filePath: '/uploads/cv.pdf',
            fileType: 'application/pdf'
        };

        it('valid CV - passes without error', () => {
            expect(() => validateCV(validCV)).not.toThrow();
        });

        it('CV without filePath - throws error', () => {
            const cv = { fileType: 'application/pdf' };
            expect(() => validateCV(cv)).toThrow('Invalid CV data');
        });

        it('CV with non-string filePath - throws error', () => {
            const cv = { filePath: 123, fileType: 'application/pdf' };
            expect(() => validateCV(cv)).toThrow('Invalid CV data');
        });

        it('CV without fileType - throws error', () => {
            const cv = { filePath: '/uploads/cv.pdf' };
            expect(() => validateCV(cv)).toThrow('Invalid CV data');
        });

        it('CV with non-string fileType - throws error', () => {
            const cv = { filePath: '/uploads/cv.pdf', fileType: 123 };
            expect(() => validateCV(cv)).toThrow('Invalid CV data');
        });
    });

    describe('validateCandidateData (Full Flow)', () => {
        const validCandidate = {
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

        it('valid candidate data - passes without error', () => {
            expect(() => validateCandidateData(validCandidate)).not.toThrow();
        });

        it('candidate without optional fields - passes without error', () => {
            const candidate = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };
            expect(() => validateCandidateData(candidate)).not.toThrow();
        });

        it('candidate with empty educations - passes without error', () => {
            const candidate = { ...validCandidate, educations: [] };
            expect(() => validateCandidateData(candidate)).not.toThrow();
        });

        it('candidate with empty workExperiences - passes without error', () => {
            const candidate = { ...validCandidate, workExperiences: [] };
            expect(() => validateCandidateData(candidate)).not.toThrow();
        });

        it('candidate without firstName - throws error', () => {
            const candidate = { ...validCandidate, firstName: '' };
            expect(() => validateCandidateData(candidate)).toThrow('Invalid name');
        });

        it('candidate without lastName - throws error', () => {
            const candidate = { ...validCandidate, lastName: '' };
            expect(() => validateCandidateData(candidate)).toThrow('Invalid name');
        });

        it('candidate without email - throws error', () => {
            const candidate = { ...validCandidate, email: '' };
            expect(() => validateCandidateData(candidate)).toThrow('Invalid email');
        });

        it('candidate with invalid email - throws error', () => {
            const candidate = { ...validCandidate, email: 'invalid-email' };
            expect(() => validateCandidateData(candidate)).toThrow('Invalid email');
        });

        it('candidate with invalid phone - throws error', () => {
            const candidate = { ...validCandidate, phone: '123456789' };
            expect(() => validateCandidateData(candidate)).toThrow('Invalid phone');
        });

        it('candidate with id (edit mode) - passes without error even without required fields', () => {
            const candidate = { id: 1 };
            expect(() => validateCandidateData(candidate)).not.toThrow();
        });
    });
});