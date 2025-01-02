import { plugin } from '../plugin.js'

const name = 'biome-x'
export const format = [
  {
    name,
    plugins: { [name]: plugin },
    rules: {
      [`${name}/format`]: 'warn',
    },
  },
]
