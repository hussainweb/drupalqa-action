import {GrumPHPOptions} from '../types'

export default function phpmd(
  options: GrumPHPOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webRoot: string
): string[] {
  const commandArray = ['grumphp', 'run']
  if (options.testsuite !== undefined) {
    commandArray.push(`--testsuite=${options.testsuite}`)
  }
  if (options.tasks !== undefined) {
    commandArray.push(`--tasks=${options.tasks.join(',')}`)
  }
  return commandArray
}
