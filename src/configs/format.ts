import { pluginName } from '../constants.ts'
import { plugin } from '../plugin.ts'
import { conflicts } from './conflicts.ts'

export const format = {
  name: `${pluginName}:format`,
  plugins: { [pluginName]: plugin },
  rules: {
    [`${pluginName}/format`]: 'warn',
    ...conflicts,
  },
}
