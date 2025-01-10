import { pluginName } from '../constants.ts'
import { plugin } from '../plugin.ts'

export const lint = [
  {
    name: `${pluginName}:lint`,
    plugins: { [pluginName]: plugin },
    rules: {
      [`${pluginName}/lint`]: 'error',
    },
  },
]
