import { componentData } from '../../src/data.js'
import type { ResourceDefinition } from '../../src/types.js'

const resource: ResourceDefinition = {
  uri: 'resource://vtu/components',
  description: 'Complete list of available tool-ui-vue components with metadata and categories',
  handler() {
    const components = componentData.map((c) => ({
      name: c.name,
      description: c.description || undefined,
      hasSchema: !!c.schemaContent,
      hasTests: !!c.testsContent,
      hasStates: !!c.statesContent,
      hasI18n: c.hasI18n,
    }))

    return {
      contents: [{
        uri: 'resource://vtu/components',
        mimeType: 'application/json',
        text: JSON.stringify(components, null, 2),
      }],
    }
  },
}

export default resource
