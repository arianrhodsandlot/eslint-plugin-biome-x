import { plugin } from '../plugin.ts'

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
