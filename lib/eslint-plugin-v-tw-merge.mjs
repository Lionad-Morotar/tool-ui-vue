// @ts-check

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('eslint').ESLint.Plugin} Plugin
 */

/**
 * ESLint plugin to ensure Vue components have v-tw-merge directive
 * on root element when they have class attribute.
 *
 * Adapted from udcweb.86links.com — checks src/components directory.
 */

/**
 * Minimal `defineTemplateBodyVisitor` shim.
 *
 * @param {import('eslint').Rule.RuleContext} context
 * @param {Record<string, Function>} templateBodyVisitor
 * @param {Record<string, Function>} [scriptVisitor]
 */
function defineTemplateBodyVisitor(
  context,
  templateBodyVisitor,
  scriptVisitor = {}
) {
  const parserServices = context.parserServices
  if (
    parserServices
    && typeof parserServices.defineTemplateBodyVisitor === 'function'
  ) {
    return parserServices.defineTemplateBodyVisitor(
      templateBodyVisitor,
      scriptVisitor
    )
  }
  return scriptVisitor
}

/** @type {RuleModule} */
const vTwMergeRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure Vue components have v-tw-merge on root element when they have class attribute',
      category: 'Best Practices',
      recommended: false
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    const fileName = context.filename ?? context.getFilename?.()
    const isComponentFile
      = fileName?.includes('/src/components/') && fileName?.endsWith('.vue')

    if (!isComponentFile) {
      return {}
    }

    let firstNonTemplateElementFound = false

    if (fileName.endsWith('.vue')) {
      return defineTemplateBodyVisitor(
        context,
        {
          /** @param {any} node */
          VElement(node) {
            if (!firstNonTemplateElementFound && node.rawName !== 'template') {
              firstNonTemplateElementFound = true

              const hasClassAttr = node.startTag.attributes.some(
                (/** @type {any} */ attr) =>
                  attr.type === 'VAttribute'
                  && attr.key.type === 'VIdentifier'
                  && attr.key.name === 'class'
              )

              let hasVtwMergeDirective = false
              for (const attr of node.startTag.attributes) {
                if (
                  attr.type === 'VAttribute'
                  && attr.directive === true
                  && attr.key.type === 'VDirectiveKey'
                ) {
                  if (attr.key.name?.name === 'tw-merge') {
                    hasVtwMergeDirective = true
                    break
                  }
                }
              }

              if (hasClassAttr && !hasVtwMergeDirective) {
                const elementName = node.rawName

                context.report({
                  node: node.startTag,
                  message: `Root element <${elementName}> has class attribute but missing v-tw-merge directive`,
                  fix(fixer) {
                    const attributes = node.startTag.attributes
                    let insertPosition

                    if (attributes.length === 0) {
                      insertPosition
                        = node.startTag.range[0] + 1 + node.rawName.length
                    } else {
                      const lastAttr = attributes[attributes.length - 1]
                      insertPosition = lastAttr.range[1]
                    }

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      ' v-tw-merge'
                    )
                  }
                })
              }
            }
          }
        },
        {}
      )
    }

    return {}
  }
}

/** @type {Plugin} */
const plugin = {
  rules: {
    'v-tw-merge': vTwMergeRule
  }
}

export default plugin
