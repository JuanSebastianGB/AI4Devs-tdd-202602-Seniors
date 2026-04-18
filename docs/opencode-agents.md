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

## Related

- Use the `agent-creator` skill for guided agent creation
- See existing examples in `.opencode/agents/`