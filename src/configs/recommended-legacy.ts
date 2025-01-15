import type { Linter } from 'eslint'
import { pluginName } from '../constants.ts'
import { conflicts } from './conflicts.ts'

export const recommendedLegacy: Linter.LegacyConfig = {
  plugins: [pluginName],
  rules: {
    [`${pluginName}/format`]: 'warn',
    [`${pluginName}/lint`]: 'error',
    ...conflicts,
  },
}
