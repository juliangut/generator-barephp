/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2019 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

const Generator = require('yeoman-generator');
const util = require('util');
const _ = require('underscore.string');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

module.exports = class extends Generator{
  constructor(args, opts) {
    super(args, opts);

    this.config.set('new', true);
  }

  prompting() {
    const defaultNamespace = _.capitalize(_.camelize(this.config.get('projectName')));
    const prompts = [
      {
        type: 'list',
        name: 'phpVersion',
        message: 'What is the minimum supported PHP version for the project?',
        choices: ['7.0', '7.1', '7.2', '7.3'],
        default: this.config.get('projectPhpVersion').toFixed(1)
      },
      {
        name: 'namespace',
        message: 'What is the base namespace of the project?',
        default: defaultNamespace
      },
      {
        type: 'confirm',
        name: 'install',
        message: 'No global Composer installation found. Install Composer locally?',
        default: true,
        when: this.config.get('composer') === null
      }
    ];

    return this.prompt(prompts).then(answers => {
      const phpVersion = parseFloat(answers.phpVersion);
      if (phpVersion > this.config.get('projectTestPhpVersion')) {
        this.config.set('projectTestPhpVersion', phpVersion);
      }
      this.config.set('projectPhpVersion', phpVersion);

      const namespace = _.clean(_.cleanDiacritics(answers.namespace));
      if (/^[a-zA-Z][a-zA-Z0-9_-]+((\\[a-zA-Z][a-zA-Z0-9_-]+)+)?$/.test(namespace) === false) {
        throw new Error(util.format('"%s" is not a valid PHP namespace', namespace));
      }

      this.config.set('projectNamespace', namespace);

      if (this.config.get('composer') === null && answers.install) {
        this.config.set('composer', 'local');
      }
    });
  }

  writing() {
    let configs = {
      projectPhpunitVersion: null,
      projectDependencies: []
    };

    switch (this.config.get('projectPhpVersion')) {
      case 7.0:
        configs.projectPhpunitVersion = '^5.7|^6.0';
        configs.projectDependencies = [
          ['symfony/polyfill-php71', '^1.0'],
          ['symfony/polyfill-php72', '^1.0'],
          ['symfony/polyfill-php73', '^1.0']
        ];
        break;

      case 7.1:
        configs.projectPhpunitVersion = '^6.0|^7.0';
        configs.projectDependencies = [
          ['symfony/polyfill-php72', '^1.0'],
          ['symfony/polyfill-php73', '^1.0']
        ];
        break;

      case 7.2:
        configs.projectPhpunitVersion = '^6.0|^7.0';
        configs.projectDependencies = [
          ['symfony/polyfill-php73', '^1.0']
        ];
        break;

      case 7.3:
        configs.projectPhpunitVersion = '^6.0|^7.0';
        break;
    }

    this.fs.copyTpl(
      this.templatePath('composer.json'),
      this.destinationPath('composer.json'),
      {...this.config.getAll(), ...configs}
    );

    this.fs.copyTpl(
      this.templatePath('Person.php'),
      this.destinationPath(this.config.get('dirSrc'), 'Person.php'),
      this.config.getAll()
    );
    this.fs.copyTpl(
      this.templatePath('Greeter.php'),
      this.destinationPath(this.config.get('dirSrc'), 'Greeter.php'),
      this.config.getAll()
    );

    this.fs.copyTpl(
      this.templatePath('bootstrap.php'),
      this.destinationPath(this.config.get('dirTests'), 'bootstrap.php'),
      this.config.getAll()
    );
    this.fs.copyTpl(
      this.templatePath('PersonTest.php'),
      this.destinationPath(this.config.get('dirTestsSrc'), 'PersonTest.php'),
      this.config.getAll()
    );
    this.fs.copyTpl(
      this.templatePath('GreeterTest.php'),
      this.destinationPath(this.config.get('dirTestsSrc'), 'GreeterTest.php'),
      this.config.getAll()
    );

    if (this.config.get('projectType') === 'project') {
      this.fs.copyTpl(
        this.templatePath('index.php'),
        this.destinationPath(this.config.get('dirPublic'), 'index.php'),
        this.config.getAll()
      );
    }

    if (this.config.composer === 'local' && !fs.existsSync('composer.phar')) {
      this.log('Installing Composer locally ...');
      this.log('See http://getcomposer.org for more details on composer');
      shell.exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', {silent: true});
    }
  }
};
