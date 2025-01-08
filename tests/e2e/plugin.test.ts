import assert from 'node:assert'
import { describe, test } from 'node:test'
import { $, cd, fs, path } from 'zx'

const directories = ['files-biome', 'files-eslint']

async function runBiome(path: string) {
  let fixed = false
  let retry = 10
  while (!fixed && retry) {
    const { stdout } = await $`biome format ${path} --write`
    fixed = stdout.includes('No fixes')
    retry -= 1
  }
}

async function runESLint(path: string) {
  await $`eslint ${path} --fix -c eslint.config.js`
}

describe('format', () => {
  test.beforeEach(async () => {
    cd(import.meta.dirname)

    await Promise.all(
      directories.map(async (directory) => {
        await $`rm -rf ${directory}`
        await $`cp -R files ${directory}`
      }),
    )
  })

  test('test', async () => {
    await Promise.allSettled([runBiome('files-biome'), runESLint('files-eslint')])
    for (const fileName of await fs.readdir('files-biome')) {
      const [biomeFile, eslintFile] = await Promise.all(
        directories.map((directory) => fs.readFile(path.join(directory, fileName), 'utf8')),
      )
      assert.equal(eslintFile, biomeFile)
    }
  })

  test.afterEach(async () => {
    await Promise.all(directories.map((directory) => $`rm -rf ${directory}`))
  })
})
