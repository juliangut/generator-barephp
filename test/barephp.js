
'use strict';

var path = require('path'),
  helpers = require('yeoman-generator').test,
  assert = require('yeoman-generator').assert;

describe('yo barephp usage', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({
        'skip-install': true
      })
      .withPrompts({
        name: 'Julián Gutiérrez',
        email: 'juliangut@gmail',
        homepage: 'juliangut.com',
        projectname: 'Jgut/GeneratorBarePHP',
        xtras: 'travis, coveralls, scrutinizer, docs'
      })
      .on('end', done);
  });

  it('creates default files', function () {
    assert.file([
      '.coveralls.yml',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.scrutinizer.yml',
      '.travis.yml',
      'CONTRIBUTING.md',
      'Gruntfile.js',
      'LICENSE',
      'README.md',
      'composer.json',
      'package.json',
      'phpmd.xml',
      'phpunit.xml'
    ]);
  });
});
