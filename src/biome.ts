import { Biome, type Configuration } from '@biomejs/js-api'
import module from '@biomejs/wasm-nodejs'
import { cosmiconfigSync } from 'cosmiconfig'
import { merge } from 'es-toolkit'

const moduleName = 'biome'
const searchPlaces = [
  'package.json',
  `${moduleName}.json`,
  `.${moduleName}rc`,
  `.${moduleName}rc.json`,
  `.${moduleName}rc.yaml`,
  `.${moduleName}rc.yml`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.ts`,
  `.${moduleName}rc.cjs`,
  `.config/${moduleName}rc`,
  `.config/${moduleName}rc.json`,
  `.config/${moduleName}rc.yaml`,
  `.config/${moduleName}rc.yml`,
  `.config/${moduleName}rc.js`,
  `.config/${moduleName}rc.ts`,
  `.config/${moduleName}rc.cjs`,
  `${moduleName}.config.js`,
  `${moduleName}.config.ts`,
  `${moduleName}.config.cjs`,
]

const globalConfig = cosmiconfigSync(moduleName, { searchPlaces }).search()?.config || {}
const biomeInstanceCache = {}

module.main()
const workspace = new module.Workspace()

export function getBiome(localConfig: Configuration = {}) {
  let cachekey = ''
  try {
    cachekey = JSON.stringify(localConfig)
    if (cachekey in biomeInstanceCache) {
      return biomeInstanceCache[cachekey]
    }
  } catch {}

  // @ts-expect-error This is the only way to create a Biome instance synchronously
  const biome: Biome = new Biome(module, workspace)
  biome.registerProjectFolder()
  const config = merge(globalConfig, localConfig)
  biome.applyConfiguration(config)

  if (cachekey) {
    biomeInstanceCache[cachekey] = biome
  }

  return biome
}
