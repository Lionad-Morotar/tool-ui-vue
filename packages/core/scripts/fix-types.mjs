import { readFileSync, writeFileSync, copyFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const srcDir = join(distDir, 'src')

// Copy src/index.d.ts to dist/index.d.ts
const indexContent = readFileSync(join(srcDir, 'index.d.ts'), 'utf-8')
writeFileSync(join(distDir, 'index.d.ts'), indexContent)

// Copy all .d.ts files from src to dist root
const files = readdirSync(srcDir)
for (const file of files) {
  if (file.endsWith('.d.ts') && file !== 'index.d.ts') {
    copyFileSync(join(srcDir, file), join(distDir, file))
  }
}

// Copy subdirectory .d.ts files
const subdirs = ['components', 'media', 'parse', 'schema', 'contract', 'utils']
for (const subdir of subdirs) {
  const srcSubdir = join(srcDir, subdir)
  const distSubdir = join(distDir, subdir)
  if (existsSync(srcSubdir)) {
    if (!existsSync(distSubdir)) {
      mkdirSync(distSubdir, { recursive: true })
    }
    const subdirFiles = readdirSync(srcSubdir)
    for (const file of subdirFiles) {
      if (file.endsWith('.d.ts') || file.endsWith('.d.ts.map')) {
        copyFileSync(join(srcSubdir, file), join(distSubdir, file))
      }
    }
  }
}

console.log('Type definitions fixed successfully!')
