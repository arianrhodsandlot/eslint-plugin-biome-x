import type { Diagnostic } from '@biomejs/js-api'
import { kebabCase, last } from 'es-toolkit'
import type { Rule } from 'eslint'
import { getBiome } from '../biome.ts'
import { pluginName } from '../constants.ts'
import { getValidFilePath } from './utils.ts'

const spacer = process.env.VSCODE_PID ? '\n' : ' '
const textEncoder = new TextEncoder()

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

function reportBiomeDiagnostic(context: Rule.RuleContext, diagnostic: Diagnostic, indeciesMap) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()

  const { category, location } = diagnostic
  if (!(category && location.span)) {
    return
  }

  if (location.span.some((biomeIndex) => !(`${biomeIndex}` in indeciesMap))) {
    return
  }

  const setting: any = context.settings[pluginName]
  const formatDiagnostics = setting?.diagnosticFormatter || defaultDiagnosticFormatter
  const message = formatDiagnostics(diagnostic)
  const [start, end] = location.span.map((biomeIndex) => sourceCode.getLocFromIndex(indeciesMap[biomeIndex]))

  context.report({
    data: { message },
    loc: { end, start },
    messageId: 'lint',
  })
}

function buildIndeciesMap(text: string) {
  const charMaps: { biomeIndicies: number[]; eslintIndices: number[] }[] = []
  let eslintIndex = 0
  let biomeIndex = 0
  const textArray = [...text]
  for (const char of textArray) {
    const bytes = textEncoder.encode(char)
    const map: { biomeIndicies: number[]; eslintIndices: number[] } = { biomeIndicies: [], eslintIndices: [] }
    charMaps.push(map)
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < char.length; i += 1) {
      map.eslintIndices.push(eslintIndex)
      eslintIndex += 1
    }
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < bytes.length; i += 1) {
      map.biomeIndicies.push(biomeIndex)
      biomeIndex += 1
    }
  }

  const indeciesMap = {}
  for (const {
    biomeIndicies,
    eslintIndices: [eslintIndex],
  } of charMaps) {
    for (const biomeIndex of biomeIndicies) {
      indeciesMap[biomeIndex] = eslintIndex
    }
  }
  return indeciesMap
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

    const setting: any = context.settings[pluginName]
    const { biome, projectKey } = getBiome(setting, context.options)

    return {
      Program() {
        const indeciesMap = buildIndeciesMap(sourceCode.text)
        const { diagnostics } = biome.lintContent(projectKey, sourceCode.text, {
          filePath: getValidFilePath(filepath),
        })

        for (const diagnostic of diagnostics) {
          reportBiomeDiagnostic(context, diagnostic, indeciesMap)
        }
      },
    }
  },
}
