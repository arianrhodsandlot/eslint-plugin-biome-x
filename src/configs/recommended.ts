import { plugin } from '../plugin.js'
import { conflicts } from './conflicts.js'

const name = 'biome-x'
export const recommended = {
  name: `${name}:recommended`,
  plugins: { [name]: plugin },
  rules: {
    [`${name}/format`]: 'warn',
    [`${name}/lint`]: 'error',
    ...conflicts,
  },
}
