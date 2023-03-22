module.exports = (options, webRoot) => {
  const commandArray = ["phplint"];
  if (options.no_default_options) {
    return commandArray;
  }

  const excludeStr = options.exclude
    ? options.exclude
    : `vendor,${webRoot}/core,${webRoot}/modules/contrib`;
  excludeStr.split(",").forEach((exclude) => {
    commandArray.push(`--exclude=${exclude}`);
  });

  const extensionsStr = options.extensions
    ? options.extensions
    : "php,module,theme,engine,inc,install";
  extensionsStr.split(",").forEach((extension) => {
    commandArray.push(`--extensions=${extension}`);
  });

  if (options.verbose) {
    commandArray.push("-v");
  }
  if (options.path) {
    commandArray.push(options.path);
  }
  return commandArray;
};
