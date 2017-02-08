/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2016 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('yo barephp', function() {
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
        projectType: 'library',
        useLicense: false,
        install: false,
        tools: 'packagist, travis, coveralls, scrutinizer'
      })
      .on('end', done);
  });

  it('creates project', function() {
    assert.file([
      '.coveralls.yml',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.scrutinizer.yml',
      '.travis.yml',
      'composer.json',
      '.php_cs',
      'humbug.json.dist',
      'phpunit.xml.dist'
    ]);
  });
});
