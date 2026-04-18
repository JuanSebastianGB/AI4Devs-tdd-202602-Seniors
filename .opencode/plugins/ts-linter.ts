// @ts-nocheck
import { type Plugin, tool } from "@opencode-ai/plugin"

interface LintResult {
  file: string
  errors: number
  warnings: number
  fixed: number
}

interface ToolHookInput {
  tool: string
  args: Record<string, unknown>
}

interface ToolHookOutput {
  result?: string
}

export const TSLinterPlugin: Plugin = async ({ client, $, directory }) => {
  const runLinter = async (args: {
    files?: string[]
    fix?: boolean
    format?: boolean
  }): Promise<string> => {
    const files = args.files || ["*.ts", "*.tsx"]
    const fix = args.fix ?? true
    const format = args.format ?? true

    const commands: string[] = []

    if (format) {
      commands.push(`pnpm exec prettier --write ${files.join(" ")} 2>/dev/null || true`)
    }

    commands.push(`pnpm exec tsc --noEmit 2>&1`)

    if (fix) {
      commands.push(`pnpm exec eslint --fix ${files.join(" ")} 2>&1 || true`)
    }

    const combinedCmd = commands.join(" && ")
    const result = await $`${combinedCmd}`

    return result.stdout || result.stderr || "No errors found"
  }

  const lintFile = async (filePath: string, fix: boolean = true): Promise<LintResult> => {
    const result: LintResult = {
      file: filePath,
      errors: 0,
      warnings: 0,
      fixed: 0,
    }

    try {
      const tscOutput = await $`pnpm exec tsc --noEmit --pretty false ${filePath} 2>&1`

      if (tscOutput.stdout) {
        const errorMatches = tscOutput.stdout.toString().match(/error TS\d+:/g)
        const warnMatches = tscOutput.stdout.toString().match(/warning TS\d+:/g)

        result.errors = errorMatches ? errorMatches.length : 0
        result.warnings = warnMatches ? warnMatches.length : 0
      }

      if (fix && result.errors > 0) {
        const eslintOutput = await $`pnpm exec eslint --fix ${filePath} 2>&1`
        const fixedMatches = eslintOutput.stdout?.toString().match(/fixed \d+ file/g)
        result.fixed = fixedMatches ? parseInt(fixedMatches[0].match(/\d+/)?.[0] || "0") : 0
      }
    } catch (e) {
      result.errors = 1
    }

    return result
  }

  const lintProject = async (): Promise<LintResult[]> => {
    const results: LintResult[] = []

    const tsconfigExists = await $`test -f tsconfig.json && echo "yes"`
    if (!tsconfigExists.stdout?.includes("yes")) {
      return [
        {
          file: "tsconfig.json",
          errors: 1,
          warnings: 0,
          fixed: 0,
        },
      ]
    }

    const tscOutput = await $`pnpm exec tsc --noEmit --pretty false 2>&1`
    const output = tscOutput.stdout || tscOutput.stderr || ""

    const files = new Map<string, LintResult>()

    const lines = output.split("\n").filter((line: string) => line.includes(": error TS"))

    for (const line of lines) {
      const match = line.match(/^(.+?):(\d+):(\d+): error TS(\d+): (.+)$/)
      if (match) {
        const filePath = match[1]
        if (!files.has(filePath)) {
          files.set(filePath, {
            file: filePath,
            errors: 0,
            warnings: 0,
            fixed: 0,
          })
        }
        files.get(filePath)!.errors++
      }
    }

    const warnLines = output.split("\n").filter((line: string) => line.includes(": warning TS"))
    for (const line of warnLines) {
      const match = line.match(/^(.+?):(\d+):(\d+): warning TS(\d+): (.+)$/)
      if (match) {
        const filePath = match[1]
        if (!files.has(filePath)) {
          files.set(filePath, {
            file: filePath,
            errors: 0,
            warnings: 0,
            fixed: 0,
          })
        }
        files.get(filePath)!.warnings++
      }
    }

    for (const [, result] of files) {
      results.push(result)
    }

    return results
  }

  return {
    tool: {
      "ts-lint": tool({
        description: "Run TypeScript linter on files, find errors, and optionally auto-fix them",
        args: {
          files: tool.schema.array(tool.schema.string()).optional(),
          fix: tool.schema.boolean().optional(),
          format: tool.schema.boolean().optional(),
        },
        async execute(args) {
          const output = await runLinter({
            files: args.files,
            fix: args.fix,
            format: args.format,
          })

          return output
        },
      }),
      "ts-lint-file": tool({
        description: "Lint a specific TypeScript file and optionally auto-fix errors",
        args: {
          file: tool.schema.string(),
          fix: tool.schema.boolean().optional(),
        },
        async execute(args) {
          const result = await lintFile(args.file, args.fix ?? true)

          return JSON.stringify(result, null, 2)
        },
      }),
      "ts-lint-project": tool({
        description: "Run full TypeScript project lint and report all errors",
        args: {},
        async execute() {
          const results = await lintProject()

          const totalErrors = results.reduce((sum, r) => sum + r.errors, 0)
          const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0)

          if (results.length === 0) {
            return "No TypeScript errors found. Project is type-safe."
          }

          let output = `# TypeScript Lint Results\n\n`
          output += `Total Errors: ${totalErrors} | Total Warnings: ${totalWarnings}\n\n`

          for (const result of results) {
            output += `- ${result.file}: ${result.errors} errors, ${result.warnings} warnings\n`
          }

          return output
        },
      }),
    },

    "tool.execute.after": async (input: ToolHookInput, output: ToolHookOutput) => {
      if (input.tool === "write" || input.tool === "edit") {
        const filePath = input.args?.filePath || input.args?.file
        if (filePath && (filePath.endsWith(".ts") || filePath.endsWith(".tsx"))) {
          await client.app.log({
            body: {
              service: "ts-linter",
              level: "debug",
              message: `Auto-linting TypeScript file: ${filePath}`,
            },
          })

          const lintResult = await lintFile(filePath, true)

          if (lintResult.errors > 0) {
            await client.app.log({
              body: {
                service: "ts-linter",
                level: "warn",
                message: `Found ${lintResult.errors} errors in ${filePath}`,
                extra: { file: filePath, errors: lintResult.errors },
              },
            })
          }
        }
      }
    },
  }
}