import type { PhpCsOptions } from '../types.js'

export default function phpcs(
  options: PhpCsOptions,
  webRoot: string
): string[] {
  const commandArray = ['phpcs']
  commandArray.push(
    `--standard=${
      options.standard !== undefined
        ? options.standard
        : 'Drupal,DrupalPractice'
    }`
  )
  commandArray.push(
    `--extensions=${
      options.extensions !== undefined
        ? options.extensions
        : 'php,module,inc,install,test,profile,theme'
    }`
  )
  if (options.ignore !== undefined) {
    commandArray.push(`--ignore=${options.ignore}`)
  }

  const pathStr = options.path || `${webRoot}/modules/custom`
  for (const path of pathStr.split(',')) {
    commandArray.push(path)
  }
  return commandArray
}
