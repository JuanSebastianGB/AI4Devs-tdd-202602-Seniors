# Coding Assistant Agent System Design

## System Overview

**System Purpose**: A coding assistant system where a coder agent writes code and a reviewer agent evaluates it, iterating until the code passes review.

**Design Pattern**: Iterative Refinement (Agent → Review → Pass/Fail → Agent → Review → ...)

## Workflow

```
User Request → Coder Agent → Code Output → Reviewer Agent → Pass/Fail → (Iteration Loop)
                                                            ↓
                                                      Final Output
```

---

## Agent Definitions (YAML Frontmatter)

### Coder Agent

```yaml
---
name: coder-agent
description: Writes code based on user requirements
mode: subagent
tools:
  read: true
  write: true
  edit: true
  glob: true
  grep: true
permissions:
  bash: allow
  task: deny
---

You are a coder agent that writes code based on requirements. Your approach:

1. Analyze the incoming task and requirements
2. Write clean, functional code that meets the specifications
3. Include appropriate tests if requested
4. Output the code with clear structure

Input: Requirements/task description
Output: Written code with comments where helpful

When receiving review feedback:
- Address each issue mentioned by the reviewer
- Rewrite the code to fix identified problems
- Preserve working functionality while improving
```

### Reviewer Agent

```yaml
---
name: reviewer-agent
description: Reviews code for quality, correctness, and best practices
mode: subagent
tools:
  read: true
  grep: true
  glob: true
permissions:
  write: deny
  edit: deny
  task: deny
  bash: deny
---

You are a code reviewer agent. Your approach:

1. Analyze the code for correctness and functionality
2. Check for security vulnerabilities
3. Evaluate code quality and best practices
4. Verify test coverage if tests are provided

Quality Criteria:
- Functionality: Code does what it's supposed to do
- Readability: Code is clear and well-structured
- Security: No obvious security issues
- Performance: No obvious performance problems
- Best Practices: Follows language conventions

Input: Code to review
Output: Review feedback with pass/fail decision

Output Format:
```
## Review Result
Status: PASS | FAIL

## Issues Found
[If any]

## Quality Scores (1-10)
- Correctness: X/10
- Readability: X/10
- Security: X/10
- Overall: X/10

## Recommendations
[If any]
```
```

---

## State Management Approach

### State Schema (JSON)

```json
{
  "session_id": "uuid",
  "task_description": "string",
  "iteration_count": 0,
  "max_iterations": 5,
  "current_phase": "coding|reviewing|complete",
  "history": [
    {
      "iteration": 1,
      "coder_output": "code string",
      "reviewer_feedback": "feedback string",
      "quality_scores": {
        "correctness": 7,
        "readability": 8,
        "security": 9,
        "overall": 8
      },
      "status": "FAIL"
    }
  ],
  "final_output": "code string",
  "final_status": "PASS"
}
```

### State Storage

- Use a JSON manifest file (`state.json`) to track session state
- Each iteration appends to the history array
- Quality scores are recorded per iteration
- Session completes when reviewer returns PASS or max_iterations reached

### Iteration Flow

1. **Start**: Initialize state with task and iteration_count = 0
2. **Coding Phase**:
   - Increment iteration_count
   - Coder writes code
   - Update state with coder_output
3. **Review Phase**:
   - Reviewer evaluates code
   - Extract quality scores from review
   - Determine pass/fail (threshold: overall >= 8)
   - Update state with reviewer_feedback and quality_scores
4. **Decision**:
   - If PASS: Mark complete, return final output
   - If FAIL and iteration_count < max_iterations: Loop to coding
   - If FAIL and iteration_count >= max_iterations: Mark complete with last output

---

## Communication Protocol

### Message Format

**Request to Coder**:
```json
{
  "type": "code_request",
  "task": "description",
  "previous_feedback": "optional feedback from previous iteration"
}
```

**Request to Reviewer**:
```json
{
  "type": "review_request",
  "code": "code to review",
  "task": "original task description"
}
```

**Response from Reviewer**:
```json
{
  "type": "review_response",
  "status": "PASS|FAIL",
  "quality_scores": {
    "correctness": 8,
    "readability": 7,
    "security": 9,
    "overall": 8
  },
  "issues": ["issue 1", "issue 2"],
  "recommendations": ["recommendation 1"]
}
```

---

## Error Handling

- **Coder fails**: Return error to user, allow retry
- **Reviewer fails**: Return error to user, allow retry
- **Max iterations reached**: Return best effort with warning
- **Invalid state**: Reset and restart session

---

## Success Metrics

- Pass rate: Percentage of sessions passing on first try
- Average iterations: Mean number of iterations to pass
- Quality scores distribution: Track overall scores over time