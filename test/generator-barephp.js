/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2019 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('yo barephp', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({
        'skip-welcome-message': true,
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
      'infection.json.dist',
      'phpunit.xml.dist'
    ]);
  });
});
