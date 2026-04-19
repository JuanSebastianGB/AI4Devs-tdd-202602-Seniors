# LTI / AI4Devs — project instructions

## Mandatory

- Use **pnpm only** (not npm or yarn).

## North Star

- Product requirements and business rules: **`docs/PRD.md`**. Read it before functional changes, validation rules, or API contract changes.

## Agentic workflow (lightweight)

Three complementary roles (specification → analysis → implementation with tests), described in **`.cursor/rules/lti-agent-workflow.mdc`**, and the playbook **`/.agents/skills/lti-agentic-workflow/SKILL.md`** (Jest, Prisma mocks, code paths).

| Role | Skill / artifact |
|-----|-------------------|
| Specification (Gherkin / criteria) | `.agents/skills/bdd-gherkin-specification/SKILL.md` |
| Code analysis | `.agents/skills/code-analyser/SKILL.md` |
| TDD and implementation | `.agents/skills/test-driven-development/SKILL.md` |
| LTI backend + Jest details | `.agents/skills/lti-agentic-workflow/SKILL.md` |

## Backend

- Code and tests: **`backend/`** folder. Run tests with `pnpm test` from `backend/` (see `backend/AGENTS.md`).
