import { expect, test } from '@jest/globals'
import grumphp from '../src/checks/grumphp'

test('it returns defaults', () => {
  expect(grumphp({}, 'web')).toEqual(['grumphp', 'run', '--no-interaction'])
})

test('it handles partial inputs', () => {
  let command: string[]
  command = grumphp(
    {
      testsuite: 'linters'
    },
    'web'
  )
  expect(command).toContain('--testsuite=linters')

  command = grumphp(
    {
      tasks: ['phpcs', 'phpmd']
    },
    'docroot'
  )
  expect(command).toContain('--tasks=phpcs,phpmd')
})
