import {PhpStanOptions} from '../types'

export default function phpstan(
  options: PhpStanOptions,
  webRoot: string
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
