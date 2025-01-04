import { describe, test } from 'node:test'
import { RuleTester } from 'eslint'
import plugin from '../../src/index.ts'

const ruleTester = new RuleTester()

describe('format', function () {
  test('format', () => {
    ruleTester.run('format', plugin.rules.format, {
      valid: [
        {
          code: 'var boolean = true;\n',
        },
      ],

      invalid: [
        {
          code: 'var boolean =  true',
          errors: [{ message: 'Replace `·true` with `true;⏎`' }],
          output: 'var boolean = true;\n',
        },
      ],
    })
  })
})
