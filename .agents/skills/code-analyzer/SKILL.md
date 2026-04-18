---
name: code-analyzer
description: Analyzes code, identifies patterns, problems, and improvement opportunities. Use this skill when you need to do code review, analyze architecture, or identify technical debt.
---

# Code Analyzer

Analyzes code to identify problems, patterns, and improvement opportunities.

## Analysis Areas

### 1. Code Quality
- Cyclomatic complexity
- Code duplication
- Descriptive names
- Function/file sizes

### 2. Patterns
- SOLID principles
- Design patterns used
- Anti-patterns

### 3. Architecture
- Separation of concerns
- Module coupling
- Circular dependencies

### 4. Performance
- N+1 queries
- Memory leaks
- Expensive functions

### 5. Security
- Input validation
- SQL injection
- Sensitive data exposure

## Process

1. Read relevant files
2. Run static analysis if available
3. Identify problems
4. Generate report with prioritization

## Output

Report with:
- Issues found
- Severity (high/medium/low)
- File and line
- Improvement suggestion