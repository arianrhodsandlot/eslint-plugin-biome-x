import { pluginName } from '../constants.ts'
import { conflicts } from './conflicts.ts'

export const recommendedLegacy = {
  extends: [pluginName],
  plugins: [pluginName],
  rules: {
    [`${pluginName}/format`]: 'warn',
    [`${pluginName}/lint`]: 'error',
    ...conflicts,
  },
}
