import path from 'node:path'

export function getValidFilePath(filePath: string) {
  return path.extname(filePath) ? filePath : `${filePath}.js`
}
