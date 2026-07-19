import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('complex multi-tool workflow', () => {
  it('should discover Video component, get its metadata, and retrieve an example', () => {
    const result = runClaudeTask(
      `Perform the following steps using the tool-ui-vue MCP server:
` +
        `1. Use search_components to find a component suitable for displaying a video.
` +
        `2. Use get_component_metadata on that component to get its props and schemas.
` +
        `3. Use get_example on that component with index 0 to retrieve a usage example.
` +
        'Return a concise summary including: the component name, its main props, and whether it has examples.',
      'The output must mention the "Video" component. ' +
        'It should reference props (e.g., "id", "src", "title") and confirm that at least one usage example exists. ' +
        'The presence of schema names like "SerializableVideoSchema" or "VideoProps" is a plus.',
      'complex-workflow-video',
    )

    expect(result.pass).toBe(true)
  })

  it('should compare Audio and Terminal components using metadata', () => {
    const result = runClaudeTask(
      `Perform the following steps:
` +
        `1. Use get_component_metadata to query "Audio".
` +
        `2. Use get_component_metadata to query "Terminal".
` +
        `3. Compare the two components based on their schemas, types, and state composables.
` +
        'Return a brief comparison in plain text.',
      'The output must reference both "Audio" and "Terminal" components. ' +
        'It should mention at least one schema or composable for each (e.g., "useAudio" for Audio, "useTerminal" or "SerializableTerminalSchema" for Terminal). ' +
        'A meaningful comparison point (e.g., different media types, different state exports) should be present.',
      'complex-workflow-compare',
    )

    expect(result.pass).toBe(true)
  })
})
