/**
 * ESLint 插件：确保特定类名排在 class 最前面，提高辨识度
 * BEM 类名格式：layout-*, page-*, cmpt-*
 *
 * Migrated from udcweb.86links.com
 */

const BEM_PREFIXES = ['layout-', 'page-', 'cmpt-']

function isBemClass(className) {
  return BEM_PREFIXES.some(prefix => className.startsWith(prefix))
}

function sortClasses(classes) {
  const bemClasses = classes.filter(isBemClass)
  const otherClasses = classes.filter(c => !isBemClass(c))
  return [...bemClasses, ...otherClasses]
}

function extractClasses(classValue) {
  return classValue.split(/\s+/).filter(Boolean)
}

function joinClasses(classes) {
  return classes.join(' ')
}

const bemOrderRule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Ensure BEM classnames are sorted at the beginning',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',
    schema: [],
    messages: {
      invalidOrder: 'BEM classnames should be placed at the beginning of the class list'
    }
  },

  create(context) {
    function traverse(node) {
      if (!node || typeof node !== 'object') return

      if (node.type === 'VAttribute') {
        if (node.directive === false && node.key?.type === 'VIdentifier' && node.key?.name === 'class') {
          if (node.value?.type === 'VLiteral' && typeof node.value?.value === 'string') {
            const value = node.value.value
            const range = [node.value.range[0] + 1, node.value.range[1] - 1]
            checkAndFixClassValue(node, value, range)
          }
        }
      }

      for (const key in node) {
        if (key === 'parent') continue
        const child = node[key]
        if (Array.isArray(child)) {
          child.forEach(traverse)
        } else if (child && typeof child === 'object') {
          traverse(child)
        }
      }
    }

    function checkAndFixClassValue(node, value, range) {
      const classes = extractClasses(value)
      const sortedClasses = sortClasses(classes)

      const originalValue = joinClasses(classes)
      const sortedValue = joinClasses(sortedClasses)

      if (originalValue !== sortedValue) {
        context.report({
          node,
          messageId: 'invalidOrder',
          fix(fixer) {
            return fixer.replaceTextRange(range, sortedValue)
          }
        })
      }
    }

    return {
      'Program:exit'(node) {
        traverse(node)
      },

      JSXAttribute(node) {
        if (node.name?.name === 'className') {
          const value = node.value?.value
          if (typeof value === 'string') {
            const range = [node.value.range[0] + 1, node.value.range[1] - 1]
            checkAndFixClassValue(node, value, range)
          }
        }
      },

      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes(' ')) {
          const parent = node.parent
          if (parent && (
            (parent.type === 'JSXAttribute' && parent.name?.name === 'className')
            || (parent.type === 'Property' && parent.key?.name === 'class')
            || (parent.type === 'CallExpression' && parent.callee?.name?.match(/classNames?|clsx|cn/))
          )) {
            const range = [node.range[0] + 1, node.range[1] - 1]
            checkAndFixClassValue(node, node.value, range)
          }
        }
      }
    }
  }
}

const plugin = {
  meta: {
    name: 'bem-order',
    version: '1.0.0'
  },
  rules: {
    'bem-order': bemOrderRule
  }
}

export default plugin
