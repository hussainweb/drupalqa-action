module.exports = ((options, webRoot) => {
  const commandArray = ['phpmd'];
  commandArray.push(options.path ? options.path : webRoot + '/modules/custom');
  commandArray.push(options.format ? options.format : 'text');
  commandArray.push(options.ruleset ? options.ruleset : 'codesize,naming,unusedcode');
  commandArray.push('--suffixes', options.suffixes ? options.suffixes : 'php,module,theme,engine,inc');
  if (options.exclude) {
    commandArray.push('--exclude', options.exclude);
  }
  return commandArray;
});
