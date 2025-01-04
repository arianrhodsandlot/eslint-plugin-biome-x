import { describe, test } from 'node:test'
import { RuleTester } from 'eslint'
import plugin from '../../src/index.ts'

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
          code: 'var boolean = true; console.info(boolean)',
          errors: [
            {
              message:
                'Use let or const instead of var.\n' +
                'A variable declared with \n' +
                'var\n' +
                ' is accessible in the whole module. Thus, the variable can be accessed before its initialization and outside the block where it is declared.\n' +
                'See \n' +
                'MDN web docs\n' +
                ' for more details.\n' +
                "Unsafe fix: Use '\n" +
                'const\n' +
                "' instead.\n" +
                'See https://biomejs.dev/linter/rules/no-var .',
            },
          ],
        },
      ],
    })
  })
})
