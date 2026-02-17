import { expect, test } from '@jest/globals'
import custom from '../src/checks/custom'

test('it returns defaults', () => {
  expect(custom({}, 'web')).toEqual([])
})

test('it handles empty commands', () => {
  const command = custom(
    {
      command: []
    },
    'web'
  )
  expect(command).toEqual([])
})

test('it handles commands', () => {
  const command = custom(
    {
      command: ['phpmd']
    },
    'docroot'
  )
  expect(command).toEqual(['phpmd'])
})
