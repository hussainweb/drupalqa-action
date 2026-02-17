import type { PhpMdOptions } from '../types.js'

export default function phpmd(
  options: PhpMdOptions,
  webRoot: string
): string[] {
  const commandArray = ['phpmd']
  commandArray.push(options.path || `${webRoot}/modules/custom`)
  commandArray.push(options.format || 'text')
  commandArray.push(options.ruleset || 'codesize,naming,unusedcode')
  commandArray.push(
    '--suffixes',
    options.suffixes || 'php,module,theme,engine,inc'
  )
  if (options.exclude) {
    commandArray.push('--exclude', options.exclude)
  }
  return commandArray
}
