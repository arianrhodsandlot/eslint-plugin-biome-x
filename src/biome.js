import { Biome, Distribution } from '@biomejs/js-api'
import { loadConfig } from 'c12'
import { merge } from 'es-toolkit'

/** @type {Promise<import('@biomejs/js-api').Biome>} */
let biomePromise
let defaultConfigPromise
async function getBiome(inlineConfig = {}) {
  biomePromise ||= Biome.create({ distribution: Distribution.NODE })
  defaultConfigPromise ||= loadConfig({ name: 'biome', configFile: 'biome', packageJson: true })
  const [biome, defaultConfig] = await Promise.all([biomePromise, defaultConfigPromise])
  const config = merge(defaultConfig.config, inlineConfig)
  biome.applyConfiguration(config)
  return biome
}

export const biome = await getBiome()
