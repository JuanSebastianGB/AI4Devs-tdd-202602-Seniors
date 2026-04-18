# OpenCode Agents and Subagents

## Overview

OpenCode supports two types of agents:
- **Primary agents**: Main agents you interact with directly
- **Subagents**: Specialized assistants invoked by primary agents

## Directory Structure

Agents are defined in:
- Project: `.opencode/agents/`
- Global: `~/.config/opencode/agents/`

## Creating an Agent

### Using the Command

```bash
opencode agent create
```

This interactive command will guide you through:
1. Save location (global or project)
2. Agent description
3. System prompt generation
4. Tool selection

### Manual Creation

Create a markdown file with YAML frontmatter:

```markdown
---
name: agent-name
description: What the agent does and when to use it
mode: primary | subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  read: true
  write: false
  edit: true
  bash: false
permissions:
  skill:
    "*": deny
  task:
    "*": deny
    "explore": allow
---

Your system prompt here.
```

## Agent Configuration

| Field | Description |
|-------|-------------|
| `name` | Agent identifier |
| `description` | When to trigger (primary triggering mechanism) |
| `mode` | `primary` or `subagent` |
| `model` | Optional specific model |
| `temperature` | 0.0 (deterministic) to 1.0 (creative) |
| `tools` | Enable/disable specific tools |
| `permissions` | Granular permission control |
| `hidden` | Hide from @ autocomplete |

## Tools Available

- `read`, `write`, `edit`, `grep`, `glob`
- `bash`, `patch`, `task`, `question`
- `webfetch`, `websearch`, `codesearch`
- `lsp`, `skill`

## Permissions Format

```yaml
permissions:
  skill:
    "*": deny | allow
    "specific-skill": allow
  task:
    "*": deny | allow
    "specific-agent": allow
  bash:
    "*": deny | allow
    "git*": allow
    "pnpm*": allow
```

## Invocation Patterns

### Manual (User)
```
@subagent-name task description
```

### Automatic (Primary Agent)
In the primary agent's system prompt, mention subagent **without @**:
```
Invoke the security-auditor to analyze this code.
```

## Examples

### Test Runner Subagent
File: `.opencode/agents/test-runner.md`
```markdown
---
description: Run unit tests and attempt fixes
mode: subagent
temperature: 0.1
tools:
  question: false
permissions:
  skill:
    "*": deny
  task:
    "*": deny
    "explore": allow
  bash:
    "*": allow
---

Run unit tests with pnpm test. Try to fix issues. If tests pass, report success.
```

### Code Reviewer Subagent
```markdown
---
description: Reviews code for quality and best practices
mode: subagent
tools:
  write: false
  edit: false
  bash: true
permissions:
  skill:
    "*": deny
  task:
    "*": deny
    "explore": allow
  bash:
    "*": deny
    "git diff*": allow
    "git log*": allow
    "git status*": allow
---

Focus on code quality, potential bugs, and best practices.
Output format:
- Issue name
- Priority (high/medium/low)
- Description
- Potential fix
```

## Best Practices

1. **Make specialists** - Focused agents perform better than generalists
2. **Use descriptive descriptions** - This triggers automatic invocation
3. **Set minimal tools** - Only give tools actually needed
4. **Hide internal subagents** - Use `hidden: true`
5. **Test agents** - Validate behavior after creation

## OpenCode Plugins

Plugins extend OpenCode with custom tools, event hooks, and external integrations.

### Directory Structure

Plugins are loaded from:
- Project: `.opencode/plugins/`
- Global: `~/.config/opencode/plugins/`

### Plugin Structure

```typescript
// .opencode/plugins/my-plugin.ts
import { type Plugin, tool } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async (ctx) => {
  return {
    // Custom tools
    tool: {
      mytool: tool({
        description: "Does something useful",
        args: {
          param: tool.schema.string(),
        },
        async execute(args, context) {
          return `Result: ${args.param}`
        },
      }),
    },
    // Event hooks
    "tool.execute.before": async (input, output) => {
      // Intercept tool execution
    },
  }
}
```

### Events Available

| Category | Events |
|----------|--------|
| Command | `command.executed` |
| File | `file.read`, `file.edit.before`, `file.edited` |
| Tool | `tool.execute`, `tool.execute.before`, `tool.execute.after` |
| Session | `session.start`, `experimental.session.compacting` |
| TUI | `tui.prompt.append`, `tui.toast.show` |

### Configuration

Add to `opencode.json`:
```json
{
  "plugin": ["my-plugin", "@organization/opencode-plugin"]
}
```

For local dependencies, create `.opencode/package.json`:
```json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

### Publishing

Name with `opencode-` prefix:
```json
{
  "name": "opencode-my-plugin",
  "version": "1.0.0"
}
```

### Project Plugins

#### TypeScript Linter Plugin

File: `.opencode/plugins/ts-linter.ts`

Provides auto-fix capabilities for TypeScript files:

- **ts-lint**: Run linter on files with optional auto-fix
- **ts-lint-file**: Lint specific file and report errors
- **ts-lint-project**: Full project lint with error report
- **Auto-run**: Runs after file writes/edits to auto-fix errors

Uses TypeScript compiler (tsc) and ESLint for validation and auto-fix.

#### Environment Protection Plugin

File: `.opencode/plugins/env-protection.ts`

Prevents exposing sensitive credentials:

- **Blocked files**: .env, .env.local, .env.production, .env.example, config.ts with secrets
- **Blocked operations**: Reading .env files, editing sensitive files
- **Git protection**: Prevents git add on .env files
- **Git push warning**: Warns if env files might be pushed
- **Sensitive content detection**: Warns when writing env variables to non-.env files

Monitors for: API_KEY, SECRET, PASSWORD, TOKEN, DATABASE_URL, AWS credentials, JWT_SECRET, etc.

## Related

- Use the `agent-creator` skill for guided agent creation
- Use the `opencode-plugin-creator` skill for plugin development
- See existing examples in `.opencode/agents/`