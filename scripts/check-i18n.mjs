#!/usr/bin/env node
/**
 * check-i18n.mjs — i18n 质量门禁脚本
 *
 * 1. Key 一致性校验（QUALITY-01）：对比 zh-CN.ts 和 en.ts 顶层命名空间 key
 * 2. 组件 i18n 覆盖检查（QUALITY-02）：扫描组件目录是否使用 useI18n
 *
 * Exit codes: 0 = OK, 1 = 不一致/缺少 i18n
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// ========== 配置 ==========

const LOCALE_DIR = resolve(root, 'packages/core/src/i18n/locales')
const COMPONENTS_DIR = resolve(root, 'packages/components/src')

// 已知 layout-only 组件白名单（不使用 useI18n 是合理的）
const LAYOUT_ONLY_WHITELIST = new Set([
  'image-gallery',
  'link-preview',
  'progress-tracker',
])

// ========== 工具函数 ==========

/**
 * 从 .ts 消息文件中提取顶层 key（命名空间）
 * 简单解析：查找 `namespace: {` 模式
 */
function getTopLevelKeys(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const keys = new Set()
  // Match `keyName: {` at the start of a line (top-level object keys)
  const regex = /^\s{2}(\w+):\s*{/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1])
  }
  return keys
}

/**
 * 检查组件目录中的 .vue 文件是否包含 useI18n import
 */
function componentUsesI18n(componentDir) {
  try {
    const files = readdirSync(componentDir)
    for (const file of files) {
      if (!file.endsWith('.vue') && !file.endsWith('.ts')) continue
      // Skip test files
      if (file.includes('.test.') || file.includes('.spec.')) continue
      const filePath = resolve(componentDir, file)
      if (!existsSync(filePath)) continue
      const content = readFileSync(filePath, 'utf-8')
      if (content.includes('useI18n') && content.includes('@lionad/vtu-core/i18n')) {
        return true
      }
    }
    // Check subdirectories (e.g., cmpts/)
    for (const file of files) {
      const fullPath = resolve(componentDir, file)
      const stat = require('fs').statSync(fullPath)
      if (stat.isDirectory() && file !== '__tests__') {
        if (componentUsesI18n(fullPath)) return true
      }
    }
    return false
  } catch {
    return false
  }
}

/**
 * 检查组件是否有 UI 文本（排除纯布局组件）
 * 简单启发式：检测常见 UI 文本模式
 */
function hasUIText(componentDir) {
  try {
    const files = readdirSync(componentDir)
    for (const file of files) {
      if (!file.endsWith('.vue')) continue
      const filePath = resolve(componentDir, file)
      if (!existsSync(filePath)) continue
      const content = readFileSync(filePath, 'utf-8')
      // Check for English text in template (>{{...}} followed by letters)
      if (/>[A-Z][a-z]+/.test(content) || />[a-z]{3,}</.test(content)) {
        return true
      }
    }
    return false
  } catch {
    return false
  }
}

// ========== 主检查逻辑 ==========

let exitCode = 0

// --- 1. Key 一致性校验 ---
console.log('## 1. Key 一致性校验 (QUALITY-01)\n')

const zhCNPath = resolve(LOCALE_DIR, 'zh-CN.ts')
const enPath = resolve(LOCALE_DIR, 'en.ts')

if (!existsSync(zhCNPath) || !existsSync(enPath)) {
  console.error('❌ 消息文件缺失')
  if (!existsSync(zhCNPath)) console.error(`   缺失: ${zhCNPath}`)
  if (!existsSync(enPath)) console.error(`   缺失: ${enPath}`)
  process.exit(1)
}

const zhCNKeys = getTopLevelKeys(zhCNPath)
const enKeys = getTopLevelKeys(enPath)

const missingInEn = [...zhCNKeys].filter(k => !enKeys.has(k))
const extraInEn = [...enKeys].filter(k => !zhCNKeys.has(k))

if (missingInEn.length === 0 && extraInEn.length === 0) {
  console.log(`✅ Key consistency: zh-CN (${zhCNKeys.size} namespaces) ↔ en (${enKeys.size} namespaces)`)
} else {
  exitCode = 1
  if (missingInEn.length > 0) {
    console.log(`❌ en.ts 缺少 ${missingInEn.length} 个命名空间: ${missingInEn.join(', ')}`)
  }
  if (extraInEn.length > 0) {
    console.log(`❌ en.ts 多余 ${extraInEn.length} 个命名空间: ${extraInEn.join(', ')}`)
  }
}

// --- 2. 组件 i18n 覆盖检查 ---
console.log('\n## 2. 组件 i18n 覆盖检查 (QUALITY-02)\n')

const componentDirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('_') && d.name !== 'shared')
  .map(d => d.name)
  .sort()

const componentsWithI18n = []
const componentsWithoutI18n = []
const whitelistedComponents = []

for (const dirName of componentDirs) {
  const dirPath = resolve(COMPONENTS_DIR, dirName)
  const usesI18n = componentUsesI18n(dirPath)

  if (usesI18n) {
    componentsWithI18n.push(dirName)
  } else if (LAYOUT_ONLY_WHITELIST.has(dirName)) {
    whitelistedComponents.push(dirName)
  } else {
    // Check if it has any UI text at all
    const hasUI = hasUIText(dirPath)
    if (hasUI) {
      componentsWithoutI18n.push(dirName)
    } else {
      // No UI text, OK to skip
      whitelistedComponents.push(dirName)
    }
  }
}

if (componentsWithoutI18n.length === 0) {
  console.log(`✅ i18n coverage: ${componentsWithI18n.length}/${componentsWithI18n.length} components use useI18n()`)
} else {
  exitCode = 1
  console.log(`❌ ${componentsWithoutI18n.length} components missing i18n: ${componentsWithoutI18n.join(', ')}`)
}

if (whitelistedComponents.length > 0) {
  console.log(`ℹ️  ${whitelistedComponents.length} layout-only/whitelisted: ${whitelistedComponents.join(', ')}`)
}

// ========== 总结 ==========
console.log('\n## 总结\n')

if (exitCode === 0) {
  console.log('✅ 全部检查通过')
} else {
  console.log('❌ 存在不一致或缺失，请修复后重试')
}

process.exit(exitCode)
