import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const __dirname = new URL('.', import.meta.url).pathname

export const SERVER_BIN = join(__dirname, '..', '..', 'dist', 'mcp', 'index.js')

function ensureLogDir(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10)
  const dir = join(__dirname, 'logs', dateStr)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

export function writeLog(name: string, content: string): string {
  const dir = ensureLogDir()
  const now = new Date()
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-')
  const filename = `${timeStr}-${name}.log`
  const filepath = join(dir, filename)
  writeFileSync(filepath, content, 'utf-8')
  return filepath
}

export function buildMcpConfig(): string {
  const dir = ensureLogDir()
  const tmpFile = join(dir, `mcp-${Date.now()}.json`)
  writeFileSync(
    tmpFile,
    JSON.stringify(
      {
        mcpServers: {
          'vtu-smoke': {
            command: 'node',
            args: [SERVER_BIN],
          },
        },
      },
      null,
      2,
    ),
    'utf-8',
  )
  return tmpFile
}

export interface EvalResult {
  pass: boolean
  reason: string
}

function execClaude(args: string[]): string {
  const result = spawnSync('claude', args, {
    encoding: 'utf-8',
    timeout: 600000,
  })
  const stdout = result.stdout || ''
  const stderr = result.stderr || ''
  if (result.error) {
    throw new Error(`spawn error: ${result.error.message}\nstderr: ${stderr}`)
  }
  return stdout
}

export function runClaudeTask(
  taskPrompt: string,
  evalCriteria: string,
  testName: string,
): EvalResult {
  if (!existsSync(SERVER_BIN)) {
    throw new Error(
      `Server binary not found at ${SERVER_BIN}. Run 'pnpm build' first.`,
    )
  }

  const mcpConfig = buildMcpConfig()

  const taskArgs = [
    '-p',
    taskPrompt,
    '--mcp-config',
    mcpConfig,
    '--strict-mcp-config',
    '--print',
    '--bare',
    '--no-session-persistence',
    '--max-budget-usd',
    '2.00',
    '--max-turns',
    '10',
  ]

  let taskOutput: string
  try {
    taskOutput = execClaude(taskArgs)
  } catch (err: any) {
    taskOutput = err.message || String(err)
  }
  writeLog(
    `${testName}-task`,
    `CMD: claude ${taskArgs.join(' ')}\n\n${taskOutput}`,
  )

  const evalPrompt =
    `You are a strict test evaluator.\n\n` +
    `Task: ${taskPrompt}\n\n` +
    `MCP Server Output:\n${taskOutput}\n\n` +
    `Evaluation Criteria: ${evalCriteria}\n\n` +
    `Return ONLY a JSON object with this exact shape: {"pass": boolean, "reason": "string"}. ` +
    `No markdown code blocks, no explanation.`

  const evalArgs = [
    '-p',
    evalPrompt,
    '--print',
    '--bare',
    '--no-session-persistence',
    '--output-format',
    'json',
    '--max-budget-usd',
    '1.00',
    '--max-turns',
    '5',
  ]

  let evalOutput: string
  try {
    evalOutput = execClaude(evalArgs)
  } catch (err: any) {
    evalOutput = err.message || String(err)
  }
  writeLog(
    `${testName}-eval`,
    `CMD: claude ${evalArgs.join(' ')}\n\n${evalOutput}`,
  )

  try {
    const cleaned = evalOutput.trim().replace(/^```json\s*|\s*```$/g, '')

    // Claude --output-format json wraps the result in {"type":"result","result":"..."}
    const wrapper = JSON.parse(cleaned) as {
      type?: string
      result?: string
      structured_output?: EvalResult
    } | EvalResult

    if ('type' in wrapper && typeof wrapper.result === 'string') {
      try {
        const inner = wrapper.result.trim().replace(/^```json\s*|\s*```$/g, '')
        const parsed = JSON.parse(inner) as EvalResult
        return parsed
      } catch {
        // Fallback to structured_output when result is empty/unparseable
        if (wrapper.structured_output) {
          return wrapper.structured_output
        }
        throw new Error('unparseable result field')
      }
    }
    return wrapper as EvalResult
  } catch {
    return {
      pass: false,
      reason: `Failed to parse eval JSON. Raw output: ${evalOutput.slice(0, 500)}`,
    }
  }
}
