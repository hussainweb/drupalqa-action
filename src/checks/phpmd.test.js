const phpmd = require('./phpmd');

test('it returns defaults', () => {
  expect(phpmd({}, 'web')).toEqual(['phpmd', 'web/modules/custom', 'text', 'codesize,naming,unusedcode', '--suffixes', 'php,module,theme,engine,inc']);
});

test('it handles partial inputs', () => {
  let command;
  command = phpmd({
    format: 'json',
    ruleset: 'phpmd.xml',
  }, 'web');
  expect(command[2]).toEqual('json');
  expect(command[3]).toEqual('phpmd.xml');

  command = phpmd({
    suffixes: 'php',
  }, 'docroot');
  expect(command[1]).toEqual('docroot/modules/custom');
  expect(command[4]).toEqual('--suffixes');
  expect(command[5]).toEqual('php');

  command = phpmd({
    exclude: '/node_modules/',
  }, 'docroot');
  expect(command[6]).toEqual('--exclude');
  expect(command[7]).toEqual('/node_modules/');
});
