### Role & Objective
Act as a Senior SDET (Software Development Engineer in Test).
Your objective is to implement a robust Jest unit test suite for the **Candidate Insertion** functionality.

### Additional Context
- PRD
- available test and code skills

### Directives
1. **Context Acquisition:** Scan the codebase to identify the specific controllers, services, and schemas responsible for candidate creation and form data handling.
2. **Test Implementation:** Construct the test suite ensuring coverage for the following two domains:
   - **Form Data Reception:** Implement at least one test validating the ingestion, parsing, and validation of incoming candidate payloads.
   - **Database Persistence:** Implement at least one test validating the successful mapping and saving of the candidate record to the database.
3. **External information** To check what are the current versions of the test libraries and best practices using them use context7

### Technical Constraints
- **Absolute Database Isolation:** You MUST mock the database layer to prevent any real data mutation.
- **Prisma Mocking:** Since the project uses Prisma, strictly follow the official mocking implementation paradigm. Reference: [Prisma Mocking Documentation](https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o#mock-prisma-client).
- Use `jest.mock()` or `jest-mock-extended` as appropriate for the existing project configuration.

### Output
Generate the complete, production-ready `*.test.js` or `*.test.ts` file. Ensure all necessary imports, setup blocks (`beforeEach`, `afterEach`), and mock initializations are included.


# Mandatory
It must have 100% of coverage
