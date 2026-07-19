import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('search_components', () => {
  it('should find Audio component with schema and tests info', () => {
    const result = runClaudeTask(
      'Use the search_components tool to find components related to "Audio" in tool-ui-vue. ' +
        'Return the raw JSON result only, no explanation.',
      'The output must contain a JSON object with a "components" array. ' +
        'One of the components must have name "Audio", hasSchema=true, hasTests=true, and hasStates=true.',
      'search-components-audio',
    )

    expect(result.pass).toBe(true)
  })

  it('should return all components when no search query is provided', () => {
    const result = runClaudeTask(
      'Use the search_components tool with no arguments to list all tool-ui-vue components. ' +
        'Return the raw JSON result only.',
      'The output must contain a JSON object with a "components" array having at least 20 items. ' +
        'It should include "ApprovalCard", "Audio", "Video", "Chart", and "Citation".',
      'search-components-all',
    )

    expect(result.pass).toBe(true)
  })
})
