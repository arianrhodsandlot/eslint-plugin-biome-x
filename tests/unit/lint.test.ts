import { describe, test } from 'node:test'
import { RuleTester } from 'eslint'
import plugin from '../../src/index.ts'

const ruleTester = new RuleTester()

describe('lint', () => {
  test('lint', () => {
    ruleTester.run('lint', plugin.rules.lint, {
      valid: [
        {
          code: 'const boolean = true; console.info(boolean)',
        },
      ],

      invalid: [
        {
          code: 'var boolean = true; console.info(boolean)',
          errors: [{ column: 1, endColumn: 19, endLine: 1, line: 1, messageId: 'lint' }],
        },

        // non ascii code
        {
          code: `
var a = 'の'

var b = '😁😁😁 😁😁😁'; '😁'

console.log(1)

    var c = '😁😁😁の😁😁😁';   console.log(1)

          `,
          errors: [
            { column: 1, endColumn: 12, endLine: 2, line: 2, messageId: 'lint' },
            { column: 1, endColumn: 24, endLine: 4, line: 4, messageId: 'lint' },
            { column: 5, endColumn: 28, endLine: 8, line: 8, messageId: 'lint' },
          ],
        },
      ],
    })
  })
})
