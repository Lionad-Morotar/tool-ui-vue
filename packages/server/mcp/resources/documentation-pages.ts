import { listDocumentationPages } from '../../src/utils.js'
import type { ResourceDefinition } from '../../src/types.js'

const resource: ResourceDefinition = {
  uri: 'resource://vtu/documentation-pages',
  description: 'Browse all available project documentation pages',
  handler() {
    const pages = listDocumentationPages()

    return {
      contents: [{
        uri: 'resource://vtu/documentation-pages',
        mimeType: 'application/json',
        text: JSON.stringify(pages, null, 2),
      }],
    }
  },
}

export default resource
