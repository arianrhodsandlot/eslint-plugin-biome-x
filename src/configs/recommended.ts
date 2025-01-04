import { plugin } from '../plugin.ts'
import { conflicts } from './conflicts.ts'

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
