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
const validator = require('validator');

module.exports = class extends Generator{
  constructor(args, opts) {
    super(args, opts);

    this.config.set('new', true);
  }

  prompting() {
    const done = this.async();

    var defaultDirs = this.config.get('dirSrc') +
      ', ' + this.config.get('dirTests') +
      ', ' + this.config.get('dirBuild');
    if (this.config.get('projectType') === 'project') {
      defaultDirs += ', ' + this.config.get('dirPublic');
    }

    const prompts = [
      {
        name: 'name',
        message: 'What is the project name?',
        default: this.config.get('projectName') ?
          this.config.get('projectName') :
          _.cleanDiacritics(process.cwd().split(path.sep).pop()).replace(/\s+/g, '_')
      },
      {
        name: 'description',
        message: 'What is the project description?',
        default: this.config.get('projectDescription'),
        when: this.config.get('mode') !== 'quick'
      },
      {
        name: 'type',
        type: 'list',
        message: 'What type is the project?',
        choices: ['library', 'project', 'metapackage', 'composer-plugin'],
        default: this.config.get('projectType'),
        when: this.config.get('mode') !== 'quick'
      },
      {
        name: 'keywords',
        message: 'What are the project keywords? (comma separated)',
        default: this.config.get('projectKeywords').join(', '),
        when: this.config.get('mode') !== 'quick'
      },
      {
        name: 'homepage',
        message: 'What is the project homepage?',
        default: this.config.get('projectHomepage') ?
          this.config.get('projectHomepage') :
          (this.config.get('repositoryType') !== 'none' ? this.config.get('repositoryHomepage') : ''),
        when: this.config.get('mode') !== 'quick'
      },
      {
        type: 'confirm',
        name: 'changeDirs',
        message: 'Would you like to change default directories?',
        default: this.config.get('controlDirs'),
        when: this.config.get('mode') !== 'quick'
      },
      {
        type: 'list',
        name: 'license',
        message: 'What license do you want to use?',
        choices: [
          'none',
          'Apache-2.0',
          'BSD-2-Clause',
          'BSD-3-Clause',
          'BSD-4-Clause',
          'GPL-2.0',
          'GPL-3.0',
          'LGPL-3.0',
          'MIT',
          'Proprietary'
        ],
        default: this.config.get('projectLicense'),
        when: this.config.get('mode') !== 'quick'
      }
    ];

    this.prompt(prompts).then(answers => {
      this.config.set('projectName', _.clean(_.cleanDiacritics(answers.name)).replace(/\s+/g, '_'));

      if (this.config.get('repositoryType') !== 'none') {
        this.config.set(
          'repositorySSH',
          this.config.get('repositorySSH') + this.config.get('projectName') + '.git'
        );

        this.config.set(
          'repositoryHomepage',
          this.config.get('repositoryHomepage') + this.config.get('projectName')
        );
      }

      if (this.config.get('mode') !== 'quick') {
        this.config.set('projectDescription', _.trim(answers.description));
        this.config.set('projectType',  answers.type);

        if (answers.type === 'project' && this.config.get('controlDevEnv') === null) {
          this.config.set('controlDevEnv', 'docker');
        }

        let keywords = _.clean(answers.keywords);
        keywords = keywords.length
          ? keywords.replace(/(\s+)?,\s+?/g, ',').replace(/,$/, '').split(',')
          : [];
        this.config.set('projectKeywords', keywords);

        let projectHomepage  = _.trim(answers.homepage).split(' ').shift();
        if (projectHomepage !== '') {
          if (!validator.isURL(projectHomepage)) {
            throw new Error(util.format('"%s" is not a valid URL', projectHomepage));
          }

          if (!/^https?:\/\//.test(projectHomepage)) {
            projectHomepage = 'http://' + projectHomepage;
          }
        }
        this.config.set('projectHomepage', projectHomepage);

        if (answers.changeDirs) {
          this._dirs();
        }

        if (answers.license !== 'none') {
          this.config.set('projectLicense', answers.license);

          let licenseFile = '';
          switch (answers.license) {
            case 'Apache-2.0':
              licenseFile = 'apache-2';
              break;
            case 'BSD-2-Clause':
              licenseFile = 'bsd-free';
              break;
            case 'BSD-3-Clause':
              licenseFile = 'bsd-new';
              break;
            case 'BSD-4-Clause':
              licenseFile = 'bsd-original';
              break;
            case 'GPL-2.0':
              licenseFile = 'gpl-2';
              break;
            case 'GPL-3.0':
              licenseFile = 'gpl-3';
              break;
            case 'LGPL-3.0':
              licenseFile = 'lgpl-3';
              break;
            case 'MIT':
              licenseFile = 'mit';
              break;
            case 'Proprietary':
              licenseFile = 'proprietary';
              break;
          }

          this.config.set('projectLicenseFile', licenseFile);
        }
      }

      done();
    });
  }

  _dirs() {
    const done = this.async();
    const prompts = [
      {
        name: 'src',
        message: 'What is the source directory?',
        default: this.config.get('dirSrc')
      },
      {
        name: 'tests',
        message: 'What is the tests directory?',
        default: this.config.get('dirTests')
      },
      {
        name: 'build',
        message: 'What is the build directory?',
        default: this.config.get('dirBuild')
      },
      {
        name: 'public',
        message: 'What is the public directory?',
        default: this.config.get('dirPublic'),
        when: this.config.get('projectType') !== 'project'
      }
    ];

    this.prompt(prompts).then(answers => {
      this.config.set('dirSrc', answers.src);
      this.config.set('dirTests', answers.tests);
      this.config.set('dirBuild', answers.build);

      if (this.config.get('projectType') === 'project') {
        this.config.set('dirPublic', answers.public);
      }

      done();
    });
  }

  writing() {
    if (!this.config.get('controlDocs')) {
      return;
    }

    const configs = {
      accountStyleci: this.config.get('accountStyleci') === null ?
        null :
        this.config.get('accountStyleci') !== '' ? this.config.get('accountStyleci') : 'XXXXXXXX'
    };

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {...this.config.getAll(), ...configs}
    );

    this.fs.copyTpl(
      this.templatePath('CONTRIBUTING.md'),
      this.destinationPath('CONTRIBUTING.md'),
      this.config.getAll()
    );

    if (this.config.get('projectLicense') !== 'none') {
      this.fs.copyTpl(
        this.templatePath(path.join('license', this.config.get('projectLicenseFile'))),
        this.destinationPath('LICENSE'),
        this.config.getAll()
      );
    }
  }
};
