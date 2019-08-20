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
const chalk = require('chalk');
const sprintf = require('sprintf-js').sprintf;
const validator = require('validator');

module.exports = class extends Generator{
  constructor(args, opts) {
    super(args, opts);

    this.config.set('new', true);
  }

  prompting() {
    const done = this.async();
    const prompts = [
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Which of this tools would you like to include?',
        choices: [
          {
            value: 'packagist',
            name: 'Packagist',
            checked: this.config.get('controlPackagist')
          },
          {
            value: 'travis',
            name: 'Travis',
            checked: this.config.get('controlTravis')
          },
          {
            value: 'coveralls',
            name: 'Coveralls',
            checked: this.config.get('controlCoveralls')
          },
          {
            value: 'scrutinizer',
            name: 'Scrutinizer',
            checked: this.config.get('controlScrutinizer')
          },
          {
            value: 'styleci',
            name: 'StyleCI',
            checked: this.config.get('controlStyleci')
          },
          {
            value: 'docs',
            name: 'Initial documentation',
            checked: this.config.get('controlDocs')
          }
        ],
        when: this.config.get('mode') !== 'quick'
      },
      {
        type: 'list',
        name: 'devenv',
        message: 'Which development environment do you want to use?',
        choices: ['none', 'docker', 'homestead'],
        default: this.config.get('controlDevEnv'),
        when: this.config.get('mode') !== 'quick' && this.config.get('projectType') === 'project'
      }
    ];

    this.prompt(prompts).then(answers => {
      if (this.config.get('mode') !== 'quick') {
        const hasMod = function (mod) {
          return answers.tools.indexOf(mod) !== -1;
        };

        if (hasMod('packagist')) {
          this._packagist();
        }
        if (hasMod('travis')) {
          this._travis();
        }
        if (hasMod('coveralls')) {
          this._coveralls();
        }
        if (hasMod('scrutinizer')) {
          this._scrutinizer();
        }
        if (hasMod('styleci') && hasMod('docs')) {
          this._styleci();
        }
        if (hasMod('docs')) {
          this.config.set('controlDocs', true);
        }

        if (this.config.get('projectType') === 'project') {
          var devEnv = answers.devenv;

          this.config.set('controlDevEnv', devEnv);

          if (devEnv !== 'homestead') {
            this.config.set('controlPhpMyAdmin', false);
          } else {
            this._homestead();
          }
        }
      }

      done();
    });
  }

  _packagist() {
    const done = this.async();
    const prompts = [
      {
        name: 'account',
        message: 'What is your Packagist account name?',
        default: this.config.get('controlRepository') ?
          this.config.get('accountPackagist') :
          this.config.get('ownerCanonical')
      }
    ];

    this.prompt(prompts).then(answers => {
      this.config.set('accountPackagist', _.clean(answers.account).replace(/\s+/g, '_'));

      done();
    });
  }

  _travis() {
    const done = this.async();
    const prompts = [
      {
        name: 'account',
        message: 'What is your Travis account name?',
        default: this.config.get('controlRepository') ?
          this.config.get('accountTravis') :
          this.config.get('ownerCanonical')
      },
      {
        type: 'confirm',
        name: 'supportNightly',
        message: 'Want to support PHP nightly version on Travis?',
        default: this.config.get('projectSupportNightly')
      }
    ];

    this.prompt(prompts).then(answers => {
      this.config.set('accountTravis', _.clean(answers.account).replace(/\s+/g, '_'));

      this.config.set('projectSupportNightly', answers.supportNightly);

      done();
    });
  }

  _coveralls() {
    const done = this.async();
    const prompts = [
      {
        name: 'account',
        message: 'What is your Coveralls account name?',
        default: this.config.get('controlRepository') ?
          this.config.get('accountCoveralls') :
          this.config.get('ownerCanonical')
      }
    ];

    this.prompt(prompts).then(answers => {
      this.config.set('accountCoveralls', _.clean(answers.account).replace(/\s+/g, '_'));

      done();
    });
  }

  _scrutinizer() {
    const done = this.async();
    const prompts = [
      {
        name: 'account',
        message: 'What is your Scrutinizer account name?',
        default: this.config.get('controlRepository') ?
          this.config.get('accountScrutinizer') :
          this.config.get('ownerCanonical')
      }
    ];

    this.prompt(prompts).then(answers => {
      this.config.set('accountCoveralls', _.clean(answers.account).replace(/\s+/g, '_'));

      done();
    });
  }

  _styleci() {
    const done = this.async();
    const prompts = [
      {
        name: 'account',
        message: 'What is this project StyleCI repository code?',
        default: this.config.get('accountStyleci')
      }
    ];

    this.prompt(prompts).then(answers => {
      const accountStyleci = _.clean(answers.account).replace(/\s+/g, '');

      this.config.set('accountStyleci', accountStyleci);

      if (accountStyleci === '') {
        console.log(chalk.yellow.bold('  Remember to assign StyleCI repository code on README file'));
      }

      done();
    });
  }

  _homestead() {
    const done = this.async();
    const defaultIp = sprintf('192.168.%1$d.%1$d', Math.max(100, Math.floor(Math.random() * 255)));
    const prompts = [
      {
        type: 'list',
        name: 'format',
        message: 'What Homestead configuration format you want to use?',
        choices: ['json', 'yaml'],
        default: this.config.get('homesteadFormat')
      },
      {
        type: 'confirm',
        name: 'usePhpmyadmin',
        message: 'Would you like to install PhpMyAdmin in Homestead?',
        default: this.config.get('controlPhpMyAdmin')
      },
      {
        name: 'ip',
        message: 'What will be homestead local IP?',
        default: defaultIp
      }
    ];

    this.prompt(prompts).then(answers => {
      this.config.set('homesteadFormat', answers.format);
      this.config.set('controlPhpMyAdmin', answers.usePhpmyadmin);

      const homesteadIp = _.trim(answers.ip);

      if (!validator.isIP(homesteadIp)) {
        throw new Error(util.format('"%s" is not a valid IP', homesteadIp));
      }

      this.config.set('homesteadIP', homesteadIp);

      done();
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_gitattributes'),
      this.destinationPath('.gitattributes'),
      this.config.getAll()
    );
    this.fs.copyTpl(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore'),
      this.config.getAll()
    );

    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copyTpl(
      this.templatePath('.php_cs'),
      this.destinationPath('.php_cs'),
      this.config.getAll()
    );

    this.fs.copyTpl(
      this.templatePath('phpunit.xml.dist'),
      this.destinationPath('phpunit.xml.dist'),
      this.config.getAll()
    );

    this.fs.copyTpl(
      this.templatePath('infection.json.dist'),
      this.destinationPath('infection.json.dist'),
      this.config.getAll()
    );

    this.fs.copyTpl(
      this.templatePath('phpstan.neon'),
      this.destinationPath('phpstan.neon'),
      this.config.getAll()
    );

    if (this.config.get('accountTravis') !== null) {
      this.fs.copyTpl(
        this.templatePath('.travis.yml'),
        this.destinationPath('.travis.yml'),
        this.config.getAll()
      );
    }

    if (this.config.get('accountCoveralls') !== null) {
      this.fs.copy(
        this.templatePath('.coveralls.yml'),
        this.destinationPath('.coveralls.yml')
      );
    }

    if (this.config.get('accountScrutinizer') !== null) {
      this.fs.copyTpl(
        this.templatePath('.scrutinizer.yml'),
        this.destinationPath('.scrutinizer.yml'),
        this.config.getAll()
      );
    }

    if (this.config.get('accountStyleci') !== null) {
      this.fs.copyTpl(
        this.templatePath('.styleci.yml'),
        this.destinationPath('.styleci.yml'),
        this.config.getAll()
      );
    }

    if (this.config.get('controlDevEnv') === 'homestead') {
      this.fs.copyTpl(
        this.templatePath(path.join('vagrant', 'Vagrantfile')),
        this.destinationPath('Vagrantfile'),
        this.config.getAll()
      );

      if (this.config.get('homesteadFormat') === 'json') {
        this.fs.copyTpl(
          this.templatePath(path.join('vagrant', 'homestead.json')),
          this.destinationPath(path.join('vagrant', 'homestead.json')),
          this.config.getAll()
        );
      } else {
        this.fs.copyTpl(
          this.templatePath(path.join('vagrant', 'homestead.yml')),
          this.destinationPath(path.join('vagrant', 'homestead.yml')),
          this.config.getAll()
        );
      }

      this.fs.copyTpl(
        this.templatePath(path.join('vagrant', 'provision.sh')),
        this.destinationPath(path.join('vagrant', 'provision.sh')),
        this.config.getAll()
      );
      this.fs.copy(
        this.templatePath(path.join('vagrant', 'aliases')),
        this.destinationPath(path.join('vagrant', 'aliases'))
      );
      this.fs.copy(
        this.templatePath(path.join('vagrant', '_gitignore')),
        this.destinationPath(path.join('vagrant', '.gitignore'))
      );
    }
    if (this.config.get('controlDevEnv') === 'docker') {
      this.fs.copy(
        this.templatePath(path.join('docker', 'nginx.conf')),
        this.destinationPath(path.join('docker', 'config', 'nginx.conf'))
      );
      this.fs.copy(
        this.templatePath(path.join('docker', 'vhost.conf')),
        this.destinationPath(path.join('docker', 'config', 'vhost.conf'))
      );
      this.fs.copy(
        this.templatePath(path.join('docker', '_gitignore')),
        this.destinationPath(path.join('docker', 'log', 'nginx', '.gitignore'))
      );
      this.fs.copy(
        this.templatePath(path.join('docker', '_gitignore')),
        this.destinationPath(path.join('docker', 'log', 'php', '.gitignore'))
      );
      this.fs.copy(
        this.templatePath(path.join('docker', '_gitignore')),
        this.destinationPath(path.join('docker', 'data', 'mysql', '.gitignore'))
      );

      this.fs.copyTpl(
        this.templatePath(path.join('docker', 'docker-compose.yml')),
        this.destinationPath(path.join('docker', 'docker-compose.yml')),
        this.config.getAll()
      );
    }
  }
};
