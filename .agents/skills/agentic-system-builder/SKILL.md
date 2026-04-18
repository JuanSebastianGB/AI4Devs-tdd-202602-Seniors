---
name: agentic-system-builder
description: Build and optimize multi-agent systems and agentic architectures. Use when users want to create complex agent systems with multiple collaborating agents, design agent workflows, implement tool composition patterns, or build autonomous systems that coordinate multiple specialized agents. This skill triggers for requests involving agent orchestration, multi-agent collaboration, agent pipelines, swarm architectures, and building AI systems that coordinate multiple specialized subagents.
---

You build optimized agentic systems using multi-agent architectures and collaborative patterns.

## Understanding Agentic Systems

Agentic systems are collections of specialized agents that work together to accomplish complex tasks:

- **Orchestrator**: Primary agent that coordinates subagents
- **Specialists**: Subagents with focused domain expertise
- **Communication**: How agents share state and results
- **Tool Composition**: Combining capabilities across agents

## System Design Patterns

### 1. Sequential Pipeline

```
User → Agent A → Agent B → Agent C → Result
```

Each agent passes output to the next. Good for linear workflows.

### 2. Fan-out/Fan-in

```
         → Agent A →
User → Orchestrator → Agent B → Combined Result
         → Agent C →
```

One agent distributes work to multiple, then aggregates results.

### 3. Parallel Specialists

```
User → Orchestrator → [Agent A, Agent B, Agent C] (simultaneous)
```

Multiple agents work on different aspects in parallel.

### 4. Iterative Refinement

```
User → Agent → [Pass/Fail] → Agent → [Pass/Fail] → ...
```

Agent iterates until quality threshold is met.

### 5. Hierarchical Agents

```
                → SubAgent A1
User → Primary → SubAgent A2 → Output
                → SubAgent A3
```

Nested agent groups with different responsibility levels.

## Creating an Agentic System

### Step 1: Analyze the Task

Break down what the system needs to accomplish:
1. What are the discrete subtasks?
2. Which subtasks need specialized agents?
3. How should subtasks be coordinated?
4. What shared state is needed?

### Step 2: Define Agent Roles

For each component:

```
Agent Name: [identifier]
Purpose: [what it does]
Inputs: [what it receives]
Outputs: [what it produces]
Tools: [required capabilities]
```

### Step 3: Design Communication

- **Shared context**: What state do agents share?
- **Message formats**: How do they pass results?
- **Error handling**: How do failures propagate?

### Step 4: Implement the System

Create agents in `.opencode/agents/` following the agent-creator pattern:

```markdown
---
name: orchestrator-name
description: Coordinates the agentic system
mode: primary
tools:
  task: true
  read: true
  write: true
  bash: true
---

You orchestrate [system purpose]. Your approach:

1. Analyze the incoming task
2. Break into subtasks for specialists
3. Delegate to appropriate subagents:
   - [specialist-a]: handles [task type]
   - [specialist-b]: handles [task type]
4. Aggregate results
5. Validate final output

Always explain your reasoning before delegating.
```

For specialists:

```markdown
---
name: specialist-name
description: Handles [specific domain]
mode: subagent
tools:
  read: true
  edit: true
  grep: true
permissions:
  task:
    "*": deny
---

You are a [domain] specialist. Focus on:
- [specific responsibilities]
- [quality criteria]

Output: [expected format]
```

## Tool Composition Patterns

### Sequential Tool Chain

```python
# Agent A uses tool → output → Agent B uses tool
result_a = use_tool_a(input)
result_b = use_tool_b(result_a)
```

### Parallel Tool Execution

```python
# Multiple tools run simultaneously
results = await gather(
    use_tool_a(input),
    use_tool_b(input),
    use_tool_c(input)
)
```

### Tool Routing

```python
# Route based on input characteristics
if input.type == "code":
    return code_agent.process(input)
elif input.type == "text":
    return text_agent.process(input)
```

### Tool Ensemble

```python
# Multiple tools vote/compare
results = [tool_a(input), tool_b(input), tool_c(input)]
final = consensus(results)
```

## State Management

### Shared State Options

1. **Manifest files**: JSON/YAML files tracking system state
2. **Context passing**: Pass state through agent invocations
3. **Database**: For persistent state across sessions
4. **Memory agents**: Specialized agents for context retention

### State Schema Example

```json
{
  "task_id": "uuid",
  "phase": "extraction|processing|validation",
  "agents": {
    "orchestrator": {"status": "running", "last_action": "..."},
    "specialist_a": {"status": "waiting", "last_output": "..."}
  },
  "shared_data": {
    "extracted": [],
    "processed": [],
    "validated": []
  }
}
```

## Error Handling

### Retry Patterns

- Exponential backoff for transient failures
- Max retries before escalating
- Circuit breaker for persistent failures

### Fallback Strategies

- Primary agent fails → fallback agent
- Tool fails → alternative tool
- Timeout → partial results + warning

### Error Propagation

- Agents report errors to orchestrator
- Orchestrator decides: retry, fallback, or abort
- Clear error messages with context

## Testing Agentic Systems

### Unit Tests per Agent

Test each agent individually:
- Input/output contracts
- Tool usage correctness
- Error handling

### Integration Tests

Test agent interactions:
- Communication protocols
- State sharing
- Error propagation

### End-to-End Tests

Test the full system:
- Complete workflows
- Edge cases
- Performance under load

### Test Patterns

```python
# Mock subagent responses
@pytest.fixture
def mock_specialist():
    return MockAgent(output={"result": "expected"})

# Test orchestrator delegation
def test_orchestrator_delegates_correctly():
    result = orchestrator.process(input)
    assert mock_specialist.called
    assert result == expected_output
```

## Optimization Strategies

### Performance

- Reduce unnecessary delegation
- Cache shared computations
- Parallelize where possible
- Minimize context size

### Quality

- Add validation agents
- Implement reflection loops
- Use voting/ensemble for critical decisions
- Track success rates per agent

### Reliability

- Add retry logic
- Implement timeouts
- Log extensively
- Monitor health metrics

## Best Practices

1. **Single responsibility** — Each agent does one thing well
2. **Clear interfaces** — Define input/output contracts
3. **Minimal tools** — Give agents only what they need
4. **Explicit communication** — Don't rely on implicit state
5. **Handle failures** — Plan for what goes wrong
6. **Iterate** — Test, measure, improve

## Real-World Patterns

### RAG Pipeline

```
User Query → Router Agent → [Retriever Agent → Ranker Agent → Synthesizer Agent] → Final Answer
```

### Code Analysis System

```
Code Input → Parser Agent → [Security Agent, Performance Agent, Quality Agent] → Report Agent → Combined Report
```

### Data Pipeline

```
Raw Data → Extractor Agent → Transformer Agent → Validator Agent → Storage Agent → Confirmation
```

## Implementation Checklist

- [ ] Define system purpose and scope
- [ ] Identify required subagents
- [ ] Design communication protocols
- [ ] Create orchestrator agent
- [ ] Create specialist agents
- [ ] Implement state management
- [ ] Add error handling
- [ ] Write tests
- [ ] Benchmark performance
- [ ] Optimize based on results