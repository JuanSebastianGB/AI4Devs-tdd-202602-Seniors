---
name: lti-agentic-workflow
description: >
  LTI backend orchestration: Jest under backend/, candidate insertion (validation vs persistence), alignment with docs/PRD.md, and Prisma mocking.
  Use when adding or changing candidate tests, candidateService, validator, or Prisma integration without hitting a real database.
---

# LTI — backend agentic flow and candidate insertion tests

## Context

- **PRD**: `docs/PRD.md` — validation rules (B001–B010), flow `Controller → candidateService → Candidate → Prisma`.
- **Code**:
  - Input / reception rules: `backend/src/application/validator.ts` (`validateCandidateData`).
  - Orchestration and persistence: `backend/src/application/services/candidateService.ts` (`addCandidate`).
  - Model and `create`: `backend/src/domain/models/Candidate.ts` (and related models, each with its own `PrismaClient`).

## Related skills (reuse; do not duplicate)

| Need | Skill |
|------|--------|
| Gherkin / BDD criteria | `.agents/skills/bdd-gherkin-specification/SKILL.md` |
| Review or explore code | `.agents/skills/code-analyser/SKILL.md` |
| RED–GREEN–REFACTOR cycle | `.agents/skills/test-driven-development/SKILL.md` |

## Two unit-test families (candidate insertion)

1. **Data reception** (payload / form / API body): exercise `validateCandidateData` (or the controller with a mocked `req.body`). No database.
2. **Persistence**: exercise `addCandidate` (or `Candidate#save`) with **mocked Prisma** so nothing is written to PostgreSQL.

## Jest in this repo

- Config: `backend/jest.config.cjs` (`ts-jest` preset, `node` environment).
- Command: from `backend/`, run `pnpm test`.
- Examples in-repo:
  - `backend/src/application/validator.test.ts` — reception family.
  - `backend/src/application/services/candidateService.test.ts` — persistence family with `jest.mock('@prisma/client')`.

## Prisma mocking (unit tests)

- Official guide: [Testing series — Mock Prisma Client](https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o#mock-prisma-client).
- In this project each model uses `new PrismaClient()`; the mock must make **all** instances share the same mock object (e.g. `PrismaClient: jest.fn(() => prismaMock)` in the `jest.mock` factory).

## Quick checklist

- [ ] Change aligned with `docs/PRD.md` when it affects business rules or the API.
- [ ] At least one test per axis: input validation and persistence (with DB mocked).
- [ ] `pnpm test` in `backend/` green before closing the task.
