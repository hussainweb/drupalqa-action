const phpcs = require('./phpcs');

test('it returns defaults', () => {
  expect(phpcs({}, 'web')).toEqual(['phpcs', '--standard=Drupal,DrupalPractice', '--extensions=php,module,inc,install,test,profile,theme', 'web/modules/custom']);
});
