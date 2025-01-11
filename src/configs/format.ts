import type { Linter } from 'eslint'
import { pluginName } from '../constants.ts'
import { plugin } from '../plugin.ts'
import { conflicts } from './conflicts.ts'

export const format: Linter.Config = {
  name: `${pluginName}:format`,
  plugins: { [pluginName]: plugin },
  rules: {
    [`${pluginName}/format`]: 'warn',
    ...conflicts,
  },
}
