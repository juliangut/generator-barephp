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
        default: this.config.get('projectPhpVersion').toString()
      },
      {
        type: 'confirm',
        name: 'polyfills',
        message: 'Would you like to add polyfills up to newest PHP version?',
        default: this.config.get('controlPolyfills')
      },{
        name: 'namespace',
        message: 'What is the base namespace of the project?',
        default: defaultNamespace
      },
      {
        type: 'confirm',
        name: 'code',
        message: 'Would you like to bootstrap initial code?',
        default: this.config.get('controlCode')
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

      this.config.set('controlPolyfills', answers.polyfills);

      const namespace = _.clean(_.cleanDiacritics(answers.namespace));
      if (/^[a-zA-Z][a-zA-Z0-9_-]+((\\[a-zA-Z][a-zA-Z0-9_-]+)+)?$/.test(namespace) === false) {
        throw new Error(util.format('"%s" is not a valid PHP namespace', namespace));
      }

      this.config.set('projectNamespace', namespace);

      this.config.set('controlCode', answers.code);

      if (this.config.get('composer') === null && answers.install) {
        this.config.set('composer', 'local');
      }
    });
  }

  writing() {
    let configs = {
      projectDependencies: [],

      projectComposerGitHooksVersion: '^2.5',
      projectPhpCsFixerVersion: "^2.0",
      projectInfectionVersion: '~0.10',
      projectHomesteadVersion: this.config.get('projectType') === 'project' && this.config.get('controlDevEnv') === 'homestead'
        ? '^6.0'
        : null,
      projectPhpmdVersion: "^2.0",
      projectPhpmetricsVersion: this.config.get('projectType') === 'project' ? "^2.0" : null,
      projectPhpstanExtensionInstallerVersion: '^1.0.1',
      projectPhpstanVersion: '~0.11.12',
      projectPhpstanDeprecationRulesVersion: "~0.11.2",
      projectPhpstanStrictRulesVersion: "~0.11.1",
      projectPhpunitVersion: '^7.0|^8.0',
      projectPhpmndVersion: '^2.0',
      projectPhpcpdVersion: "^4.0",
      projectPhpCodeSnifferVersion: "^3.0",
      projectTheCodingMachinePhpstanStrictRulesVersion: "~0.11.2"
    };

    switch (this.config.get('projectPhpVersion')) {
      case 7.0:
        configs.projectInfectionVersion = '^0.8';
        configs.projectPhpstanExtensionInstallerVersion = null;
        configs.projectPhpstanVersion = '^0.8|^0.9';
        configs.projectPhpstanDeprecationRulesVersion = null;
        configs.projectPhpstanStrictRulesVersion = '^0.9';
        configs.projectPhpunitVersion = '^6.0';
        configs.projectPhpmndVersion = '^1.1';
        configs.projectPhpcpdVersion = "^2.0|^4.0";
        configs.projectTheCodingMachinePhpstanStrictRulesVersion = null;

        if (this.config.get('controlPolyfills')) {
          configs.projectDependencies = [
            ['symfony/polyfill-php71', '^1.12'],
            ['symfony/polyfill-php72', '^1.12'],
            ['symfony/polyfill-php73', '^1.12'],
            ['symfony/polyfill-php74', '^1.12']
          ];
        }
        break;

      case 7.1:
        configs.projectPhpunitVersion = '^6.0|^7.0';

        if (this.config.get('controlPolyfills')) {
          configs.projectDependencies = [
            ['symfony/polyfill-php72', '^1.12'],
            ['symfony/polyfill-php73', '^1.12'],
            ['symfony/polyfill-php74', '^1.12']
          ];
        }
        break;

      case 7.2:
        if (this.config.get('controlPolyfills')) {
          configs.projectDependencies = [
            ['symfony/polyfill-php73', '^1.12'],
            ['symfony/polyfill-php74', '^1.12']
          ];
        }
        break;

      case 7.3:
        if (this.config.get('controlPolyfills')) {
          configs.projectDependencies = [
            ['symfony/polyfill-php74', '^1.12']
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
