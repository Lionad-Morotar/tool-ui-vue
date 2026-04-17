import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('get_documentation_page', () => {
  it('should retrieve Audio story source content', () => {
    const result = runClaudeTask(
      `Use the get_documentation_page tool to fetch the page at path "/src/stories/audio/index.story.vue". ` +
        `Return the raw content only.`,
      `The output must contain Vue SFC source code, including keywords like "script setup", "import", or "Audio".`,
      'get-documentation-page-audio',
    )

    expect(result.pass).toBe(true)
  })

  it('should return null for nonexistent path', () => {
    const result = runClaudeTask(
      `Use the get_documentation_page tool to fetch a nonexistent page at path "/src/stories/nonexistent/index.story.vue". ` +
        `Return the raw content only.`,
      `The output must indicate that the page was not found, ` +
        `by returning null, empty content, or an error message.`,
      'get-documentation-page-missing',
    )

    expect(result.pass).toBe(true)
  })
})
