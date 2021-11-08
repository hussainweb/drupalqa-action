module.exports = (options, webRoot) => {
  const commandArray = ["phpcs"];
  commandArray.push(
    `--standard=${
      options.standard !== undefined
        ? options.standard
        : "Drupal,DrupalPractice"
    }`
  );
  commandArray.push(
    `--extensions=${
      options.extensions !== undefined
        ? options.extensions
        : "php,module,inc,install,test,profile,theme"
    }`
  );
  if (options.ignore !== undefined) {
    commandArray.push(`--ignore=${options.ignore}`);
  }
  commandArray.push(
    options.path !== undefined ? options.path : webRoot + "/modules/custom"
  );
  return commandArray;
};
