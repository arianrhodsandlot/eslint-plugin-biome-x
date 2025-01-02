import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { biome } from '../biome.js'

const { DELETE, INSERT, REPLACE } = generateDifferences

function reportDifference(context, difference) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()

  const { deleteText = '', insertText = '', offset, operation } = difference
  const range = [offset, offset + deleteText.length]
  const [start, end] = range.map((index) => sourceCode.getLocFromIndex(index))
  context.report({
    data: {
      deleteText: showInvisibles(deleteText),
      insertText: showInvisibles(insertText),
    },
    fix(fixer) {
      fixer.replaceTextRange(range, insertText)
    },
    loc: { end, start },
    messageId: operation,
  })
}

/** @type {import('eslint').Rule.RuleModule} */
export const format = {
  meta: {
    fixable: 'code',
    messages: {
      [DELETE]: 'Delete `{{ deleteText }}`',
      [INSERT]: 'Insert `{{ insertText }}`',
      [REPLACE]: 'Replace `{{ deleteText }}` with `{{ insertText }}`',
    },
    schema: [],
    type: 'layout',
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const filepath = context.filename ?? context.getFilename()
    const sourceCodeText = sourceCode.text

    return {
      Program() {
        const { content: formatedText } = biome.formatContent(sourceCodeText, {
          filePath: filepath.endsWith('.js') ? filepath : 'file.js',
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
