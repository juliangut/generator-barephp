
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
        account: 'juliangut',
        name: 'Julián Gutiérrez',
        email: 'juliangut@gmail',
        homepage: 'juliangut.com',
        projectname: 'Jgut/GeneratorBarePHP',
        xtras: 'travis, coveralls, scrutinizer, styleci, homestead, docs'
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
      '.styleci.yml',
      '.travis.yml',
      'CONTRIBUTING.md',
      'Gruntfile.js',
      'LICENSE',
      'README.md',
      'Vagrantfile',
      'composer.json',
      'package.json',
      'phpunit.xml'
    ]);
  });
});
