import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('search_icons', () => {
  it('should return i-lucide-home for home query', () => {
    const result = runClaudeTask(
      `Use the search_icons tool to search for icons containing "home" in the lucide collection. ` +
        `Return the raw JSON result only.`,
      `The output must contain a JSON object with an "icons" array that includes "i-lucide-home". ` +
        `"total" must be at least 1. Each icon should have "name" and "preview" fields.`,
      'search-icons-home',
    )

    expect(result.pass).toBe(true)
  })

  it('should search across different collections', () => {
    const result = runClaudeTask(
      `Use the search_icons tool with query "home" and collection "mdi". ` +
        `Return the raw JSON result only.`,
      `The output must contain a JSON object with an "icons" array containing at least one icon ` +
        `whose name starts with "i-mdi-". "total" must be at least 1. ` +
        `Each icon should have "name" and "preview" fields, ` +
        `and the preview should be a URL containing "api.iconify.design".`,
      'search-icons-mdi',
    )

    expect(result.pass).toBe(true)
  })
})
