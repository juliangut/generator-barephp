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
const fs = require('fs');
const shell = require('shelljs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.config.set('new', true);
  }

  prompting() {
    const defaultNamespace = _.capitalize(_.camelize(this.config.get('projectName')));
    const prompts = [
      {
        name: 'phpVersion',
        type: 'list',
        message: 'What is the minimum supported PHP version for the project?',
        choices: ['7.1', '7.2', '7.3', '7.4'],
        default: this.config.get('projectPhpVersion').toString(),
      },
      {
        name: 'controlPolyfills',
        type: 'confirm',
        message: 'Would you like to add polyfills up to newest PHP version?',
        default: this.config.get('controlPolyfills'),
      },
      {
        name: 'projectNamespace',
        message: 'What is the base namespace of the project?',
        default: defaultNamespace,
      },
      {
        name: 'controlCode',
        type: 'confirm',
        message: 'Would you like to bootstrap initial code?',
        default: this.config.get('controlCode'),
      },
      {
        name: 'controlInstall',
        type: 'confirm',
        message: 'No global Composer installation found. Install Composer locally?',
        default: true,
        when: this.config.get('composer') === null,
      },
    ];

    return this.prompt(prompts).then(answers => {
      const phpVersion = parseFloat(answers.phpVersion);
      if (phpVersion > this.config.get('projectTestPhpVersion')) {
        this.config.set('projectTestPhpVersion', phpVersion);
      }
      this.config.set('projectPhpVersion', phpVersion);

      this.config.set('controlPolyfills', answers.controlPolyfills);

      const projectNamespace = _.clean(_.cleanDiacritics(answers.projectNamespace));
      if (/^[a-zA-Z][a-zA-Z0-9_-]+((\\[a-zA-Z][a-zA-Z0-9_-]+)+)?$/.test(projectNamespace) === false) {
        throw new Error(util.format('"%s" is not a valid PHP namespace', projectNamespace));
      }

      this.config.set('projectNamespace', projectNamespace);

      this.config.set('controlCode', answers.controlCode);

      if (this.config.get('composer') === null && answers.controlInstall) {
        this.config.set('composer', 'local');
      }
    });
  }

  writing() {
    const configs = {
      projectDependencies: [],

      projectComposerGitHooksVersion: '^2.8',
      projectPhpCsFixerVersion: '^2.16',
      projectInfectionVersion: '^0.15',
      projectHomesteadVersion: this.config.get('projectType') === 'project' &&
        this.config.get('controlDevEnv') === 'homestead'
          ? '^6.0'
          : null,
      projectPhpmdVersion: '^2.8',
      projectPhpmetricsVersion: this.config.get('projectType') === 'project' ? '^2.0' : null,
      projectPhpstanExtensionInstallerVersion: '^1.0.3',
      projectPhpstanVersion: '^0.12',
      projectPhpstanDeprecationRulesVersion: '^0.12',
      projectPhpstanStrictRulesVersion: '^0.12',
      projectPhpunitVersion: '^8.0',
      projectPhpmndVersion: '^2.1',
      projectPhpcpdVersion: '^4.0',
      projectPhpCodeSnifferVersion: '^3.0',
      projectTheCodingMachinePhpstanStrictRulesVersion: '^0.12',
    };

    switch (this.config.get('projectPhpVersion')) {
      case 7.1:
        configs.projectInfectionVersion = '^0.13|^0.15';
        configs.projectPhpunitVersion = '^7.5|^8.0';

        if (this.config.get('controlPolyfills')) {
          configs.projectDependencies = [
            ['symfony/polyfill-php72', '^1.12'],
            ['symfony/polyfill-php73', '^1.12'],
            ['symfony/polyfill-php74', '^1.12'],
          ];
        }
        break;

      case 7.2:
        if (this.config.get('controlPolyfills')) {
          configs.projectDependencies = [
            ['symfony/polyfill-php73', '^1.12'],
            ['symfony/polyfill-php74', '^1.12'],
          ];
        }
        break;

      case 7.3:
        if (this.config.get('controlPolyfills')) {
          configs.projectDependencies = [
            ['symfony/polyfill-php74', '^1.12'],
          ];
        }
        break;

      case 7.4:
        break;
    }

    this.fs.copyTpl(
      this.templatePath('composer.json'),
      this.destinationPath('composer.json'),
      {...this.config.getAll(), ...configs}
    );

    if (this.config.get('controlCode')) {
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
    }

    if (this.config.composer === 'local' && !fs.existsSync('composer.phar')) {
      this.log('Installing Composer locally ...');
      this.log('See http://getcomposer.org for more details on composer');
      shell.exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', {silent: true});
    }
  }
};
