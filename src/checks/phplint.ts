export default function phplint(options: any, webRoot: string): string[] {
  const commandArray = ['phplint']
  if (options.no_default_options) {
    return commandArray
  }

  const excludeStr = options.exclude
    ? options.exclude
    : `vendor,${webRoot}/core,${webRoot}/modules/contrib`
  excludeStr.split(',').forEach((exclude: string) => {
    commandArray.push(`--exclude=${exclude}`)
  })

  const extensionsStr = options.extensions
    ? options.extensions
    : 'php,module,theme,engine,inc,install'
  extensionsStr.split(',').forEach((extension: string) => {
    commandArray.push(`--extensions=${extension}`)
  })

  if (options.verbose) {
    commandArray.push('-v')
  }
  if (options.path) {
    commandArray.push(options.path)
  }
  return commandArray
}