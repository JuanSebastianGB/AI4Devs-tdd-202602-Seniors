---
name: opencode-plugin-creator
description: Create and optimize OpenCode plugins with TypeScript. Use when users want to build plugins that hook into events, add custom tools, integrate with external services, or modify OpenCode behavior. Includes plugin structure, event APIs, tooling, authentication providers, shell integration, testing, and deployment patterns.
---

# OpenCode Plugin Creator

A comprehensive skill for creating production-ready OpenCode plugins with TypeScript.

## Overview

OpenCode plugins are JavaScript/TypeScript modules that extend OpenCode by hooking into 25+ events across the AI assistant lifecycle. Plugins can add custom tools, intercept operations, integrate with external services, and customize behavior.

**When to use this skill:**
- Adding custom CLI commands or tools
- Integrating with databases, APIs, or external services
- Intercepting file operations (e.g., .env protection)
- Modifying session compaction behavior
- Adding authentication providers
- Customizing tool execution

## Anatomy of a Plugin

```
my-plugin/
├── package.json
├── src/
│   └── index.ts        # Plugin entry point
├── README.md
└── LICENSE
```

### package.json Structure

```json
{
  "name": "opencode-my-plugin",
  "version": "1.0.0",
  "description": "My custom OpenCode plugin",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@opencode-ai/plugin": "latest",
    "@opencode-ai/sdk": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### Plugin Entry Point

```typescript
import { type Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async (ctx) => {
  return {
    // Hooks go here
  }
}
```

## Context API

The plugin function receives a context object with:

| Property | Description |
|----------|-------------|
| `project` | Current project configuration |
| `client` | SDK client for API calls and logging |
| `$` | Shell execution utility |
| `directory` | Current working directory |
| `worktree` | Current git worktree name |

## Available Events

### Command Events
- `command.executed` - After a command is executed

### File Events
- `file.edited` - After a file is edited
- `file.watcher.updated` - File watcher updates
- `file.read` - When a file is being read
- `file.edit.before` - Before file edit

### Tool Events
- `tool.execute` - Tool execution
- `tool.execute.before` - Before tool execution
- `tool.execute.after` - After tool execution

### Session Events
- `session.start` - Session initialization
- `session.compacting` - Before session compaction
- `experimental.session.compacting` - Session summary generation

### TUI Events
- `tui.prompt.append` - Append to prompt
- `tui.command.execute` - Execute TUI command
- `tui.toast.show` - Show notification

### Permission Events
- `permission.check` - Permission checks

## Creating Custom Tools

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "Description of what mytool does",
        args: {
          arg1: tool.schema.string(),
          arg2: tool.schema.number().optional(),
        },
        async execute(args, context) {
          // Access: context.directory, context.worktree, context.project, context.client
          return `Result: ${args.arg1}`
        },
      }),
    },
  }
}
```

## Event Hook Patterns

### Tool Execution Interception

```typescript
export const ToolInterceptor: Plugin = async (ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      // input: { tool, args }
      // output: modified args
      if (input.tool === "bash") {
        // Sanitize or validate commands
      }
    },
    "tool.execute.after": async (input, output) => {
      // Modify or log results
    },
  }
}
```

### File Protection

```typescript
export const EnvProtection: Plugin = async (ctx) => {
  return {
    "file.read": async (input, output) => {
      if (input.path.endsWith(".env")) {
        throw new Error("Do not read .env files")
      }
    },
  }
}
```

### Session Compaction

```typescript
export const CompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Inject context
      output.context.push(`
## Current Work Status

- Active task: ${/* get from context */ }
- Files modified: ${/* get from context */ }
`)
    },
  }
}
```

## Logging

Use structured logging instead of console.log:

```typescript
export const MyPlugin: Plugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",  // debug, info, warn, error
      message: "Plugin initialized",
      extra: { custom: "data" },
    },
  })
}
```

## Shell Integration

Use `$` for shell commands:

```typescript
export const ShellPlugin: Plugin = async ({ $, directory }) => {
  const result = await $`ls -la ${directory}`
  return {}
}
```

## TypeScript Setup

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### Building

Add build scripts to package.json:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

## Local Development

### Option 1: Plugin Directory

Place in `.opencode/plugins/`:
```
.opencode/plugins/my-plugin.ts
```

Add to opencode.json:
```json
{
  "plugin": ["my-plugin"]
}
```

### Option 2: Project package.json

Create `.opencode/package.json` with dependencies:

```json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

## Publishing Plugins

### Naming Convention

Use `opencode-` prefix:
- `opencode-custom-tools`
- `opencode-database`
- `opencode-aws-deploy`

### Publishing

```bash
npm publish
```

### Installing Published Plugins

```json
{
  "plugin": ["opencode-my-plugin@1.0.0"]
}
```

## Best Practices

1. **Type Safety** - Always use TypeScript and import types from @opencode-ai/plugin
2. **Error Handling** - Wrap hooks in try-catch, use meaningful error messages
3. **Logging** - Use client.app.log for structured logging
4. **Testing** - Test locally in .opencode/plugins/ before publishing
5. **Documentation** - Document custom tools with clear descriptions
6. **Versioning** - Follow SemVer for releases
7. **Dependencies** - Minimize external dependencies

## Common Patterns

### Notification Plugin

```typescript
export const NotificationPlugin: Plugin = async ({ client }) => {
  return {
    "tool.execute.after": async (input, output) => {
      if (input.tool === "bash" && output.result?.includes("error")) {
        await client.app.log({
          body: {
            service: "notification",
            level: "warn",
            message: "Command failed",
          },
        })
      }
    },
  }
}
```

### API Integration

```typescript
import { type Plugin } from "@opencode-ai/plugin"

export const ApiPlugin: Plugin = async ({ client }) => {
  return {
    tool: {
      api-fetch: tool({
        description: "Fetch data from external API",
        args: {
          url: tool.schema.string(),
        },
        async execute(args) {
          const response = await fetch(args.url)
          return await response.json()
        },
      }),
    },
  }
}
```

### Authentication Provider

```typescript
export const AuthProvider: Plugin = async (ctx) => {
  return {
    "permission.check": async (input, output) => {
      // Custom auth logic
      if (input.permission === "write") {
        // Check if user has write access
      }
    },
  }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plugin not loading | Check opencode.json plugin array |
| Type errors | Install @opencode-ai/plugin |
| Dependencies not found | Create .opencode/package.json |
| Tool conflicts | Plugin tools take precedence |

## Directory Structure

For comprehensive plugins:

```
opencode-plugin-name/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts           # Main plugin
│   ├── tools/            # Custom tools
│   │   └── mytool.ts
│   ├── hooks/            # Event handlers
│   │   └── handler.ts
│   └── utils/            # Helper functions
├── test/
│   └── plugin.test.ts
├── README.md
└── LICENSE
```