export default function phplint(options: any, webRoot: string): string[] {
  const commandArray = ['phplint']
  if (options.no_default_options) {
    return commandArray
  }

  const excludeStr = options.exclude
    ? options.exclude
    : `vendor,${webRoot}/core,${webRoot}/modules/contrib`
  for (const exclude of excludeStr.split(',')) {
    commandArray.push(`--exclude=${exclude}`)
  }

  const extensionsStr = options.extensions
    ? options.extensions
    : 'php,module,theme,engine,inc,install'
  for (const extension of extensionsStr.split(',')) {
    commandArray.push(`--extensions=${extension}`)
  }

  if (options.verbose) {
    commandArray.push('-v')
  }
  if (options.path) {
    commandArray.push(options.path)
  }
  return commandArray
}
