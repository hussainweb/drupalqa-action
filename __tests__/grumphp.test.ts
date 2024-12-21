import grumphp from '../src/checks/grumphp'
import {expect, test} from '@jest/globals'

test('it returns defaults', () => {
  expect(grumphp({}, 'web')).toEqual(['grumphp', 'run', '--no-interaction'])
})

test('it handles partial inputs', () => {
  let command
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
