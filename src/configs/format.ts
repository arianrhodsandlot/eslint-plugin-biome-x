import { plugin } from '../plugin.js'
import { conflicts } from './conflicts.js'

const name = 'biome-x'
export const format = {
  name: `${name}:format`,
  plugins: { [name]: plugin },
  rules: {
    [`${name}/format`]: 'warn',
    ...conflicts,
  },
}
