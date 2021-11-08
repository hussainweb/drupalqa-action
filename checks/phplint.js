module.exports = (options, webRoot) => {
  const commandArray = ['phplint'];
  if (options.no_default_options) {
    return commandArray;
  }

  const excludeStr = options.exclude;
  if (!excludeStr) {
    excludeStr = `vendor,${webRoot}/core,${webRoot}/module/contrib`;
  }
  excludeStr.split(',').forEach((exclude) => {
    commandArray.push(`--exclude=${exclude}`);
  })

  commandArray.push(`--extensions=${options.extensions ? options.extensions : 'php,module,theme,engine,inc'}`);
  if (options.verbose) {
    commandArray.push('-v');
  }
  if (options.path) {
    commandArray.path(options.path);
  }
  return commandArray;
};
