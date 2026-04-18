---
name: code-quality
description: Executes linting, typechecking, and code formatting. Use this skill when you need to verify the code is error-free, pass linter, or verify Types.
---

# Code Quality Skill

Executes code quality verifications.

## Verifications

### 1. Linting
```bash
pnpm lint
```
Verifies code follows style rules.

### 2. Type Checking
```bash
pnpm typecheck
```
Verifies TypeScript errors.

### 3. Format
```bash
pnpm format
```
Formats code with Prettier.

### 4. All Checks
```bash
pnpm quality
```
Runs lint + typecheck + format.

## Rules

- **Always execute** code-quality before commit
- **Resolve ALL** lint errors
- **Resolve ALL** typecheck errors
- **Do not commit** if there are errors

## Output

When executing, report:
- Errors found (if any)
- Affected files
- Commands executed