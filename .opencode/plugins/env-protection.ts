// @ts-nocheck
import { type Plugin, tool } from "@opencode-ai/plugin"

interface FileHookInput {
  path: string
  content?: string
}

interface FileHookOutput {
  content?: string
}

interface CommandInput {
  command: string
  args?: Record<string, unknown>
}

interface CommandOutput {
  warning?: string
}

const ENV_PATTERNS = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.test",
  ".env.staging",
  ".env.example",
  ".env.example.local",
  "env.js",
  "config.ts",
  "config.js",
  "secrets.ts",
  "secrets.js",
  ".aws/credentials",
  ".aws/config",
  "id_rsa",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
  ".npmrc",
  ".pypirc",
]

const SENSITIVE_KEYS = [
  "API_KEY",
  "SECRET",
  "PASSWORD",
  "TOKEN",
  "AUTH",
  "PRIVATE_KEY",
  "CREDENTIAL",
  "DATABASE_URL",
  "DB_PASSWORD",
  "DB_USER",
  "AWS_ACCESS_KEY",
  "AWS_SECRET_KEY",
  "STRIPE_KEY",
  "STRIPE_SECRET",
  "TWILIO",
  "SENDGRID",
  "JWT_SECRET",
  "SESSION_SECRET",
  "ENCRYPTION_KEY",
  "SALT",
  "HMAC",
]

function isEnvFile(filePath: string): boolean {
  const normalized = filePath.toLowerCase()

  for (const pattern of ENV_PATTERNS) {
    if (normalized.includes(pattern.toLowerCase())) {
      return true
    }
  }

  if (normalized.includes("/env.") || normalized.includes("\\env.")) {
    return true
  }

  if (normalized.endsWith(".env") || normalized.endsWith(".env.local")) {
    return true
  }

  return false
}

function containsEnvVariables(content: string): boolean {
  const upperContent = content.toUpperCase()

  for (const key of SENSITIVE_KEYS) {
    if (upperContent.includes(key)) {
      const keyPattern = new RegExp(`${key}\\s*=\\s*`, "i")
      if (keyPattern.test(content)) {
        return true
      }
    }
  }

  const envVarPattern = /process\.env\.[A-Z_]+|export\s+([A-Z_][A-Z0-9_]*)\s*=/g
  if (envVarPattern.test(content)) {
    return true
  }

  return false
}

export const EnvProtectionPlugin: Plugin = async ({ client }) => {
  const warnIfSensitive = async (filePath: string, content: string) => {
    if (isEnvFile(filePath)) {
      await client.app.log({
        body: {
          service: "env-protection",
          level: "error",
          message: `Blocked access to environment file: ${filePath}`,
          extra: { action: "blocked", file: filePath },
        },
      })

      return true
    }

    if (containsEnvVariables(content)) {
      await client.app.log({
        body: {
          service: "env-protection",
          level: "warn",
          message: `Sensitive environment variables detected in: ${filePath}`,
          extra: { warning: "sensitive_content", file: filePath },
        },
      })
    }

    return false
  }

  return {
    tool: {
      "env-scan": tool({
        description: "Scan project for environment files and sensitive variables",
        args: {},
        async execute() {
          return `Scanned for environment files. Use 'grep' tool to search for patterns like 'process.env' or '.env' files.`
        },
      }),
    },

    "file.read": async (input: FileHookInput, output: FileHookOutput) => {
      const filePath = input.path

      if (isEnvFile(filePath)) {
        await client.app.log({
          body: {
            service: "env-protection",
            level: "error",
            message: `Blocked reading environment file: ${filePath}`,
            extra: { action: "blocked_read", file: filePath },
          },
        })

        output.content = "# Environment file access blocked\n# This file may contain sensitive credentials"
        return
      }
    },

    "file.edit": async (input: FileHookInput, output: FileHookOutput) => {
      const filePath = input.path

      if (isEnvFile(filePath)) {
        await client.app.log({
          body: {
            service: "env-protection",
            level: "error",
            message: `Blocked editing environment file: ${filePath}`,
            extra: { action: "blocked_edit", file: filePath },
          },
        })

        throw new Error(
          `Editing environment files is not allowed: ${filePath}.\nThis could expose sensitive credentials.`,
        )
      }

      if (input.content && containsEnvVariables(input.content)) {
        await client.app.log({
          body: {
            service: "env-protection",
            level: "error",
            message: `Blocked writing sensitive variables to: ${filePath}`,
            extra: { action: "blocked_sensitive_write", file: filePath },
          },
        })

        throw new Error(
          `Writing environment variables to non-.env files is not allowed: ${filePath}.\nUse .env files for sensitive data.`,
        )
      }
    },

    "command.executed": async (input: CommandInput, output: CommandOutput) => {
      const command = input.command?.toLowerCase() || ""

      if (command.includes("git push") && !command.includes("--force")) {
        const hasEnvFlag = command.includes("--include") || command.includes("--force")

        if (!hasEnvFlag) {
          output.warning =
            "Warning: Ensure .env files are not included in git. Use .gitignore."
        }
      }

      if (
        command.includes("git add") &&
        (command.includes(".env") || command.includes("env"))
      ) {
        await client.app.log({
          body: {
            service: "env-protection",
            level: "error",
            message: `Blocked adding environment file to git: ${input.args?.file}`,
            extra: { action: "blocked_git_add" },
          },
        })

        throw new Error(
          "Cannot add environment files to git. Check .gitignore for .env entries.",
        )
      }

      if (
        command.includes("docker") &&
        (command.includes(".env") || command.includes("secret"))
      ) {
        await client.app.log({
          body: {
            service: "env-protection",
            level: "warn",
            message: "Warning: Docker may expose environment variables",
            extra: { warning: "docker_env" },
          },
        })
      }
    },
  }
}