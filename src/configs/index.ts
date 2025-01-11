import { format } from './format.ts'
import { lint } from './lint.ts'
import { recommendedLegacy } from './recommended-legacy.ts'
import { recommended } from './recommended.ts'

export const configs = {
  format,
  lint,
  recommended,
  'recommended-legacy': recommendedLegacy,
}
