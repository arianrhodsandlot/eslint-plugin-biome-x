import type { AST, Rule } from 'eslint'
import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { getBiome } from '../biome.ts'
import { pluginName } from '../constants.ts'
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

    const biome = getBiome(context.settings[pluginName], context.options)

    return {
      Program() {
        const { content: formatedText } = biome.formatContent(sourceCode.text, {
          filePath: getValidFilePath(filepath),
        })

        if (sourceCode.text === formatedText) {
          return
        }

        const differences = generateDifferences(sourceCode.text, formatedText)
        for (const difference of differences) {
          reportDifference(context, difference)
        }
      },
    }
  },
}
