import type { ResourceDefinition } from '../../src/types.js'
import { componentData } from '../../src/data.js'

const resource: ResourceDefinition = {
  uri: 'resource://vtu/examples',
  description: 'Browse all available component usage examples extracted from test files',
  handler() {
    const examples = componentData.flatMap((c) =>
      c.examples.map((ex) => ({
        component: c.name,
        ...ex,
      }))
    )

    return {
      contents: [{
        uri: 'resource://vtu/examples',
        mimeType: 'application/json',
        text: JSON.stringify(examples, null, 2),
      }],
    }
  },
}

export default resource
