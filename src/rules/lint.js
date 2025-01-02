import { kebabCase, last } from 'es-toolkit'
import { biome } from '../biome.js'

function reportBiomeDiagnostics(context, diagnostic) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()

  const { category, description, location } = diagnostic
  const [startIndex, endIndex] = location.span
  context.report({
    data: {
      category,
      description: description.endsWith('.') ? description : `${description}.`,
      biomeDocUrl: `https://biomejs.dev/linter/rules/${kebabCase(last(category.split('/')))}`,
    },
    loc: {
      end: sourceCode.getLocFromIndex(endIndex),
      start: sourceCode.getLocFromIndex(startIndex),
    },
    messageId: 'lint',
  })
}

/** @type {import('eslint').Rule.RuleModule} */
export const lint = {
  meta: {
    fixable: 'code',
    messages: {
      lint: '{{ description }} See {{ biomeDocUrl }} .',
    },
    schema: [],
    type: 'problem',
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const filepath = context.filename ?? context.getFilename()
    const sourceCodeText = sourceCode.text

    return {
      Program() {
        const { diagnostics } = biome.lintContent(sourceCodeText, {
          filePath: filepath.endsWith('.js') ? filepath : 'file.js',
        })

        for (const diagnostic of diagnostics) {
          reportBiomeDiagnostics(context, diagnostic)
        }
      },
    }
  },
}
