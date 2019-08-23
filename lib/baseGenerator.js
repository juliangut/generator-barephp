/*
 * generator-barephp
 * https://github.com/juliangut/generator-barephp
 *
 * Copyright (c) 2019 Julián Gutiérrez (juliangut@gmail.com)
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

const Generator = require('yeoman-generator');
const _ = require('underscore.string');
const shell = require('shelljs');
const fs = require('fs');

class BaseGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option(
      'skip-welcome-message',
      {
        desc: 'Skips the welcome message',
        type: Boolean,
        default: false
      }
    );

    this.defaultConfigs = {
      mode: 'full',

      freshRun: null,
      composer: null,

      ownerName: '',
      ownerCanonical: '',
      ownerEmail: '',
      ownerHomepage: '',

      projectName: null,
      projectType: 'library',
      projectDescription: '',
      projectKeywords: [],
      projectHomepage: '',
      projectLicense: 'MIT',
      projectLicenseFile: null,
      projectPhpVersion: 7.3,
      projectTestPhpVersion: 7.3,
      projectNamespace: null,
      projectSupportNightly: true,

      repositoryType: 'github',
      repositorySSH: null,
      repositoryHomepage: null,

      accountRepository: '',
      accountPackagist: '',
      accountTravis: '',
      accountCoveralls: '',
      accountScrutinizer: '',
      accountStyleci: '',

      controlRepositoryTemplates: false,
      controlPackagist: true,
      controlTravis: true,
      controlCoveralls: true,
      controlScrutinizer: true,
      controlStyleci: true,
      controlDocs: true,
      controlPolyfills: false,
      controlCode: true,
      controlDevEnv: 'docker',
      controlPhpMyAdmin: false,

      dirSrc: 'src',
      dirTests: 'tests',
      dirBuild: 'build',
      dirPublic: 'public',

      homesteadFormat: 'yaml',
      homesteadIP: null
    };

    this.config.defaults(this.defaultConfigs);

    this.config.set('freshRun', !fs.existsSync('composer.lock'));

    shell.exec('composer -v', {silent: true}, function(error) {
      if (error === 0) {
        this.config.set('composer', 'global');
      } else if (fs.existsSync('composer.phar')) {
        this.config.set('composer', 'local');
      } else {
        this.config.set('composer', null);
      }
    }.bind(this));

    if (!shell.which('git')) {
      const userHomeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

      this.config.set('ownerName', _.clean(userHomeDirectory.split(path.sep).pop()));
    } else {
      this.config.set('ownerName', _.clean(shell.exec('git config user.name', {silent: true}).stdout, '\n'));
      this.config.set('ownerEmail', _.clean(shell.exec('git config user.email', {silent: true}).stdout, '\n'));
      this.config.set('ownerHomepage', _.clean(shell.exec('git config user.homepage', {silent: true}).stdout, '\n'));
    }

    if (fs.existsSync('composer.json')) {
      var configs = JSON.parse(fs.readFileSync('composer.json'));

      if (configs.authors && configs.authors instanceof Array) {
        this.config.set('ownerName', configs.authors[0].name ? configs.authors[0].name : this.config.get('ownerName'));
        this.config.set('ownerEmail', configs.authors[0].email ? configs.authors[0].email : this.config.get('ownerEmail'));
        this.config.set('ownerHomepage', configs.authors[0].homepage ? configs.authors[0].homepage : this.config.get('ownerHomepage'));
      }

      if (configs.description) {
        this.config.set('projectDescription', configs.description);
      }
      if (configs.type) {
        this.config.set('projectType', configs.type);
      }
      if (configs.keywords && configs.keywords instanceof Array) {
        this.config.set('projectKeywords', configs.keywords);
      }
      if (configs.homepage) {
        this.config.set('projectHomepage',  configs.homepage);
      }
      if (configs.license) {
        this.config.set('project.license', configs.license);
      }

      if (configs.require.php) {
        this.config.set('projectPhpVersion', parseFloat(configs.require.php.replace(/^([<>=^~ ]+)?/, '')));
      }
    }
  }
}

module.exports = BaseGenerator;
