const core = require('@actions/core');
const { exec } = require('@actions/exec');

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

  const commonDockerOptions = [
    '--workdir', env.GITHUB_WORKSPACE,
    '--rm',
    '-e', 'CI',
    '-e', 'GITHUB_ACTION',
    '-v', '/var/run/docker.sock:/var/run/docker.sock',
    '-v', env.GITHUB_WORKSPACE + ':' + env.GITHUB_WORKSPACE,
  ];

  const phpCsCommand = ['phpcs', '--standard=phpcs.xml.dist', '--extensions=php,module,inc,install,test,profile,theme', '--ignore=/node_modules/', webRoot + '/modules/custom'];

  await exec(
    'docker',
    [ 'run', ...commonDockerOptions, dockerImage, phpCsCommand ],
  );
}

main().catch(err => {
  core.setFailed(err.message);
});
