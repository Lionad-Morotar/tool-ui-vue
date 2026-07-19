// @ts-check
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default withNuxt(
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: resolve(__dirname, './app/assets/css/main.css')
      }
    },
    rules: {
      // 类排序：Tailwind 类按官方语义序；未知类（含 layout-/page-/cmpt- 标记类）自动排最前
      'better-tailwindcss/enforce-consistent-class-order': ['warn', {
        order: 'official',
        unknownClassPosition: 'start',
        unknownClassOrder: 'preserve'
      }],
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'warn',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn'
    }
  }
)
