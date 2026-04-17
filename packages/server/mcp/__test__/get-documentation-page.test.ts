import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('get_documentation_page', () => {
  it('should retrieve STACK.md content', () => {
    const result = runClaudeTask(
      `Use the get_documentation_page tool to fetch the page at path "/.planning/codebase/STACK.md". ` +
        `Return the raw content only.`,
      `The output must contain markdown text related to the project stack, ` +
        `including keywords like "Vue", "TypeScript", "Tailwind", or "Vite".`,
      'get-documentation-page-stack',
    )

    expect(result.pass).toBe(true)
  })

  it('should retrieve README.md content', () => {
    const result = runClaudeTask(
      `Use the get_documentation_page tool to fetch the page at path "/README.md". ` +
        `Return the raw content only.`,
      `The output must contain markdown text describing tool-ui-vue, ` +
        `with keywords like "Vue 3", "component library", or "tool call widgets".`,
      'get-documentation-page-readme',
    )

    expect(result.pass).toBe(true)
  })
})
