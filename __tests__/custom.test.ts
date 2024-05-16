import custom from '../src/checks/custom'
import {expect, test} from '@jest/globals'

test('it returns defaults', () => {
  expect(custom({}, 'web')).toEqual([])
})

test('it handles empty commands', () => {
  let command
  command = custom(
    {
      command: []
    },
    'web'
  )
  expect(command).toEqual([])
})

test('it handles commands', () => {
  let command
  command = custom(
    {
      command: ['phpmd']
    },
    'docroot'
  )
  expect(command).toEqual(['phpmd'])
})
