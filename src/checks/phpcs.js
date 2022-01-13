export default function (options, webRoot) {
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

  const pathStr = options.path ? options.path : webRoot + "/modules/custom";
  pathStr.split(",").forEach((path) => {
    commandArray.push(path);
  });
  return commandArray;
}
