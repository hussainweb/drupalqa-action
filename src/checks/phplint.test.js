const phplint = require('./phplint');

test('it returns defaults', () => {
  expect(phplint({}, 'web')).toEqual(['phplint', '--exclude=vendor', '--exclude=web/core', '--exclude=web/modules/contrib', '--extensions=php', '--extensions=module', '--extensions=theme', '--extensions=engine', '--extensions=inc', '--extensions=install']);
});

test('it returns no options', () => {
  expect(phplint({ no_default_options: true }, 'web')).toEqual(['phplint']);
  expect(phplint({
    no_default_options: true,
    exclude: 'vendor',
  }, 'web')).toEqual(['phplint']);
});

test('it handles partial inputs', () => {
  let command;
  command = phplint({
    exclude: 'vendor,web/themes/contrib',
  }, 'web');
  expect(command).toContain('--exclude=vendor');
  expect(command).toContain('--exclude=web/themes/contrib');
  expect(command).not.toContain('--exclude=web/modules/contrib');

  command = phplint({
    extensions: 'php,inc',
  }, 'docroot');
  expect(command).toContain('--extensions=php');
  expect(command).toContain('--extensions=inc');
  expect(command).not.toContain('--extensions=module');
  expect(command).toContain('--exclude=docroot/modules/contrib');

  command = phplint({
    verbose: true,
    path: 'web/modules/custom',
  }, 'docroot');
  expect(command).toContain('-v');
  expect(command).toContain('--exclude=docroot/modules/contrib');
  expect(command).toContain('web/modules/custom');
});
