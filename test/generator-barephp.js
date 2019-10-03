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
  it('creates default library', function() {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, 'tmp'))
      .withOptions({
        'skip-welcome-message': true,
        'skip-install': true,
      })
      .withPrompts({
        ownerName: 'Julián Gutiérrez',
        ownerEmail: 'juliangut@gmail.com',
        ownerHomepage: 'juliangut.com',
      })
      .then(function () {
        assert.noFile([
          'docker/docker-compose.yml',
          'public/index.php',
        ]);

        assert.file([
          'src/Greeter.php',
          'src/Person.php',
          'tests/bootstrap.php',
          'tests/Generator/GreeterTest.php',
          'tests/Generator/PersonTest.php',
          '.coveralls.yml',
          '.editorconfig',
          '.gitattributes',
          '.gitignore',
          '.php_cs',
          '.scrutinizer.yml',
          '.styleci.yml',
          '.travis.yml',
          'CONRIBUTING.md',
          'LICENSE',
          'README.md',
          'composer.json',
          'infection.json.dist',
          'phpstan.neon',
          'phpunit.xml.dist',
        ]);
      });
  });

  it('creates default project', function() {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, 'tmp'))
      .withOptions({
        'skip-welcome-message': true,
        'skip-install': true,
      })
      .withPrompts({
        ownerName: 'Julián Gutiérrez',
        ownerEmail: 'juliangut@gmail.com',
        ownerHomepage: 'juliangut.com',
      })
      .then(function () {
        assert.file([
          'docker/docker-compose.yml',
          'public/index.php',
          'src/Greeter.php',
          'src/Person.php',
          'tests/bootstrap.php',
          'tests/Generator/GreeterTest.php',
          'tests/Generator/PersonTest.php',
          '.coveralls.yml',
          '.editorconfig',
          '.gitattributes',
          '.gitignore',
          '.php_cs',
          '.scrutinizer.yml',
          '.styleci.yml',
          '.travis.yml',
          'CONRIBUTING.md',
          'LICENSE',
          'README.md',
          'composer.json',
          'infection.json.dist',
          'phpstan.neon',
          'phpunit.xml.dist',
        ]);
      });
  });
});
