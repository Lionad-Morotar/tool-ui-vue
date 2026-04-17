import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MONOREPO_ROOT = join(__dirname, '..', '..', '..')
const DIST_ROOT = join(__dirname, '..', 'dist')

const targets = [
  {
    src: join(MONOREPO_ROOT, 'packages', 'components', 'src'),
    dest: join(DIST_ROOT, 'packages', 'components', 'src'),
    label: 'components/src',
  },
  {
    src: join(MONOREPO_ROOT, 'src', 'stories'),
    dest: join(DIST_ROOT, 'src', 'stories'),
    label: 'stories',
    filter: (src) => !src.includes('tailwind-test'),
  },
]

for (const { src, dest, label, filter } of targets) {
  if (!existsSync(src)) {
    console.error(`Source not found: ${src}`)
    process.exit(1)
  }

  if (existsSync(dest)) {
    rmSync(dest, { recursive: true })
  }

  mkdirSync(dirname(dest), { recursive: true })
  cpSync(src, dest, { recursive: true, filter })
  console.log(`Copied ${label} → ${dest}`)
}

console.log('Done.')
