// @ts-check
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import { importX } from 'eslint-plugin-import-x'
import tailwind from 'eslint-plugin-tailwindcss'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

import vTwMergePlugin from './lib/eslint-plugin-v-tw-merge.mjs'
import bemOrderPlugin from './lib/eslint-plugin-bem-order.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  // ========== 全局忽略 ==========
  { ignores: ['dist', 'node_modules', '.histoire', '.vite', 'coverage', 'src/components/.example'] },

  // ========== Vue 推荐规则 ==========
  ...pluginVue.configs['flat/recommended'],

  // ========== TypeScript 推荐规则 ==========
  ...tseslint.configs.recommended,

  // ========== Vue 文件：强制 vue-eslint-parser + TS 子解析器 ==========
  // 必须放在 tseslint.configs 之后，否则 TS 基础配置会覆盖 parser
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: ['.vue']
      }
    }
  },

  // ========== 主规则配置 ==========
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      'v-tw-merge': vTwMergePlugin,
      'import-x': importX,
      'tailwindcss': tailwind,
      'bem-order': bemOrderPlugin
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json'
        })
      ],
      'tailwindcss': {
        callees: ['classnames', 'clsx', 'ctl', 'cva', 'cn'],
        config: resolve(__dirname, './src/stories/_shared/tailwind.css')
      }
    },
    rules: {
      // ========== v-tw-merge（本项目未使用 tailwind-merge-vue-directive，默认关闭）==========
      'v-tw-merge/v-tw-merge': 'off',

      // ========== Vue 格式化 ==========
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      'vue/multi-word-component-names': ['error', { ignores: ['index'] }],
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 3
          },
          multiline: {
            max: 1
          }
        }
      ],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-indent': ['error', 2],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below'
        }
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],

      // ========== TypeScript ==========
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }],

      // ========== Vue ==========
      // code-block/terminal 等组件需要渲染原始 HTML
      'vue/no-v-html': 'off',

      // ========== 引号风格 ==========
      'quotes': ['error', 'single', { avoidEscape: true }],

      // ========== import-x 导入顺序 ==========
      // 禁用原有的 import/order，使用 import-x/order 代替
      'import/order': 'off',

      // type import 单独分组放在最后
      'import-x/order': [
        'error',
        {
          'groups': [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'type'
          ],
          'newlines-between': 'never',
          'pathGroups': [
            { pattern: '@/**', group: 'internal' },
            { pattern: '~/**', group: 'internal' },
            { pattern: '#/**', group: 'internal' }
          ],
          // 排除 type import，让它们走 type 组
          'pathGroupsExcludedImportTypes': ['builtin', 'type'],
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],

      // 禁止重复导入
      'import-x/no-duplicates': 'error',

      // ========== BEM 排序规则 ==========
      'bem-order/bem-order': 'warn',

      // ========== tailwindcss 规则 ==========
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'off'
    }
  },

  // ========== 强制 type import 分开写 ==========
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: true
        }
      ]
    }
  },

  // ========== globals.d.ts 使用 import() 类型注解是合理的，禁用规则 ==========
  {
    files: ['**/globals.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off'
    }
  },

  // ========== 测试文件：仅放宽 Histoire 框架约束 ==========
  // 注意：测试文件的代码质量标准与源码一致，不额外放宽
  {
    files: ['src/stories/**/*.vue'],
    rules: {
      // Histoire 要求在 <script setup> 中 export 变量供 story 使用
      'vue/no-export-in-script-setup': 'off',
      // Histoire story 文件使用单一根节点
      'vue/valid-template-root': 'off',
      // story 命名约定：audio.story.vue，与多词规则冲突
      'vue/multi-word-component-names': 'off'
    }
  }
)
