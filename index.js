const core = require('@actions/core');
const { exec } = require('@actions/exec');
const YAML = require('yaml');

const availableChecks = {
  phplint: ((options, webRoot) => {
    const commandArray = ['phplint'];
    if (options.exclude !== undefined) {
      commandArray.push('--exclude', options.exclude);
    }
    if (options.extensions !== undefined) {
      commandArray.push('--extensions', options.extensions);
    }
    if (options.verbose !== undefined && options.verbose) {
      commandArray.push('-v');
    }
    if (options.path !== undefined) {
      commandArray.path(options.path);
    }
    return commandArray;
  }),
  phpcs: ((options, webRoot) => {
    const commandArray = ['phpcs'];
    commandArray.push('--standard', options.standard !== undefined ? options.standard : 'Drupal,DrupalPractice');
    commandArray.push('--extensions', options.extensions !== undefined ? options.extensions : 'php,module,inc,install,test,profile,theme');
    if (options.ignore !== undefined) {
      commandArray.push('--ignore', options.ignore);
    }
    commandArray.push(options.path !== undefined ? options.path : webRoot + '/modules/custom');
    return commandArray;
  }),
  phpmd: ((options, webRoot) => {
    const commandArray = ['phpmd'];
    return commandArray;
  }),
};

async function main() {
  const phpVersion = core.getInput('php-version');
  if (!['7.3', '7.4', '8.0', 'latest'].includes(phpVersion)) {
    throw new Error("Invalid PHP version.");
  }
  const versionString = phpVersion == 'latest' ? 'latest' : 'php' + phpVersion;
  const dockerImage = 'hussainweb/drupalqa:' + versionString;

  const failFast = core.getInput('fail-fast');
  const webRoot = core.getInput('web-root');

  const env = { ...process.env };

  // Parse 'checks' into an array of commands.
  const inpChecks = core.getInput('checks');
  const checksCommands = [];
  if (inpChecks) {
    const checks = YAML.parse(inpChecks);
    if (typeof checks !== 'object') {
      throw new Error('checks must be a mapping of commands and options.');
    }
  }
  else {
    const checks = {
      phplint: {},
      phpcs: {},
    };
  }
  Object.entries(checks).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      throw new Error(`invalid value '${value}' for option ${key}`);
    }
    if (key in availableChecks) {
      checksCommands.push(availableChecks[key](value, webRoot));
    }
  });

  const commonDockerOptions = [
    '--workdir', env.GITHUB_WORKSPACE,
    '--rm',
    '-e', 'CI',
    '-e', 'GITHUB_ACTION',
    '-v', '/var/run/docker.sock:/var/run/docker.sock',
    '-v', env.GITHUB_WORKSPACE + ':' + env.GITHUB_WORKSPACE,
    '--tty',
  ];

  checksCommands.forEach(async (command) => {
    await exec(
      'docker',
      [ 'run', ...commonDockerOptions, dockerImage, ...command ],
    );
  });
}

main().catch(err => {
  core.setFailed(err.message);
});
