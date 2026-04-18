---
name: agent-manager
description: Create, evaluate, and optimize OpenCode agents and subagents. Use when users want to create a new agent or subagent, test its behavior, benchmark performance, or iteratively improve an existing agent. Combines agent creation with evaluation and optimization workflows.
---

# Agent Manager

A skill for creating, evaluating, and optimizing OpenCode agents and subagents in an iterative loop — following the skill-creator pattern.

At a high level, the process works like this:

- Understand what agent the user wants and what it should do
- Draft the agent definition (markdown with YAML frontmatter + system prompt)
- Create test prompts and run the agent on them
- Evaluate results both qualitatively (user feedback) and quantitatively (assertions)
- Improve the agent based on feedback
- Repeat until satisfied
- Optimize the description for better triggering

Your job is to figure out where the user is in this process and help them progress through these stages.

## Understanding OpenCode Agents

OpenCode has two agent types:
- **Primary agents**: Main agents you interact with directly (mode: primary)
- **Subagents**: Specialized assistants invoked by primary agents (mode: subagent)

Agents are configured via markdown files in `.opencode/agents/` (project) or `~/.config/opencode/agents/` (global).

---

## Creating an Agent

### Capture Intent

Start by understanding the user's intent:

1. Agent name (identifier)
2. What should this agent do?
3. When should it trigger? (description)
4. What tools should it have access to?
5. Primary or subagent mode?
6. Any specific model or temperature requirements?

### Agent Structure

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

### Writing the System Prompt

Guidelines:
- Use imperative form ("Do X" not "You should do X")
- Be specific about responsibilities
- Define clear boundaries
- Include examples if helpful
- Keep under 500 lines

### Invocation Patterns

**Manual Invocation (User):** Users invoke subagents with `@`
```
@security-auditor analyze this code
```

**Automatic Invocation (Primary Agents):** Primary agents invoke subagents by mentioning them **without @** in their prompts:
```
Invoke security-auditor to analyze the code for vulnerabilities.
```

The `@` syntax is only for users, not for agents writing to other agents.

---

## Testing and Evaluating Agents

This section follows the skill-creator pattern for running and evaluating test cases.

### Step 1: Define Test Cases

For each agent, create realistic test prompts that exercise its core functionality:
- What tasks is this agent designed to handle?
- What are the critical paths through its workflow?
- What edge cases or failure modes should be tested?

Save test cases to `evals/evals.json`:
```json
{
  "agent_name": "agent-name",
  "evals": [
    {
      "id": 1,
      "prompt": "Task description for the agent",
      "expected_output": "What the agent should produce",
      "files": []
    }
  ]
}
```

### Step 2: Spawn Test Runs

For each test case, spawn a subagent with the appropriate tools. Organize results in `<agent-name>-workspace/` as a sibling to the agent directory. Within the workspace, organize by iteration (`iteration-1/`, `iteration-2/`, etc.) and within that, each test case gets a directory (`eval-0/`, `eval-1/`, etc.).

```bash
Execute this task:
- Agent path: <path-to-agent>
- Task: <eval prompt>
- Input files: <eval files if any, or "none">
- Save outputs to: <workspace>/iteration-<N>/eval-<ID>/
```

### Step 3: Capture Metrics

When each subagent task completes, you receive a notification containing `total_tokens` and `duration_ms`. Save this data to `timing.json` in each run directory:

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

### Step 4: Evaluate Results

Compare actual outputs against expected outputs. Check:
- Did the agent use the correct tools?
- Did it follow the expected workflow?
- Did it produce correct results?
- Were errors handled properly?

Grade each run and save to `grading.json`:

```json
{
  "run_id": "eval-0",
  "assertions": [
    {"text": "description of what was checked", "passed": true, "evidence": "what was found"}
  ]
}
```

### Step 5: Present Results

Create an evaluation report:

```
## Agent Evaluation: [name]

### Test Results
| Test | Status | Notes |
|------|--------|-------|
| 1    | Pass   | ...   |
| 2    | Fail   | ...   |

### Metrics
- Total tests: X
- Passed: X
- Failed: X
- Pass rate: X%
- Avg tokens: X
- Avg time: Xs
```

---

## Improving Agents

Based on test results and user feedback:
- Adjust tools if agent uses wrong ones
- Refine description for better triggering
- Add/remove subagent delegation
- Tune temperature for consistency vs creativity
- Update permissions for security
- Improve the system prompt

### The Iteration Loop

1. Apply improvements to the agent
2. Rerun all test cases into a new `iteration-<N+1>/` directory
3. Present results to the user
4. Read feedback, improve again, repeat

Keep going until:
- The user says they're happy
- The feedback is all empty (everything looks good)
- You're not making meaningful progress

---

## Description Optimization

The description field in the agent's frontmatter is the primary mechanism that determines when OpenCode invokes the agent. After creating or improving an agent, offer to optimize the description for better triggering accuracy.

### Generate Trigger Eval Queries

Create 20 eval queries — a mix of should-trigger and should-not-trigger:

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

Queries should be realistic and substantive. Complex, multi-step, or specialized queries reliably trigger agents.

### Run Optimization Loop

Run the description optimization (similar to skill-creator's approach):
- Split eval set into 60% train, 40% test
- Evaluate current description (run each query 3 times)
- Propose improvements based on failures
- Re-evaluate on both train and test
- Iterate up to 5 times

### Apply the Result

Update the agent's frontmatter with the optimized description.

---

## Best Practices

1. **Make specialists, not generalists** — Agents with focused responsibilities perform better
2. **Use descriptive descriptions** — This is how OpenCode decides when to invoke
3. **Set minimal tools** — Only give tools the agent actually needs
4. **Hide internal subagents** — Use `hidden: true` for subagents only used by other agents
5. **Use appropriate temperature** — 0.0 for deterministic, 0.7+ for creative
6. **Test agents thoroughly** — Run multiple test cases and iterate based on results
7. **Follow the iteration loop** — Create → test → evaluate → improve → repeat

---

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

---

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
├── context/                    # Context files
└── subagents/                 # Additional subagents (optional)
```

Workspace organization:
```
<agent-name>-workspace/
├── iteration-1/
│   ├── eval-0/
│   │   ├── outputs/
│   │   ├── grading.json
│   │   └── timing.json
│   ├── eval-1/
│   │   └── ...
│   └── benchmark.json
├── iteration-2/
│   └── ...
└── feedback.json
```

---

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