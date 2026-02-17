import type { GrumPHPOptions } from '../types.js'

export default function grumphp(
  options: GrumPHPOptions,
  _webRoot: string
): string[] {
  const commandArray = ['grumphp', 'run', '--no-interaction']
  if (options.testsuite !== undefined) {
    commandArray.push(`--testsuite=${options.testsuite}`)
  }
  if (options.tasks !== undefined) {
    commandArray.push(`--tasks=${options.tasks.join(',')}`)
  }
  return commandArray
}
