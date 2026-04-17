import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('list_examples and get_example', () => {
  it('should list examples for Audio component', () => {
    const result = runClaudeTask(
      `Use the list_examples tool to get usage examples for the "Audio" component. ` +
        `Return the raw JSON result only.`,
      `The output must contain a JSON object with an "examples" array. ` +
        `At least one example should belong to component "Audio" and contain a "props" object.`,
      'list-examples-audio',
    )

    expect(result.pass).toBe(true)
  })

  it('should get the first example of Video component by index', () => {
    const result = runClaudeTask(
      `Use the get_example tool with componentName "Video" and index 0. ` +
        `Return the raw JSON result only.`,
      `The output must contain a JSON object with "component": "Video", "index": 0, and an "example" object with "props".`,
      'get-example-video-0',
    )

    expect(result.pass).toBe(true)
  })
})
