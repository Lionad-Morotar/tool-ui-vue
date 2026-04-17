import {
  listComponentNames,
  resolveBarrelPath,
  resolveI18nPath,
  resolveSchemaPath,
  resolveStatesPath,
  resolveTestsPath,
  resolveVuePath,
} from './resolver.js'
import {
  extractExamplesFromTests,
  extractExportedNames,
  extractJSDocDescription,
  readTextFile,
} from './utils.js'

export interface ComponentData {
  name: string
  kebabName: string
  description: string
  schemaContent: string | null
  vueContent: string | null
  testsContent: string | null
  statesContent: string | null
  barrelContent: string | null
  hasI18n: boolean
  examples: Array<{ description?: string; props: Record<string, unknown> }>
  schemaExports: string[]
  stateExports: string[]
}

function buildComponentCache(): ComponentData[] {
  const names = listComponentNames()
  return names.map((name) => {
    const kebabName = name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase()

    const schemaContent = readTextFile(resolveSchemaPath(name))
    const vueContent = readTextFile(resolveVuePath(name))
    const testsContent = readTextFile(resolveTestsPath(name))
    const statesContent = readTextFile(resolveStatesPath(name))
    const barrelContent = readTextFile(resolveBarrelPath(name))

    const description = schemaContent ? extractJSDocDescription(schemaContent) : ''
    const examples = testsContent ? extractExamplesFromTests(testsContent) : []
    const schemaExports = schemaContent ? extractExportedNames(schemaContent) : []
    const stateExports = statesContent ? extractExportedNames(statesContent) : []

    const i18nEn = readTextFile(resolveI18nPath(name, 'en'))
    const i18nZh = readTextFile(resolveI18nPath(name, 'zh-CN'))
    const hasI18n = !!(i18nEn || i18nZh)

    return {
      name,
      kebabName,
      description,
      schemaContent,
      vueContent,
      testsContent,
      statesContent,
      barrelContent,
      hasI18n,
      examples,
      schemaExports,
      stateExports,
    }
  })
}

export const componentData: ComponentData[] = buildComponentCache()

export function findComponent(name: string): ComponentData | undefined {
  return componentData.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() || c.kebabName.toLowerCase() === name.toLowerCase()
  )
}
