import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as YAML from 'yaml'

import {CheckCallable} from './types'

import grumphp from './checks/grumphp'
import phplint from './checks/phplint'
import phpcs from './checks/phpcs'
import phpmd from './checks/phpmd'
import phpstan from './checks/phpstan'

const availableChecks: {
  [key: string]: CheckCallable
} = {
  grumphp,
  phplint,
  phpcs,
  phpmd,
  phpstan
}

async function run(): Promise<void> {
  const phpVersion = core.getInput('php-version')
  if (
    !['7.3', '7.4', '8.0', '8.1', '8.2', '8.3', 'latest'].includes(phpVersion)
  ) {
    throw new Error('Invalid PHP version.')
  }

  const registry = core.getInput('registry')
  if (!['ghcr', 'dockerhub'].includes(registry)) {
    throw new Error("Invalid registry. Can only be 'ghcr' or 'dockerhub'.")
  }

  const versionString = phpVersion === 'latest' ? 'latest' : `php${phpVersion}`
  const registryPrefix = registry === 'ghcr' ? 'ghcr.io/' : ''
  const dockerImage = `${registryPrefix}hussainweb/drupalqa:${versionString}`

  const webRoot = core.getInput('web-root')

  const env = {...process.env}
  const githubWorkspace = env.GITHUB_WORKSPACE as string

  // Parse 'checks' into an array of commands.
  const inpChecks = core.getInput('checks')
  const checksCommands: string[][] = []
  let checks = {
    phplint: {},
    phpcs: {}
  }
  if (inpChecks) {
    checks = YAML.parse(inpChecks)
    if (typeof checks !== 'object') {
      throw new Error('checks must be a mapping of commands and options.')
    }
  }

  for (const [key, value] of Object.entries(checks)) {
    if (typeof value !== 'object') {
      throw new Error(`invalid value '${value}' for option ${key}`)
    }
    if (key in availableChecks) {
      checksCommands.push(availableChecks[key](value, webRoot))
    } else {
      throw new Error(`invalid check ${key} specified.`)
    }
  }

  // Pull the image first (and collapse the output)
  core.startGroup('Pull Docker image')
  await exec('docker', ['pull', dockerImage])
  core.endGroup()

  const commonDockerOptions: string[] = []
  commonDockerOptions.push('--workdir', githubWorkspace)
  commonDockerOptions.push('--rm')
  commonDockerOptions.push('--init')
  commonDockerOptions.push('--tty')
  commonDockerOptions.push('-v', '/var/run/docker.sock:/var/run/docker.sock')
  commonDockerOptions.push('-v', `${githubWorkspace}:${githubWorkspace}`)

  for (const command of checksCommands) {
    core.startGroup(`Running ${command.join(' ')}`)
    await exec('docker', [
      'run',
      ...commonDockerOptions,
      dockerImage,
      ...command
    ])
    core.endGroup()
  }
}

try {
  run()
} catch (err) {
  if (err instanceof Error) {
    core.setFailed(`drupalqa: ${err.message}`)
  }
}
