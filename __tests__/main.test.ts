import { beforeEach, describe, expect, jest, test } from '@jest/globals'

// Mock the external modules
jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  setFailed: jest.fn()
}))
jest.unstable_mockModule('@actions/exec', () => ({
  exec: jest.fn()
}))

describe('run function', () => {
  let run: () => Promise<void>
  // biome-ignore lint/suspicious/noExplicitAny: mocking
  let core: any
  // biome-ignore lint/suspicious/noExplicitAny: mocking
  let exec: any

  beforeEach(async () => {
    jest.resetModules()
    jest.clearAllMocks()

    // Dynamic import to ensure mocks are applied
    core = await import('@actions/core')
    const execModule = await import('@actions/exec')
    exec = execModule.exec
    const main = await import('../src/main')
    run = main.run

    // Default mocks
    core.getInput.mockImplementation((name: string) => {
      if (name === 'php-version') return '8.4'
      if (name === 'registry') return 'ghcr'
      if (name === 'web-root') return 'web'
      return ''
    })
    process.env.GITHUB_WORKSPACE = '/workspace'
  })

  test('it runs successfully with valid php-version 8.4', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'php-version') return '8.4'
      if (name === 'registry') return 'ghcr'
      if (name === 'web-root') return 'web'
      return ''
    })

    await run()

    expect(exec).toHaveBeenCalledWith('docker', [
      'pull',
      'ghcr.io/hussainweb/drupalqa:php8.4'
    ])
  })

  test('it throws error with invalid php-version', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'php-version') return '5.6' // Invalid version
      return ''
    })

    await expect(run()).rejects.toThrow('Invalid PHP version.')
  })

  test('it runs successfully with php-version 8.5', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'php-version') return '8.5'
      if (name === 'registry') return 'ghcr'
      if (name === 'web-root') return 'web'
      return ''
    })

    await run()

    expect(exec).toHaveBeenCalledWith('docker', [
      'pull',
      'ghcr.io/hussainweb/drupalqa:php8.5'
    ])
  })
})
