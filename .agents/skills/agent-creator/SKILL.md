---
name: agent-creator
description: >
  Shape how Cursor Agent behaves in a repo: project rules (.cursor/rules), AGENTS.md / CLAUDE.md, and optional skills (SKILL.md).
  Use whenever the user mentions custom agents, Agent behavior, .cursor/rules, rule frontmatter, /create-rule, New Cursor Rule,
  AGENTS.md, CLAUDE.md, "project instructions", onboarding the AI to a codebase, User Rules, migrating from .cursorrules,
  or consistent Agent behavior across teammates or CI (Cursor CLI uses the same rules and AGENTS.md / CLAUDE.md).
---

# Agent creator

Help users **define Cursor Agent behavior** using what Cursor actually loads:

1. **Rules** — `.cursor/rules/` (often `.mdc`), version-controlled project instructions.
2. **`AGENTS.md` / `CLAUDE.md`** — plain markdown, root and/or nested; simple alternative to structured rules.
3. **Skills** — `SKILL.md` with frontmatter, loaded when relevant or via `/` in the agent input.

Copy-paste templates and longer examples: `references/cursor-customization-reference.md`.

## Why this matters

Agent follows **repo instructions** (plus user settings). Clear, scoped files beat one giant prompt: less noise, fewer repeated mistakes, easier review in PRs.

---

## Layers of customization

Cursor’s mental model ([Customizing agents](https://cursor.com/learn/customizing-agents)): **rules** and **`AGENTS.md`** behave like “always relevant context”; **skills** behave like **specialized, on-demand** playbooks.

| Layer | What it is | When it loads |
| --- | --- | --- |
| **Rules** | Markdown under `.cursor/rules/` (often `.mdc` + YAML frontmatter) | Per [Rules](https://cursor.com/docs/rules) — always, glob-scoped, or when the description matches |
| **`AGENTS.md` / `CLAUDE.md`** | Plain markdown | Project instructions; **nested** files combine with parents, **more specific wins** |
| **Skills** | `SKILL.md` (`name`, `description`, …) | Dynamically when relevant ([Skills](https://cursor.com/docs/skills)); optional `/` invocation |

### `AGENTS.md` and `CLAUDE.md`

- Root **`AGENTS.md`** for simple, readable defaults without rule metadata.
- **`CLAUDE.md`** for the same content when the repo is shared with Claude Code ([Rules](https://cursor.com/docs/rules)).
- **`AGENTS.md` in subfolders** for package- or area-specific guidance; deeper path overrides where they overlap.

### Project rules (`.cursor/rules`)

- **Create:** `/create-rule` in chat, **Cursor Settings → Rules, Commands → Add Rule**, or Command Palette **“New Cursor Rule”** (UI names can change slightly — use in-app help if needed).
- **Keep rules small:** non-obvious build/test commands, conventions the model gets wrong, pointers to canonical files. Prefer linters for style; don’t paste full style guides.

### Skills

- **`description`** should state what the skill does **and when to use it** — that drives discovery without overload (same principle as the skill-creator skill).

### Cursor CLI

The [CLI agent](https://cursor.com/docs/cli/using) uses the **same** `.cursor/rules`, **`AGENTS.md`**, and **`CLAUDE.md`** as the IDE so automation and chat stay aligned.

---

## Workflow before editing files

1. **Persistence:** always-on (rule / `AGENTS.md`) vs occasional workflow (skill)?
2. **Scope:** whole repo, subtree (nested `AGENTS.md` or globs), or one concern per file?
3. **Constraints:** required commands, paths not to touch, review expectations.
4. **Check:** one real task after changes (build, test, or refactor) to see if Agent follows instructions.

Ship the **smallest** change that fixes the gap.

---

## Writing effective instructions

- Imperative, concrete bullets; reference real paths and one good example in-repo.
- Explain **why** when it’s not obvious — works better than long MUST lists.
- For description-driven rules, write a **specific** `description` so Agent applies them in the right threads only.

---

## After you ship

- Re-run a representative task; watch for ignored constraints or wrong tooling.
- Split bloated rules; move deep or rare procedures into a **skill** or a nested **`AGENTS.md`**.

---

## Where to read more

- [Rules](https://cursor.com/docs/rules), [Skills](https://cursor.com/docs/skills), [Customizing agents](https://cursor.com/learn/customizing-agents), [CLI + rules](https://cursor.com/docs/cli/using)
- Templates: `references/cursor-customization-reference.md`
