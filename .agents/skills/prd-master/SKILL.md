---
name: prd-master
description: Analyzes existing Brownfield codebase to generate an optimized PRD (Product Requirements Document) for agent execution. This skill serves as the "North Star" for future implementation sessions, extracting business logic, identifying undocumented rules, and providing actionable guidance for agents. Use this skill whenever the user wants to analyze a Brownfield project, understand existing code, extract business logic, or create a PRD.
---

# prd-master - Product Requirements Document Generator for Brownfield Projects

## Instructions

### 1. Initial Analysis: Business Logic Harvest
- Perform a comprehensive scan of the codebase to extract business logic
- Identify domain models, business rules, validation logic, and workflows
- Map all data flows between components
- Document any undocumented rules discovered during analysis

### 2. Impact Analysis Table
Generate a mandatory impact table covering:

| Category | Affected Components | Risk Level | Notes |
|----------|---------------------|------------|-------|
| Requirements | List all affected functional requirements | High/Medium/Low | Brief description |
| Architecture | Architecture components requiring changes | High/Medium/Low | Brief description |
| QA/Regression | Testing areas affected | High/Medium/Low | Brief description |
| Technical Debt | Detected technical debt items | High/Medium/Low | Brief description |

### 3. Acceptance Criteria
Write atomic acceptance criteria in bullet point format following:
- Given/When/Then implicit structure
- One assertion per criterion
- Must be verifiable by a testing agent

Format:
- [ ] Criterion description with clear pass/fail condition

### 4. Non-Functional Requirements
Include mandatory sections based on Red Hat standards:

#### Security
- Authentication and authorization requirements
- Input validation and sanitization
- Data protection measures
- API security patterns

#### Observability
- Logging requirements
- Monitoring and metrics
- Tracing and debugging capabilities
- Health check endpoints

#### Maintainability
- Code quality standards
- Documentation requirements
- Configuration management
- Deployment procedures

### 5. Conflict Detection and Clarification
If conflicts are detected between user requests and existing code:
1. DO NOT apply vibe-coding
2. STOP and list specific questions
3. Wait for user clarification before proceeding

### 6. Output Format
Deliver the document in structured Markdown with these sections (ALL IN ENGLISH):

```markdown
# PRD: [Project Name]

## 1. Current State
### 1.1 Existing Code Analysis
### 1.2 Documented Business Rules
### 1.3 Undocumented Business Rules Detected
### 1.4 Technical Debt Identified

## 2. Impact Analysis
### 2.1 Impact Table
### 2.2 Affected Components

## 3. Functional Requirements
### 3.1 Atomic Acceptance Criteria

## 4. Non-Functional Requirements
### 4.1 Security
### 4.2 Observability
### 4.3 Maintainability

## 5. Roadmap
### 5.1 Implementation Phases
### 5.2 Dependencies

## 6. Notes for Agent
```

## Usage Notes

- This skill should be loaded when analyzing Brownfield projects
- Always verify findings against actual code before documenting
- Prioritize atomic, testable acceptance criteria
- Flag any assumptions clearly
- Output ALL content in English
- When conflicts are found, stop and ask questions in English