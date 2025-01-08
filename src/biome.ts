import { Biome, type Configuration } from '@biomejs/js-api'
import module from '@biomejs/wasm-nodejs'
import { cosmiconfigSync } from 'cosmiconfig'
import { merge } from 'es-toolkit'

const moduleName = 'biome'
const searchPlaces = ['package.json', `${moduleName}.json`]

const globalConfig = cosmiconfigSync(moduleName, { searchPlaces }).search()?.config || {}
const biomeInstanceCache: Record<string, Biome> = {}

module.main()
const workspace = new module.Workspace()

function getDefaultConfig() {
  return {
    linter: {
      rules: {
        nursery: {
          recommended: false,
        },
      },
    },
  }
}

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
  const config = merge(getDefaultConfig(), merge(globalConfig, localConfig))
  biome.applyConfiguration(config)

  if (cachekey) {
    biomeInstanceCache[cachekey] = biome
  }

  return biome
}
