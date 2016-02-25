
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('yo barephp usage', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({
        'skip-install': true
      })
      .withPrompts({
        name: 'Julián Gutiérrez',
        email: 'juliangut@gmail.com',
        homepage: 'juliangut.com',
        useRepository: true,
        type: 'github',
        account: 'juliangut',
        install: false,
        xtras: 'packagist, travis, coveralls, scrutinizer, styleci, homestead, docs'
      })
      .on('end', done);
  });

  it('creates default files', function() {
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
