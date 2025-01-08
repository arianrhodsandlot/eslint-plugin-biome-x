import type { Diagnostic } from '@biomejs/js-api'
import { kebabCase, last, merge } from 'es-toolkit'
import type { Rule } from 'eslint'
import { getBiome } from '../biome.ts'
import { getValidFilePath } from './utils.ts'

function reportBiomeDiagnostics(context: Rule.RuleContext, diagnostic: Diagnostic) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()

  const { category, description, location } = diagnostic
  if (!(category && location.span)) {
    return
  }

  const ruleName = last(category.split('/'))
  if (!ruleName) {
    return
  }

  const [startIndex, endIndex] = location.span
  const advices = diagnostic.advices.advices
    .filter((advice) => 'log' in advice)
    .flatMap((advice) => advice.log[1].map(({ content }) => content))
    .join(' ')
  context.report({
    data: {
      advices,
      biomeDocUrl: `https://biomejs.dev/linter/rules/${kebabCase(ruleName)}`,
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
      lint: ['{{ description }}', '{{ advices }}', 'See {{ biomeDocUrl }} .']
        .join(process.env.VSCODE_PID ? '\n' : ' ')
        .replaceAll(/\s+/g, ' '),
    },
    schema: [{ type: 'object' }],
    type: 'problem',
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const filepath = context.filename ?? context.getFilename()
    const sourceCodeText = sourceCode.text
    const config = merge(merge({}, context.settings.biome || {}), context.options[0] || {})
    const biome = getBiome(config)

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
