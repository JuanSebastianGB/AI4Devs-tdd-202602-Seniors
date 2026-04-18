---
name: conventional-commit
description: Create Git commits following Conventional Commits specification. Use whenever the user wants to commit changes, wants to create a git commit, mentions "commit" with changes, or asks about commit messages.
---

## Conventional Commits

This skill helps create commits following the Conventional Commits specification:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Workflow

### Step 1: Check git status
Run `git status` to see all changed, staged, and untracked files.

### Step 2: Analyze changes
For each changed file, determine:
- What type of change is it? (see types below)
- What scope/area does it affect?
- Is it a breaking change?

### Step 3: Determine commit type
Choose the most appropriate type based on the changes:

| Type | When to use |
|------|-------------|
| feat | New feature, new functionality |
| fix | Bug fix |
| docs | Documentation only (README, API docs, comments) |
| style | Code formatting, linter changes (no logic change) |
| refactor | Code change that neither fixes nor adds feature |
| test | Adding or updating tests |
| chore | Build process, dependencies, tooling |
| perf | Performance improvement |
| ci | CI configuration changes |
| build | Build system changes |
| revert | Reverting a previous commit |

### Step 4: Build the commit message

**Format:**
```
<type>[<scope>][!]: <description>
```

Rules:
- Use imperative mood: "add" not "added" or "adds"
- Lowercase for type
- No period at end
- Max 50 chars for description
- If body needed, separate with blank line
- If breaking change, add `!` before `:` or add `BREAKING CHANGE:` in footer

**Examples:**
```
feat(auth): add JWT token refresh mechanism

fix(api): resolve null pointer in user endpoint

docs: update API documentation

feat(api)!: change response format from v1 to v2

BREAKING CHANGE: the API v1 is no longer supported
```

### Step 5: Stage and commit
- Run `git add <files>` to stage relevant files
- Run `git status` to verify staging
- Run `git commit -m "<message>"`

### Edge Cases

- **Multiple types**: Use the dominant type; list others in body if important
- **Breaking changes**: Always prefix with `!` and add BREAKING CHANGE footer
- **Revert commits**: Use `revert: <type>: <description>` and body `This reverts <commit-hash>`
- **Scope naming**: Use lowercase, hyphen-separated (e.g., `auth`, `user-service`, `api-v2`)