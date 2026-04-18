---
name: dev-workflow
description: Manages the complete development workflow of the project. Use this skill when you need to follow development rules, do a complete feature, or need to know project conventions.
---

# Dev Workflow

This skill defines the development flow and project conventions.

## Project Rules

### Main Technology
- **Package Manager**: pnpm (strictly)
- **Backend**: Node.js + Express + Prisma
- **Frontend**: React + TypeScript
- **Testing**: Jest

### Code
- **NO inline comments** - Code should be self-explanatory
- **TypeScript strict** - Explicit types always
- **ESLint + Prettier** - Automatic formatting

### Structure
```
backend/
├── src/
│   ├── application/services/
│   ├── application/validator.ts
│   ├── presentation/controllers/
│   └── infrastructure/database/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
└── tests/
```

### Documentation
- **Update /docs** after each new feature
- README.md always up to date
- Guides in docs/

### Testing (MANDATORY)
- **Each new feature** must have tests
- Backend: backend/tests/
- Frontend: frontend/tests/
- Minimum 70% coverage

### Git Workflow
- **Always use pr-pusher** for commits and PRs
- Branches: feature/feature-name
- Conventional commits: feat:, fix:, docs:, refactor:

## Feature Flow

1. **Analyze** - Understand the requirement
2. **Implement** - Code + Tests + Docs
3. **Validate** - pnpm test passes
4. **Commit** - pr-pusher for commit and PR

## Common Errors to Avoid

- Forgetting tests for new functionality
- Not updating documentation
- Using npm/yarn instead of pnpm
- Writing unnecessary comments
- Pushing directly to main (always use pr-pusher)