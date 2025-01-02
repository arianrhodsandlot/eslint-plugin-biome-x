import { Biome, Distribution } from '@biomejs/js-api'
import { loadConfig } from 'c12'
import { merge } from 'es-toolkit'

let biomePromise: Promise<Biome>
let defaultConfigPromise: ReturnType<typeof loadConfig>
async function getBiome(inlineConfig = {}) {
  biomePromise ||= Biome.create({ distribution: Distribution.NODE })
  defaultConfigPromise ||= loadConfig({ configFile: 'biome', name: 'biome', packageJson: true })
  const [biome, defaultConfig] = await Promise.all([biomePromise, defaultConfigPromise])
  const config = merge(defaultConfig.config, inlineConfig)
  biome.applyConfiguration(config)
  return biome
}

export const biome = await getBiome()
