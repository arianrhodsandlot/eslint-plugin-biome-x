import type { Linter } from 'eslint'
import eslintConfigPretter from 'eslint-config-prettier'

export const conflicts: Linter.RulesRecord = {
  ...eslintConfigPretter.rules,
  'prettier/prettier': 'off',
}
