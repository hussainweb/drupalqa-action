module.exports = (options, webRoot) => {
  const commandArray = ['phplint'];
  if (options.no_default_options) {
    return commandArray;
  }

  commandArray.push(`--exclude=${options.exclude ? options.exclude : 'vendor'}`);
  commandArray.push(`--extensions=${options.extensions ? options.extensions : 'php,module,theme,engine,inc'}`);
  if (options.verbose) {
    commandArray.push('-v');
  }
  if (options.path) {
    commandArray.path(options.path);
  }
  return commandArray;
};
