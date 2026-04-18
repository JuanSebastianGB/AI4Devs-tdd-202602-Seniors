---
title: "Coding Assistant Agent System"
description: "Iterative coder-reviewer agent system with state management"
agents:
  coder:
    role: "Code Writer Agent"
    triggers:
      - "write code"
      - "implement"
      - "build"
    temperature: 0.7
    tools:
      - write
      - edit
      - glob
      - read
    permissions:
      - write:all
      - read:all
  reviewer:
    role: "Code Reviewer Agent"
    triggers:
      - "review"
      - "approve"
      - "check code"
    temperature: 0.3
    tools:
      - read
      - grep
      - lsp
    permissions:
      - read:all
      - lsp:all
state_management:
  approach: "Shared State File"
  storage: "JSON state file"
  fields:
    - iteration_count
    - quality_scores:array
    - current_status
    - review_history:array
  workflow:
    - "1. Coder writes initial code and increments iteration_count"
    - "2. Reviewer evaluates and assigns quality_score"
    - "3. If score >= threshold, status = approved"
    - "4. Otherwise, status = needs_revision → return to coder"
    - "5. Maximum iterations: 5"
---

# Agent System Design

## Overview

This system implements an iterative coding workflow where:
1. **Coder Agent** writes and modifies code
2. **Reviewer Agent** evaluates code quality and provides feedback
3. The system iterates until the reviewer approves the code or max iterations reached

## Coder Agent

| Property | Value |
|----------|-------|
| Role | Code Writer |
| Primary Tool | write, edit |
| Temperature | 0.7 (creative) |
| Mode | Primary |

**Responsibilities:**
- Write initial code implementations
- Address feedback from reviewer
- Modify code based on review comments

## Reviewer Agent

| Property | Value |
|----------|-------|
| Role | Code Reviewer |
| Primary Tool | read, lsp, grep |
| Temperature | 0.3 (analytical) |
| Mode | Subagent |

**Responsibilities:**
- Evaluate code correctness via LSP
- Assess code quality and style
- Provide actionable feedback

## State Management

```json
{
  "iteration_count": 0,
  "quality_scores": [],
  "current_status": "pending",
  "review_history": [],
  "max_iterations": 5,
  "quality_threshold": 8.0
}
```

### State Transitions

| Status | Transition |
|--------|------------|
| pending | → coder writes code → in_review |
| in_review | → reviewer scores → approved/needs_revision |
| approved | → done |
| needs_revision | → pending (increment iteration) |

### Quality Score Criteria

1. **Correctness** (0-10): LSP analysis passes, no errors
2. **Readability** (0-10): Code style consistent
3. **Completeness** (0-10): All requirements met
4. **Efficiency** (0-10): Optimal algorithms used
5. **Documentation** (0-10): Comments and docs present

**Final Score** = Average of all criteria. Pass threshold = 8.0