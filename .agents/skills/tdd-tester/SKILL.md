---
name: tdd-tester
description: |
  Create unit tests following TDD methodology for backend services. Use this skill whenever the user wants to write tests, create test suites, implement TDD, or needs to test validation logic, database persistence, or controller behavior. Supports Jest testing framework with Prisma mock for database isolation.
trigger: |
  The skill triggers when user mentions: test, TDD, unit tests, jest, mocking, validation tests, database tests, test suite, coverage, or similar testing concepts for backend code.
---

## TDD Cycle: Red → Green → Refactor

Follow this cycle for each test:

1. **Red**: Write a failing test first (test describes expected behavior)
2. **Green**: Write minimum code to make test pass
3. **Refactor**: Improve code without breaking tests

# TDD Tester Skill

This skill helps create unit tests following Test-Driven Development methodology for the backend project.

## Project Structure

- **Backend tests location**: `backend/tests/`
- **Test framework**: Jest with ts-jest
- **Test patterns**: `*.test.ts`
- **Prisma mock location**: `backend/tests/__mocks__/`

## Workflow

### 1. Analyze the code to test

Read the source files to understand:
- Validation logic (validator.ts)
- Service layer (candidateService.ts)
- Controller layer (candidateController.ts)
- Database models (Candidate.ts, Education.ts, WorkExperience.ts, Resume.ts)

### 2. Identify test families

Split tests into two distinct families:
1. **Validation tests** - Test input validation without database
2. **Persistence tests** - Test database operations with mocked Prisma

### 3. Create test files

#### AAA Pattern
Use Arrange → Act → Assert structure:
```typescript
describe('validateEmail', () => {
  it('valid email - passes without error', () => {
    // Arrange
    const email = 'test@example.com';
    // Act
    const result = validateEmail(email);
    // Assert
    expect(result).toBe(true);
  });
});
```

#### For validation tests (`backend/tests/validator.test.ts`):
- Test each validation function independently
- Use describe blocks for each validation rule
- Test both valid and invalid inputs
- Verify error messages

#### For persistence tests (`backend/tests/candidateService.test.ts`):
- Mock Prisma Client using jest-mock-extended
- Test successful insertions
- Test error handling (duplicates, connection errors)
- Verify service returns expected responses

### 4. Fake It 'Til You Make It

When stuck, start with hardcoded solution to pass test, then refine:
```typescript
// First: make it pass no matter what
function validateEmail(email: string) {
  return true; // Hardcoded
}
// Later: refine with real logic
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### 5. Parameterized Tests

Avoid duplication by testing multiple inputs:
```typescript
describe.each([
  ['valid@example.com', true],
  ['invalid', false],
  ['', false],
  ['test@domain.co', true],
])('validateEmail - %s', (input, expected) => {
  it(\`returns \${expected}\`, () => {
    expect(validateEmail(input)).toBe(expected);
  });
});
```

### 6. Edge Cases

Test beyond happy path:
- Empty strings
- Null/undefined values
- Special characters (<>&"'...)
- Unicode characters (ñ, é, 中文, etc.)
- Very long strings
- Whitespace only

### 7. Setup Prisma Mock

Create `backend/tests/__mocks__/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

beforeEach(() => {
  mockReset(prismaMock);
});

const prismaMock = mockDeep<PrismaClient>();
export default prismaMock;
```

Update the Candidate model to support dependency injection for testing:

```typescript
let prismaInstance: PrismaClient | null = null;

export function setPrismaClient(client: PrismaClient) {
  prismaInstance = client;
}

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

// In save() method, use getPrismaClient() instead of direct prisma
```

### 8. Run tests

Execute tests with: `pnpm test`

## Test Naming Convention

Use descriptive names following pattern:
- `[METHOD] - [SCENARIO] - [EXPECTED_RESULT]`

Examples:
- `validateName - valid name - passes without error`
- `addCandidate - valid data - returns created candidate`
- `addCandidate - duplicate email - throws duplicate error`

## Required Test Coverage

### Validation Family (minimum):
- validateName with valid/invalid inputs
- validateEmail with valid/invalid inputs  
- validatePhone with valid/invalid inputs
- validateDate with valid/invalid formats
- validateCandidateData complete flow

### Persistence Family (minimum):
- Successful candidate creation
- Error handling for duplicate email (P2002)
- Error handling for database connection failures

## Error Handling Requirements

Tests must verify:
- Proper error messages for validation failures
- Correct HTTP status codes in controllers (400 for bad input)
- Prisma error codes handling (P2002 for duplicates)
- Database connection error handling

## Key Files to Test

1. `backend/src/application/validator.ts` - All validation functions
2. `backend/src/application/services/candidateService.ts` - addCandidate function
3. `backend/src/presentation/controllers/candidateController.ts` - addCandidateController

## Output

After creating tests, run `pnpm test` to verify all tests pass. Update any failing tests to match expected behavior.