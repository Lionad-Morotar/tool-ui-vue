import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const distDir = new URL('dist', import.meta.url).pathname

// Build style.css: @source + tokens + scoped CSS, one file to rule them all
const tokens = await readFile(join(distDir, 'tokens.css'), 'utf-8')
const scoped = await readFile(join(distDir, 'vtu-components.css'), 'utf-8')

const style = `@source ".";\n${tokens}\n${scoped}`
await writeFile(join(distDir, 'style.css'), style)
console.log('Generated style.css')
