import { Biome, type Configuration } from '@biomejs/js-api/nodejs'
import { cosmiconfigSync } from 'cosmiconfig'
import { merge } from 'es-toolkit/compat'

const moduleName = 'biome'
const searchPlaces = ['package.json', `${moduleName}.json`]

const globalConfig = cosmiconfigSync(moduleName, { searchPlaces }).search()?.config || {}
const biomeInstanceCache: Record<string, { biome: Biome; projectKey: number }> = {}

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

let settingsBiomeInstance: { biome: Biome; projectKey: number } | undefined
export function getBiome(
  eslintSetting: { biomeConfig?: Configuration; biomeInstance?: Biome } = {},
  eslintRuleOptions: any[] = [],
) {
  if (eslintSetting.biomeInstance) {
    if (settingsBiomeInstance) {
      return settingsBiomeInstance
    }
    const { projectKey } = eslintSetting.biomeInstance.openProject()
    settingsBiomeInstance = { biome: eslintSetting.biomeInstance, projectKey }
    return settingsBiomeInstance
  }

  const [inlineConfig] = eslintRuleOptions
  const localConfig = merge({}, eslintSetting.biomeConfig, inlineConfig)

  let cachekey = ''
  try {
    cachekey = JSON.stringify(localConfig)
    if (cachekey in biomeInstanceCache) {
      return biomeInstanceCache[cachekey]
    }
  } catch {}

  const biome: Biome = new Biome()
  const { projectKey } = biome.openProject()
  const config = merge(getDefaultConfig(), globalConfig, localConfig)
  biome.applyConfiguration(projectKey, config)

  if (cachekey) {
    biomeInstanceCache[cachekey] = { biome, projectKey }
  }
  return biomeInstanceCache[cachekey]
}
