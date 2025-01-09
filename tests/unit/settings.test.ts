import { describe, test } from 'node:test'
import { RuleTester } from 'eslint'
import plugin from '../../src/index.ts'

const ruleTester = new RuleTester()

describe('settings', () => {
  test('settings', () => {
    ruleTester.run('format', plugin.rules.format, {
      valid: [
        {
          code: 'var boolean = true;\n',
          settings: { 'biome-x': { biomeConfig: { javascript: { formatter: { semicolons: 'always' } } } } },
        },
        {
          code: 'var boolean = true\n',
          settings: { 'biome-x': { biomeConfig: { javascript: { formatter: { semicolons: 'asNeeded' } } } } },
        },
      ],

      invalid: [
        {
          code: 'var boolean =  true\n',
          errors: [{ message: 'Replace `·true` with `true;`' }],
          output: 'var boolean = true;\n',
          settings: { 'biome-x': { biomeConfig: { javascript: { formatter: { semicolons: 'always' } } } } },
        },
        {
          code: 'var boolean =  true;\n',
          errors: [{ message: 'Replace `·true;` with `true`' }],
          output: 'var boolean = true\n',
          settings: { 'biome-x': { biomeConfig: { javascript: { formatter: { semicolons: 'asNeeded' } } } } },
        },
      ],
    })
  })
})
