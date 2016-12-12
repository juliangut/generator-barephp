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

describe('yo barephp Gulp', function() {
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
        tools: 'packagist, travis, coveralls, scrutinizer',
        taskRunner: 'Gulp'
      })
      .on('end', done);
  });

  it('creates with Gulp task runner', function() {
    assert.file([
      '.coveralls.yml',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.scrutinizer.yml',
      '.travis.yml',
      'gulpfile.js',
      'composer.json',
      'package.json',
      'phpunit.xml'
    ]);
  });
});

describe('yo barephp Grunt', function() {
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
        tools: 'styleci, homestead, docs',
        taskRunner: 'Grunt'
      })
      .on('end', done);
  });

  it('creates with Grunt task runner', function() {
    assert.file([
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.styleci.yml',
      'CONTRIBUTING.md',
      'Gruntfile.js',
      'LICENSE',
      'README.md',
      'composer.json',
      'package.json',
      'phpunit.xml'
    ]);
  });
});
