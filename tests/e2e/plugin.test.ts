import assert from 'node:assert'
import { describe, test } from 'node:test'
import { $, cd, fs, globby, path } from 'zx'

const $$ = $({ quiet: true })

const directories = ['files-eslint', 'files-biome']

async function runBiomeFormat(path: string) {
  let fixed = false
  let retry = 10
  while (!fixed && retry) {
    const { stdout } = await $`biome format ${path} --write`
    fixed = stdout.includes('No fixes')
    retry -= 1
  }
}

describe('plugin', () => {
  test.before(async () => {
    cd(import.meta.dirname)
    const files = await globby('files/*')
    const testFileUrls = [
      'https://cdn.jsdelivr.net/npm/lodash@latest/core.js',
      'https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.js',
      'https://cdn.jsdelivr.net/npm/react@latest/cjs/react.production.js',
      'https://cdn.jsdelivr.net/npm/nostalgist@latest/dist/nostalgist.umd.js',
    ]
    if (files.length !== testFileUrls.length) {
      cd(import.meta.dirname)
      await $`mkdir -p files`
      cd('files')
      await Promise.all(testFileUrls.map((url) => $`curl ${url} -O`))
    }
  })

  test.beforeEach(async () => {
    cd(import.meta.dirname)

    await Promise.all(
      directories.map(async (directory) => {
        await $`rm -rf ${directory}`
        await $`cp -R files ${directory}`
      }),
    )
  })

  test('autofix format issues', async () => {
    await Promise.allSettled([$`eslint files-eslint --fix -c eslint.config.js`, runBiomeFormat('files-biome')])
    for (const fileName of await fs.readdir('files-eslint')) {
      const [eslintFile, biomeFile] = await Promise.all(
        directories.map((directory) => fs.readFile(path.join(directory, fileName), 'utf8')),
      )
      assert.strictEqual(eslintFile, biomeFile, new Error(`Expect results of ${fileName} to be equal`))
    }
  })

  test('print lint errors', async () => {
    const [eslintResults, biomeResults] = await Promise.allSettled([
      $$`eslint files-eslint -c eslint.config.js --quiet --no-inline-config`,
      $$`biome lint files-biome --max-diagnostics=none`,
    ])
    assert.ok('reason' in eslintResults && 'reason' in biomeResults)
    const [, eslintProblemsCount] = eslintResults.reason.stdout.match(/✖ (\d+) problems/) || []
    const [, biomeProblemsCount] = biomeResults.reason.stdout.match(/Found (\d+) error/) || []
    assert.strictEqual(eslintProblemsCount, biomeProblemsCount)
  })

  test.afterEach(async () => {
    await Promise.all(directories.map((directory) => $`rm -rf ${directory}`))
  })
})
