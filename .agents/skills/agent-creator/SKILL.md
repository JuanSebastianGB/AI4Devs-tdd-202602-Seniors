---
name: agent-creator
description: Create and optimize OpenCode agents and subagents. Use when users want to create, modify, or improve agents/subagents in their OpenCode projects, including defining permissions, tools, mode (primary/subagent), temperature, and invocation patterns.
---

# Agent Creator

A skill for creating and optimizing OpenCode agents and subagents.

## Understanding OpenCode Agents

OpenCode has two agent types:
- **Primary agents**: Main agents you interact with directly (mode: primary)
- **Subagents**: Specialized assistants invoked by primary agents (mode: subagent)

Agents are configured via markdown files in `.opencode/agents/` (project) or `~/.config/opencode/agents/` (global).

## Creating an Agent

### Step 1: Interview the User

Collect:
1. Agent name (identifier)
2. What should this agent do?
3. When should it trigger? (description)
4. What tools should it have access to?
5. Primary or subagent mode?
6. Any specific model or temperature requirements?

### Step 2: Agent Structure

Create a markdown file with YAML frontmatter:

```markdown
---
name: agent-name
description: Clear description of what the agent does and when to use it
mode: primary | subagent
model: anthropic/claude-sonnet-4-20250514 (optional, defaults to configured model)
temperature: 0.1 (optional, 0.0-1.0)
tools:
  read: true | false
  write: true | false
  edit: true | false
  bash: true | false
  grep: true | false
  glob: true | false
  patch: true | false
  task: true | false
  question: true | false
  webfetch: true | false
  websearch: true | false
  codesearch: true | false
  lsp: true | false
  skill: true | false
permissions:
  skill:
    "*": deny | allow
    "skill-name": allow
  task:
    "*": deny | allow
    "explore": allow
  bash:
    "*": deny | allow
    "git*": allow
    "pnpm*": allow
hidden: true | false (hide from @ autocomplete)
---

Your agent system prompt here. Use imperative form. Focus on what the agent should do, not how to document it.
```

### Step 3: Write the System Prompt

Guidelines:
- Use imperative form ("Do X" not "You should do X")
- Be specific about responsibilities
- Define clear boundaries
- Include examples if helpful
- Keep under 500 lines

Example system prompts:

**Subagent (specialized task):**
```markdown
You are a code reviewer. Focus on:
- Security vulnerabilities
- Performance issues
- Code quality
- Best practices

Review the provided code and output findings in this format:
- Issue: [description]
- Severity: [high/medium/low]
- Location: [file:line]
- Fix: [suggestion]
```

**Primary agent (orchestrator):**
```markdown
You coordinate the development workflow. Your approach:
1. Understand the task fully
2. Break into subtasks
3. Delegate to specialized subagents:
   - Use coder-agent for implementation
   - Use tester-agent for test creation
   - Use reviewer-agent for code review
4. Validate results before responding

Always explain your reasoning before taking action.
```

## Invocation Patterns

### Manual Invocation (User)
Users invoke subagents with `@`:
```
@security-auditor analyze this code
```

### Automatic Invocation (Primary Agents)
Primary agents invoke subagents by mentioning them **without @** in their prompts:

**Correct ✅**
```
Invoke security-auditor to analyze the code for vulnerabilities.
```

**Incorrect ❌**
```
@security-auditor analyze the code for vulnerabilities.
```

The `@` syntax is only for users, not for agents writing to other agents.

## Tool Configuration

### Tools (allow/disallow specific tools)
```yaml
tools:
  read: true
  write: false
  edit: true
  bash: false
```

### Permissions (granular control)
```yaml
permissions:
  skill:
    "*": deny
    "context7-mcp": allow
  task:
    "*": deny
    "explore": allow
  bash:
    "*": deny
    "git diff*": allow
    "git log*": allow
    "pnpm*": allow
```

Use glob patterns for bash commands.

## Best Practices

1. **Make specialists, not generalists** - Agents with focused responsibilities perform better
2. **Use descriptive descriptions** - This is how OpenCode decides when to invoke
3. **Set minimal tools** - Only give tools the agent actually needs
4. **Hide internal subagents** - Use `hidden: true` for subagents only used by other agents
5. **Use appropriate temperature** - 0.0 for deterministic, 0.7+ for creative
6. **Test agents** - Run test tasks to validate behavior

## Testing Agents

After creating an agent:
1. Invoke it with a relevant task
2. Verify it uses the right tools
3. Check output quality
4. Adjust tools/permissions if needed

## Agent Examples

### Test Runner Subagent
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
description: Reviews code for quality, patterns, and best practices
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

Focus on:
- Code quality and test practices
- Potential bugs and edge cases
- Performance implications

Output format:
- Issue name
- Priority (high/medium/low)
- Description
- Potential fix
```

### Workflow Orchestrator (Primary)
```markdown
---
name: workflow-orchestrator
description: Orchestrates document conversion pipeline
mode: primary
tools:
  read: true
  write: true
  bash: true
  task: true
---

You coordinate the pipeline with these phases:
1. Pre-flight: Check required tools (mmdc, pandoc)
2. Extract: Delegate to mermaid-extractor
3. Generate: Delegate to image-generator
4. Rebuild: Delegate to markdown-rebuilder
5. Convert: Delegate to pandoc-converter
6. Validate: Delegate to pipeline-validator

Maintain a manifest (logs/pipeline_manifest.json) tracking each phase.
```

## Interactive Creation

Use the built-in command:
```bash
opencode agent create
```

This interactive command will:
1. Ask where to save (global or project)
2. Ask for description
3. Generate system prompt and identifier
4. Let you select tools
5. Create the markdown file

## Optimizing Agents

Based on test results:
- Adjust tools if agent uses wrong ones
- Refine description for better triggering
- Add/remove subagent delegation
- Tune temperature for consistency vs creativity
- Update permissions for security

## Directory Structure

Recommended project structure:
```
.opencode/
├── agents/
│   ├── workflow-orchestrator.md  # Primary agent
│   ├── test-runner.md            # Subagent
│   ├── review.md                 # Subagent
│   └── security-auditor.md      # Subagent
├── command/                     # Slash commands
├── context/                     # Context files
└── subagents/                   # Additional subagents (optional)
```