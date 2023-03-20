const core = require("@actions/core");
const { exec } = require("@actions/exec");
const YAML = require("yaml");

const availableChecks = {
  phplint: require("./checks/phplint"),
  phpcs: require("./checks/phpcs"),
  phpmd: require("./checks/phpmd"),
};

async function main() {
  const phpVersion = core.getInput("php-version");
  if (!["7.3", "7.4", "8.0", "8.1", "8.2", "latest"].includes(phpVersion)) {
    throw new Error("Invalid PHP version.");
  }

  const registry = core.getInput("registry");
  if (!["ghcr", "dockerhub"].includes(registry)) {
    throw new Error("Invalid registry. Can only be 'ghcr' or 'dockerhub'.");
  }

  const versionString = phpVersion == "latest" ? "latest" : "php" + phpVersion;
  const dockerImage =
    (registry == "ghcr" ? "ghcr.io/" : "") +
    "hussainweb/drupalqa:" +
    versionString;

  const webRoot = core.getInput("web-root");

  const env = { ...process.env };

  // Parse 'checks' into an array of commands.
  const inpChecks = core.getInput("checks");
  const checksCommands = [];
  let checks = {
    phplint: {},
    phpcs: {},
  };
  if (inpChecks) {
    checks = YAML.parse(inpChecks);
    if (typeof checks !== "object") {
      throw new Error("checks must be a mapping of commands and options.");
    }
  }
  Object.entries(checks).forEach(([key, value]) => {
    if (typeof value !== "object") {
      throw new Error(`invalid value '${value}' for option ${key}`);
    }
    if (key in availableChecks) {
      checksCommands.push(availableChecks[key](value, webRoot));
    } else {
      throw new Error(`invalid check ${key} specified.`);
    }
  });

  // Pull the image first (and collapse the output)
  core.startGroup("Pull Docker image");
  await exec("docker", ["pull", dockerImage]);
  core.endGroup();

  const commonDockerOptions = [];
  commonDockerOptions.push("--workdir", env.GITHUB_WORKSPACE);
  commonDockerOptions.push("--rm");
  commonDockerOptions.push("--init");
  commonDockerOptions.push("--tty");
  commonDockerOptions.push("-v", "/var/run/docker.sock:/var/run/docker.sock");
  commonDockerOptions.push(
    "-v",
    env.GITHUB_WORKSPACE + ":" + env.GITHUB_WORKSPACE
  );

  for (const command of checksCommands) {
    core.startGroup(`Running ${command.join(" ")}`);
    await exec("docker", [
      "run",
      ...commonDockerOptions,
      dockerImage,
      ...command,
    ]);
    core.endGroup();
  }
}

main().catch((err) => {
  core.setFailed("drupalqa: " + err.message);
});
