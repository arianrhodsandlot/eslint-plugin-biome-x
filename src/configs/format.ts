import { plugin } from '../plugin.ts'
import { conflicts } from './conflicts.ts'

const name = 'biome-x'
export const format = {
  name: `${name}:format`,
  plugins: { [name]: plugin },
  rules: {
    [`${name}/format`]: 'warn',
    ...conflicts,
  },
}
