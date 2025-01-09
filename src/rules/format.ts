import { merge } from 'es-toolkit/compat'
import type { AST, Rule } from 'eslint'
import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { getBiome } from '../biome.ts'
import { getValidFilePath } from './utils.ts'

const { DELETE, INSERT, REPLACE } = generateDifferences

function reportDifference(context: Rule.RuleContext, difference: any) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()

  const { deleteText = '', insertText = '', offset, operation } = difference
  const range: AST.Range = [offset, offset + deleteText.length]
  const start = sourceCode.getLocFromIndex(range[0])
  const end = sourceCode.getLocFromIndex(range[1])
  context.report({
    data: {
      deleteText: showInvisibles(deleteText),
      insertText: showInvisibles(insertText),
    },
    fix(fixer) {
      return fixer.replaceTextRange(range, insertText)
    },
    loc: { end, start },
    messageId: operation,
  })
}

export const format: Rule.RuleModule = {
  meta: {
    fixable: 'code',
    messages: {
      [DELETE]: 'Delete `{{ deleteText }}`',
      [INSERT]: 'Insert `{{ insertText }}`',
      [REPLACE]: 'Replace `{{ deleteText }}` with `{{ insertText }}`',
    },
    schema: [{ type: 'object' }],
    type: 'layout',
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const filepath = context.filename ?? context.getFilename()
    const sourceCodeText = sourceCode.text
    const config = merge({}, context.settings['biome-x']?.biomeConfig || {}, context.options[0] || {})
    const biome = getBiome(config)

    return {
      Program() {
        const { content: formatedText } = biome.formatContent(sourceCodeText, {
          filePath: getValidFilePath(filepath),
        })

        if (sourceCodeText === formatedText) {
          return
        }

        const differences = generateDifferences(sourceCodeText, formatedText)
        for (const difference of differences) {
          reportDifference(context, difference)
        }
      },
    }
  },
}
