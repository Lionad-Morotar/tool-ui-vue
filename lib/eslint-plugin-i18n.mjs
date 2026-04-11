// @ts-check

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('eslint').ESLint.Plugin} Plugin
 */

import { readFileSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Extract top-level keys from a locale .ts file
// Matches `  keyName: {` pattern (2-space indented object keys)
function getTopLevelKeys(filePath) {
  if (!existsSync(filePath)) return null
  const content = readFileSync(filePath, 'utf-8')
  const keys = new Set()
  const regex = /^\s{2}(\w+):\s*\{/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1])
  }
  return keys
}

/** @type {RuleModule} */
const keyConsistencyRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'zh-CN and en locale top-level keys must match',
      recommended: true
    },
    schema: []
  },
  create(context) {
    // @ts-expect-error getFilename compatibility for older ESLint versions
    const fileName = context.filename ?? context.getFilename?.()
    const isLocaleFile
      = fileName?.endsWith('zh-CN.ts') || fileName?.endsWith('/en.ts')

    if (!isLocaleFile) {
      return {}
    }

    return {
      Program(node) {
        const localesDir = resolve(root, 'packages/core/src/i18n/locales')
        const zhCNPath = resolve(localesDir, 'zh-CN.ts')
        const enPath = resolve(localesDir, 'en.ts')

        const zhCNKeys = getTopLevelKeys(zhCNPath)
        const enKeys = getTopLevelKeys(enPath)

        if (!zhCNKeys || !enKeys) {
          context.report({
            node,
            loc: { line: 1, column: 0 },
            message: 'Locale file missing or unreadable. Ensure both zh-CN.ts and en.ts exist.'
          })
          return
        }

        const missingInEn = [...zhCNKeys].filter(k => !enKeys.has(k))
        const extraInEn = [...enKeys].filter(k => !zhCNKeys.has(k))

        if (missingInEn.length > 0) {
          context.report({
            node,
            loc: { line: 1, column: 0 },
            message: `en.ts missing namespaces: ${missingInEn.join(', ')}`
          })
        }

        if (extraInEn.length > 0) {
          context.report({
            node,
            loc: { line: 1, column: 0 },
            message: `en.ts has extra namespaces not in zh-CN: ${extraInEn.join(', ')}`
          })
        }
      }
    }
  }
}

/** @type {Plugin} */
const plugin = {
  rules: {
    'key-consistency': keyConsistencyRule
  }
}

export default plugin
