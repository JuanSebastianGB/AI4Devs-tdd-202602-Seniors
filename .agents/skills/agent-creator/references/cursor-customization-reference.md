# Cursor: rules, AGENTS.md, and skills (reference)

Copy-paste starters. Exact frontmatter keys and rule types follow [Rules](https://cursor.com/docs/rules); verify in-app if Cursor updates the schema.

## Project rule (`.cursor/rules/*.mdc`)

Rules are usually **`.mdc`** files with YAML frontmatter. How they apply (always, by glob, or “when the description fits”) is configured in the rule — see docs for current options.

Minimal pattern:

```text
---
description: When the user works on API routes — REST patterns, validation, and errors for this repo.
globs:
  - "src/app/api/**/*.ts"
alwaysApply: false
---

## Conventions

- Follow existing handlers under `src/app/api/` for auth and error shape.
- Run `pnpm test` after changing route behavior.
```

**Agent-selected style** (broad description, no glob): rely on a strong `description` so Agent includes the rule in the right chats; keep the body short.

```text
---
description: Use when discussing database migrations, Prisma schema, or SQL for this project.
alwaysApply: false
---

- Migrations live in `prisma/migrations/`. Never edit applied migration SQL.
- After schema changes: `pnpm prisma migrate dev` (or the team’s documented command).
```

## `AGENTS.md` (plain markdown)

No frontmatter. Good for repo-wide or folder-specific instructions. Nested files under subdirectories **merge** with parents; more specific path **wins** for overlapping guidance.

Root example:

```markdown
# Agent instructions

## Commands

- Package manager: `pnpm` only.
- Test: `pnpm test` from repo root.

## Scope

- Prefer small, reviewable changes.
- Do not commit secrets or `.env` contents.
```

Subfolder example (`frontend/AGENTS.md`):

```markdown
# Frontend

- Stack: see `frontend/package.json`.
- Match patterns in `src/components/` for new UI.
```

## `CLAUDE.md`

Same usage as `AGENTS.md` for teams that also use Claude Code; Cursor reads it the same way ([Rules](https://cursor.com/docs/rules)).

## Skills (`SKILL.md`)

Skills use frontmatter (`name`, `description`, …). Full format: [Skills](https://cursor.com/docs/skills). Place skills where your project or tooling expects them (often under a skills directory with `SKILL.md` per skill).

## User-level rules (optional)

Private or personal rules can live under **`.cursor/rules/` in the user home directory** so they apply across projects — use sparingly to avoid surprise behavior. Prefer project-local rules checked into git for team alignment.

## CLI

The [Cursor CLI agent](https://cursor.com/docs/cli/using) reads **`.cursor/rules`**, **`AGENTS.md`**, and **`CLAUDE.md`** at the project root with the editor, so CI and IDE stay consistent when instructions live in the repo.
