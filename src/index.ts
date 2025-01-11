import { configs } from './configs/index.ts'
import { plugin } from './plugin.ts'

const eslintPluginBiomeX = { ...plugin, configs }

export default eslintPluginBiomeX
