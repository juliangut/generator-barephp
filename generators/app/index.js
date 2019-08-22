/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2019 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

const BaseGenerator = require('../../lib/baseGenerator');
const path = require('path');
const yosay = require('yosay');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const fs = require('fs');
const shell = require('shelljs');

module.exports = class extends BaseGenerator {
  welcome() {
    if (!this.options['skip-welcome-message']) {
      this.log(
        yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Travis, Docker and many more integrations!')
      );
    }
  }

  initializing() {
    this.composeWith(require.resolve('../owner'));
    this.composeWith(require.resolve('../repository'));
    this.composeWith(require.resolve('../project'));
    this.composeWith(require.resolve('../php'));
    this.composeWith(require.resolve('../tooling'));
  }

  prompting() {
    const prompts = [
      {
        type: 'confirm',
        name: 'quickMode',
        message: 'Would you like the quick assistant?',
        default: this.config.get('mode') === 'quick'
      }
    ];

    return this.prompt(prompts).then(answers => {
      this.config.set('mode', answers.quickMode ? 'quick' : 'full');
    });
  }

  writing() {
    this.config.set(
      'dirTestsSrc',
      path.join(
        this.config.get('dirTests'),
        this.config.get('projectNamespace').replace(/\\+/g, path.sep).split(path.sep).pop()
      )
    );

    mkdirp(this.config.get('dirSrc'));
    mkdirp(this.config.get('dirTestsSrc'));

    if (this.config.get('projectType') === 'project') {
      mkdirp(this.config.get('dirPublic'));
    }

    if (this.config.get('controlDevEnv') === 'homestead') {
      mkdirp('vagrant');
    }
    if (this.config.get('controlDevEnv') === 'docker') {
      mkdirp('docker/config');
      mkdirp('docker/log/nginx');
      mkdirp('docker/log/php');
      mkdirp('docker/data/mysql');
    }
  }

  install() {
    let message = '\nProject ' + chalk.green.bold(this.config.get('projectName')) + ' is set up and ready\n';

    if (shell.which('git') && (!fs.existsSync('.git') || !fs.lstatSync('.git').isDirectory())) {
      this.log('');
      shell.exec('git init');
    }

    if (!this.options['skip-install']) {
      if (this.config.get('freshRun')) {
        if (this.config.get('composer') === 'global' || this.config.get('composer') === 'local') {
          if (this.config.get('composer') === 'global') {
            this.log('Running ' + chalk.yellow.bold('composer install') +
                       ' for you to install the required PHP dependencies. If this fails, try running the command yourself');

            shell.exec('composer install');
          } else {
            this.log('Running ' + chalk.yellow.bold('php composer.phar install') +
                       ' for you to install the required PHP dependencies. If this fails, try running the command yourself');

            shell.exec('php composer.phar install');
          }
        } else {
          message += '\nInstall Composer dependencies by running ' + chalk.yellow.bold('composer install') +
            ' before starting development';
        }
      }
    }

    this.log(message);
  }
};
