import { GrumPHPOptions } from '../types'

export default function grumphp(
  options: GrumPHPOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webRoot: string
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
