import { expect, test } from '@jest/globals'
import phpstan from '../src/checks/phpstan'

test('it returns defaults', () => {
  expect(phpstan({}, 'web')).toEqual(['phpstan'])
})

test('it handles configuration', () => {
  const command = phpstan(
    {
      configuration: 'phpstan.neon'
    },
    'web'
  )
  expect(command).toContain('--configuration phpstan.neon')
})

test('it can handle single and multiple paths', () => {
  let command: string[]
  command = phpstan(
    {
      paths: ['web/modules/custom']
    },
    'web'
  )
  expect(command).toContain('web/modules/custom')

  command = phpstan(
    {
      paths: ['web/modules/custom', 'web/themes/custom']
    },
    'web'
  )
  expect(command).toContain('web/modules/custom')
  expect(command).toContain('web/themes/custom')
})
