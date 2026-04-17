import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('search_documentation', () => {
  it('should find Audio story when searching for audio', () => {
    const result = runClaudeTask(
      `Use the search_documentation tool to find pages with "audio" in the title. ` +
        `Return the raw JSON result only.`,
      `The output must contain a JSON object with a "pages" array. ` +
        `At least one page must have "Audio" in its title.`,
      'search-documentation-audio',
    )

    expect(result.pass).toBe(true)
  })

  it('should list all documentation pages when no query is provided', () => {
    const result = runClaudeTask(
      `Use the search_documentation tool with no arguments to list all docs. ` +
        `Return the raw JSON result only.`,
      `The output must contain a "pages" array with at least 3 items, ` +
        `each with "title", "path", "storyId", and "category" fields.`,
      'search-documentation-all',
    )

    expect(result.pass).toBe(true)
  })
})
