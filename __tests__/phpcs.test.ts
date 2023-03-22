import phpcs from '../src/checks/phpcs'
import {expect, test} from '@jest/globals'

test('it returns defaults', () => {
  expect(phpcs({}, 'web')).toEqual([
    'phpcs',
    '--standard=Drupal,DrupalPractice',
    '--extensions=php,module,inc,install,test,profile,theme',
    'web/modules/custom'
  ])
})

test('it handles partial inputs', () => {
  let command
  command = phpcs(
    {
      standard: 'Drupal',
      ignore: 'node_modules'
    },
    'web'
  )
  expect(command).toContain('--standard=Drupal')
  expect(command).toContain('--ignore=node_modules')

  command = phpcs(
    {
      extensions: 'php,inc'
    },
    'docroot'
  )
  expect(command).toContain('--extensions=php,inc')
  expect(command).toContain('docroot/modules/custom')
})

test('it can handle single and multiple paths', () => {
  let command
  command = phpcs(
    {
      path: 'web/modules/custom'
    },
    'web'
  )
  expect(command).toContain('web/modules/custom')

  command = phpcs(
    {
      path: 'web/modules/custom,web/themes/custom'
    },
    'web'
  )
  expect(command).toContain('web/modules/custom')
  expect(command).toContain('web/themes/custom')
})
