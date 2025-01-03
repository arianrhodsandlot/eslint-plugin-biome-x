import { plugin } from '../plugin.js'

const name = 'biome-x'
export const lint = [
  {
    name: `${name}:lint`,
    plugins: { [name]: plugin },
    rules: {
      [`${name}/lint`]: 'error',
    },
  },
]
