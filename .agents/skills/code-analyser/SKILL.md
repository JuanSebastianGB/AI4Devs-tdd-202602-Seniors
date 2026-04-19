---
name: code-analyzer
description: Analyzes code, identifies patterns, problems, and improvement opportunities. Use this skill whenever the user mentions code review, analyzing codebase, technical debt, code quality, architecture issues, code smells, design patterns, security vulnerabilities, performance problems, or asks to "look at" or "review" code. This skill is essential for ANY task involving examining existing code for issues, refactoring, or understanding a codebase's structure. Always use this skill proactively when code analysis would help, even if the user doesn't explicitly ask for a "full analysis."
---

# Code Analyzer

Analyzes code to identify problems, patterns, and improvement opportunities with actionable findings.

## When to Use This Skill

- User asks for code review or analysis
- User mentions technical debt, code smells, or architecture issues
- User wants to understand a codebase structure
- User asks to identify performance or security problems
- User mentions refactoring or improving existing code
- Any task involving examining code for issues

## Analysis Checklist

Run through these areas systematically:

### 1. Code Quality
- [ ] Function lengths (warn if >50 lines, flag if >100)
- [ ] File sizes (warn if >300 lines, flag if >500)
- [ ] Duplicate code (exact matches or very similar blocks)
- [ ] Variable/function naming clarity (too short, too generic, misleading)
- [ ] Comment quality (outdated, missing, or obvious)
- [ ] Cyclomatic complexity per function

### 2. SOLID & Patterns
- [ ] Single Responsibility - does each component do one thing?
- [ ] Open/Closed - is code extensible without modification?
- [ ] Liskov Substitution - are subclasses proper substitutes?
- [ ] Interface Segregation - are interfaces minimal?
- [ ] Dependency Inversion - depend on abstractions not concretions?
- [ ] Common patterns: Factory, Strategy, Repository, Observer
- [ ] Anti-patterns: God objects, Circular dependencies, Shotgun surgery

### 3. Architecture
- [ ] Separation of concerns (UI, business logic, data access)
- [ ] Module/coupling cohesion
- [ ] Circular dependencies
- [ ] Layering violations
- [ ] Missing abstractions

### 4. Performance
- [ ] N+1 query patterns
- [ ] Inefficient loops or array operations
- [ ] Missing memoization/caching
- [ ] Memory leaks (unclosed resources, growing state)
- [ ] Expensive operations in hot paths

### 5. Security
- [ ] Input validation
- [ ] SQL injection vectors
- [ ] XSS vulnerabilities
- [ ] Sensitive data exposure (logs, errors, responses)
- [ ] Authentication/authorization gaps

## Process

1. **Discover**: Use glob/grep to find relevant files
2. **Map**: Understand project structure first
3. **Sample**: Read key files to understand patterns
4. **Scan**: Run through checklist systematically
5. **Prioritize**: Rank issues by severity + effort
6. **Report**: Generate structured findings

## Tools to Use

- `glob` - Find files by pattern
- `grep` - Search code content
- `read` - Examine specific files
- `lsp` - Find definitions, references, symbols

## Report Template

ALWAYS use this exact structure:

```markdown
# Code Analysis Report: [Project/Component Name]

## Executive Summary
[2-3 sentences on overall state and top 3 issues]

## Critical Issues (Fix Immediately)
| Issue | Location | Severity | Recommendation |
|-------|----------|----------|--------------|
| [Describe] | [file:line] | HIGH | [Fix suggestion] |

## Warnings (Fix Soon)
| Issue | Location | Severity | Recommendation |
|-------|----------|----------|--------------|
| [Describe] | [file:line] | MEDIUM | [Fix suggestion] |

## Suggestions (When Time Permits)
| Issue | Location | Effort | Recommendation |
|-------|---------|--------|--------------|
| [Describe] | [file:line] | LOW | [Fix suggestion] |

## Architecture Overview
[How the codebase is structured]

## Positive Findings
[What's working well]
```

## Severity Guidelines

- **HIGH**: Security vulnerability, data loss risk, system crash potential
- **MEDIUM**: Performance impact, maintainability burden, bugs waiting to happen
- **LOW**: Style issues, minor inefficiencies, future tech debt

## Confidence Guidelines

Be conservative - only flag issues you're confident about. If uncertain:
- Note it as "potential" or "investigate further"
- Don't inflate severity
- Suggest verification steps