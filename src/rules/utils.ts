import path from 'node:path'

export function getValidFilePath(filePath) {
  return path.extname(filePath) ? filePath : `${filePath}.js`
}
