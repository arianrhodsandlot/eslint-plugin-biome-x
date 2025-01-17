import type { Linter } from 'eslint'
import { pluginName } from '../constants.ts'
import { plugin } from '../plugin.ts'
import { conflicts } from './conflicts.ts'

export const recommended: Linter.Config = {
  languageOptions: {
    ecmaVersion: 'latest',
    parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
    sourceType: 'module',
  },
  name: `${pluginName}:recommended`,
  plugins: { [pluginName]: plugin },
  rules: {
    [`${pluginName}/format`]: 'warn',
    [`${pluginName}/lint`]: 'error',
    ...conflicts,
  },
}
