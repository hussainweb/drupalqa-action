import type { PhpStanOptions } from '../types.js'

export default function phpstan(
  options: PhpStanOptions,
  _webRoot: string
): string[] {
  const commandArray = ['phpstan']
  if (options.configuration !== undefined) {
    commandArray.push(`--configuration ${options.configuration}`)
  }
  if (options.paths !== undefined) {
    commandArray.unshift(...options.paths)
  }
  return commandArray
}
