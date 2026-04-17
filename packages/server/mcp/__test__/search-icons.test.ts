import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('search_icons', () => {
  it('should return i-lucide-home for home query', () => {
    const result = runClaudeTask(
      `Use the search_icons tool to search for icons containing "home" in the lucide collection. ` +
        `Return the raw JSON result only.`,
      `The output must contain a JSON object with an "icons" array that includes "i-lucide-home". ` +
        `"total" must be at least 1.`,
      'search-icons-home',
    )

    expect(result.pass).toBe(true)
  })

  it('should return empty results for unsupported collection', () => {
    const result = runClaudeTask(
      `Use the search_icons tool with query "home" and collection "mdi". ` +
        `Return the raw JSON result only.`,
      `The output must indicate that the collection "mdi" is not available, ` +
        `or return an empty "icons" array with a note.`,
      'search-icons-unsupported',
    )

    expect(result.pass).toBe(true)
  })
})
