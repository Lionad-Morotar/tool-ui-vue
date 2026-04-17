import type { ResourceDefinition } from '../../src/types.js'
import { componentData } from '../../src/data.js'

const resource: ResourceDefinition = {
  uri: 'resource://vtu/composables',
  description: 'Browse all available headless composables exported from component states/',
  handler() {
    const composables = componentData
      .flatMap((c) =>
        c.stateExports
          .filter((n) => n.startsWith('use'))
          .map((n) => ({ component: c.name, composable: n }))
      )
      .sort((a, b) => a.composable.localeCompare(b.composable))

    return {
      contents: [{
        uri: 'resource://vtu/composables',
        mimeType: 'application/json',
        text: JSON.stringify(composables, null, 2),
      }],
    }
  },
}

export default resource
