import type { Linter } from 'eslint'
import { pluginName } from '../constants.ts'
import { plugin } from '../plugin.ts'

export const lint: Linter.Config = {
  name: `${pluginName}:lint`,
  plugins: { [pluginName]: plugin },
  rules: {
    [`${pluginName}/lint`]: 'error',
  },
}
