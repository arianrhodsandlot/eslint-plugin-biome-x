# eslint-plugin-biome-x

## Overview
ESLint + Biome = 💥 eslint-plugin-biome-x 🤯

eslint-plugin-biome-x is an ESLint plugin to integrate Biome into ESLint.

## Install
```sh
npm i eslint-plugin-biome-x
```

## Usage
We use ESM format to demonstrate the usage, but if your project does not specify `"type": "module"` in its `package.json` file, then the config file must be in CommonJS format.

### Flat config (`eslint.config.js`, require ESLint `>=8.56.0`)
```js
import eslintBiomeX from 'eslint-plugin-biome-x'

export default [
  eslintBiomeX.configs.recommended
]
```

### Legacy config (`.eslintrc.js`, deprecated since ESLint 9.0.0)
```js
export default {
  extends: ['plugin:biome-x/recommended-legacy'],
  plugins: ['biome-x'],
}
```

## Configuration
eslint-plugin-biome-x comes with a reasonable default configuration provided by Biome. If it does not fit your need, there are several methods of configuring eslint-plugin-biome-x. If you set you configuration in more than one place, they will be merged.

The structure of the configuration is listed on the [configuration reference of Biome](https://biomejs.dev/reference/configuration/).

- `biome.json`
- `biome` field in the `package.json`
- `settings` field in the ESLint config file
- Rule options

## Rules
| Name | Description |
| :-- | :-- |
| format | Enforce the code to follow the style introduced by `biome format`. |
| lint | Report errors raised by `biome lint`. |

## Credits
- [@biomejs/js-api](https://github.com/biomejs/biome/tree/main/packages/%40biomejs/js-api)
  We use this
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)

## License
[MIT](license)
