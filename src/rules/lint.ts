import type { Diagnostic } from '@biomejs/js-api'
import { kebabCase, last } from 'es-toolkit'
import type { Rule } from 'eslint'
import { getBiome } from '../biome.ts'
import { pluginName } from '../constants.ts'
import { getValidFilePath } from './utils.ts'

const spacer = process.env.VSCODE_PID ? '\n' : ' '

function defaultDiagnosticFormatter(diagnostic: Diagnostic) {
  if (!diagnostic.category) {
    throw new Error('Invalid diagnostic')
  }
  const ruleName = last(diagnostic.category.split('/'))
  if (!ruleName) {
    throw new Error('Invalid diagnostic')
  }

  const advices = diagnostic.advices.advices
    .filter((advice) => 'log' in advice)
    .map((advice) => advice.log[1].map(({ content }) => content).join(''))
    .join(spacer)
  const biomeDocUrl = `https://biomejs.dev/linter/rules/${kebabCase(ruleName)}`
  const message = [diagnostic.description, advices, `See ${biomeDocUrl} for more explanation.`].join(spacer)
  return message
}

function reportBiomeDiagnostic(context: Rule.RuleContext, diagnostic: Diagnostic) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()

  const { category, location } = diagnostic
  if (!(category && location.span)) {
    return
  }

  const formatDiagnostics = context.settings[pluginName]?.diagnosticFormatter || defaultDiagnosticFormatter
  const message = formatDiagnostics(diagnostic)
  const [start, end] = location.span.map((index) => sourceCode.getLocFromIndex(index))
  context.report({
    data: { message },
    loc: { end, start },
    messageId: 'lint',
  })
}

export const lint: Rule.RuleModule = {
  meta: {
    messages: { lint: '{{ message }}' },
    schema: [{ type: 'object' }],
    type: 'problem',
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const filepath = context.filename ?? context.getFilename()

    const biome = getBiome(context.settings[pluginName], context.options)

    return {
      Program() {
        const { diagnostics } = biome.lintContent(sourceCode.text, {
          filePath: getValidFilePath(filepath),
        })

        for (const diagnostic of diagnostics) {
          reportBiomeDiagnostic(context, diagnostic)
        }
      },
    }
  },
}
