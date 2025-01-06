import assert from 'node:assert'
import { describe, test } from 'node:test'
import { $, cd, fs, path } from 'zx'

describe('format', () => {
  test('test', async () => {
    cd(import.meta.dirname)

    const directories = ['files-biome', 'files-eslint']
    await Promise.all(
      directories.map(async (directory) => {
        await $`rm -rf ${directory}`
        await $`cp -R files ${directory}`
      }),
    )
    await Promise.allSettled([$`biome format files-biome --write`, $`eslint files-eslint --fix -c eslint.config.js`])
    for (const fileName of await fs.readdir('files-biome')) {
      const [biomeFile, eslintFile] = await Promise.all(
        directories.map((directory) => fs.readFile(path.join(directory, fileName), 'utf8')),
      )
      assert.equal(biomeFile, eslintFile)
    }
  })
})
