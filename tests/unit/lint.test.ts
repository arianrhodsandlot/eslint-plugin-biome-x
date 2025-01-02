import { describe, test } from 'node:test'
import { RuleTester } from 'eslint'
import plugin from '../../src/index.js'

const ruleTester = new RuleTester()

describe('lint', function () {
  test('lint', () => {
    ruleTester.run('lint', plugin.rules.lint, {
      valid: [
        {
          code: 'const boolean = true; console.info(boolean)',
        },
      ],

      invalid: [
        {
          code: 'var boolean =  true',
          errors: [
            { message: 'Use let or const instead of var. See https://biomejs.dev/linter/rules/no-var .' },
            { message: 'This variable is unused. See https://biomejs.dev/linter/rules/no-unused-variables .' },
          ],
        },
      ],
    })
  })
})
