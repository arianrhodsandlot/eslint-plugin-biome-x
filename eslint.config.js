import { createConfig } from '@arianrhodsandlot/eslint-config'
import eslintPlugin from 'eslint-plugin-eslint-plugin'

export default createConfig({
  append: [{ ignores: ['tests/e2e/files/'] }, eslintPlugin.configs?.['flat/recommended']],
})
