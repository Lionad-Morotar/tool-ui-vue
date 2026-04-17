import { z } from 'zod'
import type { ToolDefinition } from '../../src/types.js'
import { listDocumentationPages } from '../../src/utils.js'

const inputSchema = z.object({
  search: z.string().optional().describe('Search term to filter pages by title'),
  section: z.string().optional().describe('Filter by section path prefix, e.g., ".planning/codebase"'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'search_documentation',
  description: 'Search project documentation pages by title or path. With no params, lists all pages.',
  inputSchema,
  handler({ search, section }) {
    let results = listDocumentationPages()

    if (section) {
      results = results.filter((p) => p.path.includes(section))
    }

    if (search) {
      const s = search.toLowerCase()
      results = results.filter(
        (p) => p.title.toLowerCase().includes(s) || p.path.toLowerCase().includes(s)
      )
    }

    return {
      pages: results,
      total: results.length,
    }
  },
}

export default tool
