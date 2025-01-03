import type { Diagnostic } from '@biomejs/js-api'
import { kebabCase, last } from 'es-toolkit'
import type { Rule } from 'eslint'
import { biome } from '../biome.js'
import { getValidFilePath } from './utils.js'

function reportBiomeDiagnostics(context: Rule.RuleContext, diagnostic: Diagnostic) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()

  const { category, description, location } = diagnostic
  if (!(category && location.span)) {
    return
  }

  const [startIndex, endIndex] = location.span
  const advices = diagnostic.advices.advices
    .filter((advice) => 'log' in advice)
    .flatMap((advice) => advice.log[1].map(({ content }) => content))
    .join('\n')
  context.report({
    data: {
      advices,
      biomeDocUrl: `https://biomejs.dev/linter/rules/${kebabCase(last(category.split('/')))}`,
      category,
      description: description.endsWith('.') ? description : `${description}.`,
    },
    loc: {
      end: sourceCode.getLocFromIndex(endIndex),
      start: sourceCode.getLocFromIndex(startIndex),
    },
    messageId: 'lint',
  })
}

export const lint: Rule.RuleModule = {
  meta: {
    messages: {
      lint: ['{{ description }}', '{{ advices }}', 'See {{ biomeDocUrl }} .'].join('\n'),
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
          filePath: getValidFilePath(filepath),
        })

        for (const diagnostic of diagnostics) {
          reportBiomeDiagnostics(context, diagnostic)
        }
      },
    }
  },
}
