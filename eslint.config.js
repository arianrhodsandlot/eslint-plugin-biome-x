import { createConfig } from '@arianrhodsandlot/eslint-config'
// import eslintPlugin from 'eslint-plugin-eslint-plugin'
import biomePlugin from './src/index.js'

const x = 1
console.info(x == 1)
export default createConfig({
  rules: {
    'no-unused-vars': 'off'
  },
  // append: eslintPlugin.configs?.['flat/recommended'],
  append: biomePlugin.configs.recommended,
  n: false,
  prettier: false,
  perfectionist: false,
  sonar: false,
})
