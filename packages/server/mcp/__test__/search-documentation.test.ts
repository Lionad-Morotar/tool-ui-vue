import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('search_documentation', () => {
  it('should find STACK.md when searching for stack', () => {
    const result = runClaudeTask(
      `Use the search_documentation tool to find pages with "STACK" in the title. ` +
        `Return the raw JSON result only.`,
      `The output must contain a JSON object with a "pages" array. ` +
        `One page must have a title containing "STACK" or a path ending with "STACK.md".`,
      'search-documentation-stack',
    )

    expect(result.pass).toBe(true)
  })

  it('should list all documentation pages when no query is provided', () => {
    const result = runClaudeTask(
      `Use the search_documentation tool with no arguments to list all docs. ` +
        `Return the raw JSON result only.`,
      `The output must contain a "pages" array with at least 3 items, ` +
        `including paths like "/README.md" or "/CLAUDE.md" or "/.planning/codebase/STACK.md".`,
      'search-documentation-all',
    )

    expect(result.pass).toBe(true)
  })
})
