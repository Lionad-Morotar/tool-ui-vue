import { describe, expect, it } from 'vitest'
import { runClaudeTask } from './helpers.js'

describe('get_component_metadata', () => {
  it('should return Audio metadata with schemas, types, and composables', () => {
    const result = runClaudeTask(
      'Use the get_component_metadata tool to query the "Audio" component in tool-ui-vue. ' +
        'Return the raw JSON result only, no explanation.',
      'The output must contain a JSON object with "name": "Audio". ' +
        'It must include "schemas" array containing "SerializableAudioSchema", ' +
        '"types" array containing "AudioProps", and ' +
        '"stateComposables" array containing "useAudio".',
      'get-component-metadata-audio',
    )

    expect(result.pass).toBe(true)
  })

  it('should return Citation metadata with variant and type enums', () => {
    const result = runClaudeTask(
      'Use the get_component_metadata tool to query the "Citation" component. ' +
        'Return the raw JSON result only.',
      'The output must contain a JSON object with "name": "Citation". ' +
        '"schemas" should include "CitationTypeSchema" or "CitationVariantSchema". ' +
        '"props" should include fields like "id", "role", "receipt", "outcome", "summary".',
      'get-component-metadata-citation',
    )

    expect(result.pass).toBe(true)
  })
})
