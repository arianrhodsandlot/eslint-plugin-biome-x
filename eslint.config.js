import { createConfig } from '@arianrhodsandlot/eslint-config'
import eslintPlugin from 'eslint-plugin-eslint-plugin'

export default createConfig({
  append: eslintPlugin.configs?.['flat/recommended'],
})
