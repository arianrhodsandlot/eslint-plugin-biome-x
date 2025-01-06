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
          errors: [
            {
              column: 1,
              messageId: 'lint',
            },
          ],
        },
      ],
    })
  })
})
