import eslintConfigPretter from 'eslint-config-prettier'

export const conflicts = {
  ...eslintConfigPretter.rules,
  'prettier/prettier': 'off',
}
