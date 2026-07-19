import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('search_composables', () => {
  it('should find useAudio and map it to the Audio component', () => {
    const result = runClaudeTask(
      'Use the search_composables tool to search for composables containing "useAudio" in tool-ui-vue. ' +
        'Return the raw JSON result only.',
      'The output must contain a JSON object with a "composables" array. ' +
        'One entry must have "component": "Audio" and "composable": "useAudio".',
      'search-composables-useaudio',
    )

    expect(result.pass).toBe(true)
  })

  it('should list all composables when no search query is provided', () => {
    const result = runClaudeTask(
      'Use the search_composables tool with no arguments to list all composables. ' +
        'Return the raw JSON result only.',
      'The output must contain a "composables" array with at least 5 items, ' +
        'including composables from components like Audio, Video, Citation, or CodeBlock.',
      'search-composables-all',
    )

    expect(result.pass).toBe(true)
  })
})
