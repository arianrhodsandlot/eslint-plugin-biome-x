<h1 align="center">eslint-plugin-biome-x</h1>

<p align="center">
  <img src="docs/images/logo.svg">
</p>

<p align="center">
  ESLint + Biome = 💥 <code>eslint-plugin-biome-x</code> 🤯
</p>

## Overview

`eslint-plugin-biome-x` is an ESLint plugin to integrate [Biome](https://biomejs.dev/) into [ESLint](https://eslint.org/).

## Screenshot

## Motivation
Biome is considered as a replacement for ESLint and Prettier, but in real world projects, ESLint is still widely used, and there are still a lot of rules provided by ESLint and its plugins that are not available in Biome.

Certainly we could use Biome and ESLint at the same time in a project, and then we may get confused after setting up multiple lint processes for CI/Git hooks or multiple linter plugins in the editor.

Could we keep using ESLint but get unified suggestions from Biome through ESLint rules, like what eslint-plugin-prettier did for Prettier? With `eslint-plugin-biome-x`, the answer is yes.

## Install
```sh
npm i -D eslint-plugin-biome-x
```

## Usage
We use ESM format to demonstrate the usage, but if your project does not specify `"type": "module"` in its `package.json` file, then the config file must be in CommonJS format.

### Flat config ([`eslint.config.js`](https://eslint.org/docs/latest/use/configure/configuration-files), require ESLint `>=8.56.0`)
```js
import eslintBiomeX from 'eslint-plugin-biome-x'

export default [
  eslintBiomeX.configs.recommended
]
```

### Legacy config ([`.eslintrc.js`](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated), not recommended as it has been deprecated since ESLint 9.0.0)
```js
export default {
  extends: ['plugin:biome-x/recommended-legacy'],
}
```

## Configuration
`eslint-plugin-biome-x` comes with a reasonable default configuration provided by Biome, see [recommended rules of Biome](https://biomejs.dev/linter/rules/#recommended-rules).

If it does not fit your need, there are several ways of configuring `eslint-plugin-biome-x`. If you set you configuration in more than one place, they will be deeply merged.

- `biome.json` in your project's root directory
- `biome` field in the `package.json`
  ```json5
  {
    "name": "awsome-package",
    "biome": { /** your configuation goes here */ }
  }
  ```
- `settings['biome-x']` field in the ESLint config file
  ```js
  export default [{
    settings: {
      'biome-x': {
        biomeConfig: { /** your configuation goes here */ }
      }
    }
  }]
  ```
- Rule options
  ```js
  import eslintPluginBiomeX from 'eslint-plugin-biome-x'

  export default [{
    plugins: {
      'biome-x': eslintPluginBiomeX,
    }
    rules: {
      'biome-x/format': ['warn', { /** your configuation goes here */ }]
      'biome-x/lint': ['error', { /** your configuration goes here and it can be different from above */ }]
    }
  }]
  ```

The structure of the configuration can be found on [the configuration reference of Biome](https://biomejs.dev/reference/configuration/).

## Rules
💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
✅ Set in the recommended configuration.\
🔧 Automatically fixable by the --fix CLI option.

| Name | Description | 💼 | ⚠️ | 🔧 |
| :-- | :-- | :-- | :-- | :-- |
| format | Enforce the code to follow the style introduced by `biome format`. | | ✅ | 🔧 |
| lint | Report errors raised by `biome lint`. | ✅ | | |

## Settings
- `biomeConfig`

  Specifies the configuration for Biome. Its structure can be found on [the configuration reference of Biome](https://biomejs.dev/reference/configuration/).

  Example:
  ```js
  // eslint.config.js
  import eslintBiomeX from 'eslint-plugin-biome-x'

  export default [
    eslintBiomeX.configs.recommended,
    {
      settings: {
        'biome-x': {
          biomeConfig: {
            formatter: { lineWidth: 120 },
            javascript: { formatter: { quoteStyle: 'single' } },
            linter: {
              rules: {
                style: { noDefaultExport: 'error' },
                suspicious: { noConsole: { level: 'error', options: { allow: ['assert'] } } },
              },
            },
          },
        },
      },
    },
  ]
  ```

- `biomeInstance`

  Specifies the Biome instance to be used for linting if you don't want to use the bundled one. If the `biomeInstance` setting is set, the `biomeConfig` setting will be ignored, you have to handle its configuation yourself.

  Example:
  ```js
  // eslint.config.js
  import eslintBiomeX from 'eslint-plugin-biome-x'
  import { Biome } from '@biomejs/js-api'
  import module from '@biomejs/wasm-nodejs'

  const biome = await Biome.create({})
  biome.applyConfiguration({ /** your custom configuation */ })

  export default [
    eslintBiomeX.configs.recommended,
    {
      settings: {
        'biome-x': { biomeInstance: biome }
      }
    }
  ]
  ```

## Downsides
- `eslint-plugin-biome-x` uses [@biomejs/js-api](https://www.npmjs.com/package/@biomejs/js-api) under the hood, which is now a lot slower than running native Biome command.
- As of now, autofix functionality of `biome lint` is not usable when using `eslint-plugin-biome-x`. `eslint-plugin-biome-x` only reports errors raised by Biome.

## Credits
- [@biomejs/js-api](https://github.com/biomejs/biome/tree/main/packages/%40biomejs/js-api)
  We utilize the JavaScript APIs of Biome exposed by this package.
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
  The implementation of the format rule is hightly inspired by the source code of eslint-plugin-prettier.

## License
[MIT](license)
