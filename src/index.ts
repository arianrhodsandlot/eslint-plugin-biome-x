import type { ESLint } from 'eslint'
import { configs } from './configs/index.ts'
import { plugin } from './plugin.ts'

const eslintPluginBiomeX = { ...plugin, configs } satisfies ESLint.Plugin

export default eslintPluginBiomeX
