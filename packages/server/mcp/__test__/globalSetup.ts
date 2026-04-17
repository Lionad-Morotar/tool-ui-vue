import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVER_DIR = join(__dirname, '..', '..')
const DIST_BIN = join(SERVER_DIR, 'dist', 'mcp', 'index.js')

export default function setup() {
  // Skip rebuild if dist already exists and looks fresh enough
  if (existsSync(DIST_BIN)) {
    console.log('[globalSetup] dist/mcp/index.js exists, skipping build')
    return
  }

  console.log('[globalSetup] Building server...')
  execSync('pnpm build', {
    cwd: SERVER_DIR,
    stdio: 'inherit',
  })

  if (!existsSync(DIST_BIN)) {
    throw new Error(`Build failed: ${DIST_BIN} not found`)
  }
  console.log('[globalSetup] Build complete.')
}
