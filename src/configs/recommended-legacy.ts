import type { Linter } from 'eslint'
import { pluginName } from '../constants.ts'
import { conflicts } from './conflicts.ts'

export const recommendedLegacy: Linter.LegacyConfig = {
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: [pluginName],
  rules: {
    [`${pluginName}/format`]: 'warn',
    [`${pluginName}/lint`]: 'error',
    ...conflicts,
  },
}
