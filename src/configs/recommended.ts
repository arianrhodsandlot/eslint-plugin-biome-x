import { plugin } from '../plugin.js'

const name = 'biome-x'
export const recommended = [
  {
    name,
    plugins: { [name]: plugin },
    rules: {
      [`${name}/format`]: 'warn',
      [`${name}/lint`]: 'error',
    },
  },
]
