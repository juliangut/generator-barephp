'use strict';

var yeoman = require('yeoman-generator'),
    util = require('util'),
    path = require('path'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    validator = require('validator'),
    _ = require('underscore.string'),
    mkdirp = require('mkdirp'),
    shell = require('shelljs'),
    fs = require('fs');

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

var BarePHP = module.exports = function BarePHP() {
  yeoman.generators.Base.apply(this, arguments);

  this.underscoreString = _;

  this.defaults = {
    control_repository: true,
    control_dirs: false,
    control_license: true,
    control_packagist: true,
    control_travis: true,
    control_coveralls: true,
    control_scrutinizer: true,
    control_styleci: true,
    control_homestead: true,
    control_docs: true,
    control_phpmyadmin: false,

    owner_name: null,
    owner_canonical: null,
    owner_email: null,
    owner_homepage: null,

    repository_type: 'Github',
    repository_homepage: null,
    repository_url: null,

    project_name: null,
    project_description: null,
    project_type: 'library',
    project_keywords: [],
    project_homepage: null,
    project_php_version: 5.5,
    project_license: 'BSD-3-Clause',
    project_namespace: null,

    dir_src: 'src',
    dir_tests: 'tests',
    dir_dist: 'dist',
    dir_public: 'public',

    account_repository: null,
    account_packagist: null,
    account_travis: null,
    account_coveralls: null,
    account_scrutinizer: null,
    account_styleci: null,

    homestead_format: 'json'
  };

  this.configs = {
    quickMode: false,
    owner: {
      name: null,
      email: null,
      homepage: null
    },
    repository: {
      homepage: null
    },
    project: {
      description: null,
      type: null,
      keywords: [],
      homepage: null,
      license: null,
      testPhpVersion: 5.6,
      licenseFile: null
    }
  };

  if (!shell.which('git')) {
    this.defaults.owner_name = _.clean(getUserHome().split(path.sep).pop());
  } else {
    this.defaults.owner_name = _.clean(shell.exec('git config --global user.name', { silent: true }).output, '\n');
    this.defaults.owner_email = _.clean(shell.exec('git config --global user.email', { silent: true }).output, '\n');
  }

  this.config.defaults(this.defaults);

  if (fs.existsSync('composer.json')) {
    var configs = JSON.parse(fs.readFileSync('composer.json'));

    this.configs.project.description = configs.description;
    this.configs.project.type = configs.type;
    this.configs.project.keywords = configs.keywords ? configs.keywords : [];
    this.configs.project.homepage = configs.homepage;
    this.configs.project.license = configs.license;
  }
};

util.inherits(BarePHP, yeoman.generators.Base);

BarePHP.prototype.welcome = function () {
  this.log(
    yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Travis, Grunt, and many, many more integrations!')
  );
};

BarePHP.prototype.askForMode = function() {
  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'quick',
          message: 'Would you like the quick assistant?',
          default: this.configs.quickMode
        }
      ];

  this.prompt(prompts, function(props) {
    this.configs.quickMode = props.quick;

    done();
  }.bind(this));
};

BarePHP.prototype.askForOwner = function () {
  var done = this.async(),
      prompts = [
        {
          name: 'name',
          message: 'What is your name?',
          default: this.config.get('owner_name')
        },
        {
          name: 'email',
          message: 'What is your email?',
          default: this.config.get('owner_email')
        },
        {
          name: 'homepage',
          message: 'What is your homepage?',
          default: this.config.get('owner_homepage')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('owner_name', _.clean(props.name));
    this.config.set('owner_canonical', _.cleanDiacritics(_.clean(props.name)).replace(/\s+/g, '_').toLowerCase());
    this.config.set('owner_homepage', _.clean(props.homepage).split(' ').shift());

    var ownerEmail = _.clean(props.email).split(' ').shift();
    if (!validator.isEmail(ownerEmail)) {
      throw new Error(util.format('"%s" is not a valid email', ownerEmail));
    }
    this.config.set('owner_email', ownerEmail);

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepositoryUse = function() {
  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'useRepository',
          message: 'Would you like to assign a public repository (Github/Bitbucket)?',
          default: this.config.get('control_repository')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('control_repository', props.useRepository);

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepository = function () {
  if (!this.config.get('control_repository')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'type',
          message: 'What repository is the project hosted on?',
          choices: ['Github', 'Bitbucket'],
          default: this.config.get('repository_type')
        },
        {
          name: 'account',
          message: 'What is your repository account name?',
          default: this.config.get('account_repository')
            ? this.config.get('account_repository') :
            this.config.get('owner_canonical')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('repository_type', props.type);

    var accountRepository = _.cleanDiacritics(_.clean(props.account)).replace(/\s+/g, '_');

    this.config.set('account_packagist', accountRepository);
    this.config.set('account_travis', accountRepository);
    this.config.set('account_coveralls', accountRepository);
    this.config.set('account_scrutinizer', accountRepository);
    this.config.set('account_styleci', 'XXXXXXXX');

    switch (this.config.get('repository_type')) {
      case 'Github':
        this.config.set('repository_homepage', 'https://github.com/' + accountRepository + '/');
        this.config.set('repository_url', 'git@github.com:' + accountRepository + '/');
        break;
      case 'Bitbucket':
        this.config.set('repository_homepage', 'https://bitbucket.org/' + accountRepository + '/');
        this.config.set('repository_url', 'git@bitbucket.org:' + accountRepository + '/');
        break;
    }

    this.config.set('account_repository', accountRepository);

    done();
  }.bind(this));
};

BarePHP.prototype.askForProject = function () {
  var done = this.async(),
      prompts = [
        {
          name: 'name',
          message: 'What is the project name?',
          default: this.config.get('project_name')
            ? this.config.get('project_name')
            : _.camelize(process.cwd().split(path.sep).pop())
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('project_name', _.clean(props.name).replace(/\s+/g, '_'));

    if (!this.config.get('project_namespace')) {
      this.config.set('project_namespace', _.capitalize(_.camelize(_.trim(props.name))));
    }

    if (this.config.get('control_repository')) {
      this.config.set(
        'repository_homepage',
        this.config.get('repository_homepage') + this.config.get('project_name')
      );
      this.config.set(
        'repository_url',
        this.config.get('repository_url') + this.config.get('project_name') + '.git');
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForProjectContinue = function () {
  if (this.configs.quickMode) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'description',
          message: 'What is the project description?',
          default: this.config.get('project_description')
        },
        {
          type: 'list',
          name: 'type',
          message: 'What type is the project?',
          choices: ['library', 'project', 'metapackage', 'composer-plugin'],
          default: this.config.get('project_type')
        },
        {
          name: 'keywords',
          message: 'What are the project keywords?'
            + (this.config.get('project_keywords').length ? '' : ' (comma separated)'),
          default: this.config.get('project_keywords').join(', ')
        },
        {
          name: 'homepage',
          message: 'What is the project homepage?',
          default: this.config.get('project_homepage')
            ? this.config.get('project_homepage')
            : (this.config.get('control_repository') ? this.config.get('repository_homepage') : '')
        }
      ];

  this.prompt(prompts, function(props) {
    props.keywords = _.clean(props.keywords);

    this.config.set('project_description', _.trim(props.description));
    this.config.set('project_type', props.type.toLowerCase());
    this.config.set(
      'project_keywords',
      props.keywords.length ? props.keywords.replace(/(\s+)?,\s+?/g, ',').replace(/,$/, '').split(',') : []
    );

    var projectHomepage  = _.trim(props.homepage).split(' ').shift();
    if (projectHomepage !== '' && !validator.isURL(projectHomepage)) {
      throw new Error(util.format('"%s" is not a valid URL', projectHomepage));
    }
    this.config.set('project_homepage', projectHomepage);

    done();
  }.bind(this));
};

BarePHP.prototype.askForProjectContinue2 = function () {
  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'phpVersion',
          message: 'What is the minimum supported PHP version for the project?',
          choices: ['5.5', '5.6', '7.0'],
          default: this.config.get('project_php_version').toString()
        },
        {
          name: 'namespace',
          message: 'What is the base namespace of the project?',
          default: this.config.get('project_namespace')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('project_namespace', this.config.get('project_namespace'));

    var phpVersion = parseFloat(props.phpVersion);
    if (phpVersion > this.configs.project.testPhpVersion) {
      this.configs.project.testPhpVersion = phpVersion;
    }
    this.config.set('project_php_version', phpVersion);

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicenseUse = function() {
  if (this.configs.quickMode) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'useLicense',
          message: 'Would you like to assign a license?',
          default: this.config.get('control_license')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('control_license', props.useLicense);

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicense = function() {
  if (this.configs.quickMode || !this.config.get('control_license')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'license',
          message: 'What is the license you want to use?',
          choices: [
            'BSD-3-Clause',
            'BSD-2-Clause',
            'BSD-4-Clause',
            'MIT',
            'GPL-3.0',
            'LGPL-3.0',
            'Apache-2.0',
            'Proprietary'
          ],
          default: this.config.get('project_license')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('project_license', props.license);

    var licenseFile = '';
    switch (props.license) {
      case 'BSD-3-Clause':
        licenseFile = 'bsd-new';
        break;
      case 'BSD-2-Clause':
        licenseFile = 'bsd-free';
        break;
      case 'BSD-4-Clause':
        licenseFile = 'bsd-original';
        break;
      case 'MIT':
        licenseFile = 'mit';
        break;
      case 'GPL-3.0':
        licenseFile = 'gpl';
        break;
      case 'LGPL-3.0':
        licenseFile = 'lgpl';
        break;
      case 'Apache-2.0':
        licenseFile = 'apache';
        break;
      case 'Proprietary':
        this.config.set('project_license', 'proprietary');
        break;
    }

    this.configs.project.licenseFile = licenseFile;

    done();
  }.bind(this));
};

BarePHP.prototype.askForInstall = function() {
  if (this.configs.quickMode) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'checkbox',
          name: 'xtras',
          message: 'Which of this extra tools would you like to include?',
          choices: [
            {
              value: 'packagist',
              name: 'Packagist',
              checked: this.config.get('control_packagist')
            },
            {
              value: 'travis',
              name: 'Travis',
              checked: this.config.get('control_travis')
            },
            {
              value: 'coveralls',
              name: 'Coveralls',
              checked: this.config.get('control_coveralls')
            },
            {
              value: 'scrutinizer',
              name: 'Scrutinizer',
              checked: this.config.get('control_scrutinizer')
            },
            {
              value: 'styleci',
              name: 'StyleCI',
              checked: this.config.get('control_styleci')
            },
            {
              value: 'homestead',
              name: 'Laravel Homestead',
              checked: this.config.get('control_homestead')
            },
            {
              value: 'docs',
              name: 'Basic documentation',
              checked: this.config.get('control_docs')
            }
          ]
        }
      ];

  this.prompt(prompts, function(props) {
    var hasMod = function (mod) { return props.xtras.indexOf(mod) !== -1; };

    this.config.set('control_packagist', hasMod('packagist'));
    this.config.set('control_travis', hasMod('travis'));
    this.config.set('control_coveralls', hasMod('coveralls'));
    this.config.set('control_scrutinizer', hasMod('scrutinizer'));
    this.config.set('control_styleci', hasMod('styleci'));
    this.config.set('control_homestead', hasMod('homestead'));
    if (!hasMod('homestead')) {
      this.config.set('control_mysql', false);
    }
    this.config.set('control_docs', hasMod('docs'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForPackagistAccount = function() {
  if (this.configs.quickMode || !this.config.get('control_packagist')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Packagist account name?',
          default: this.config.get('control_repository')
            ? this.config.get('account_packagist')
            : this.config.get('owner_canonical')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('account_packagist', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForTravisAccount = function() {
  if (this.configs.quickMode || !this.config.get('control_travis')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Travis account name?',
          default: this.config.get('control_repository')
            ? this.config.get('account_travis')
            : this.config.get('owner_canonical')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('account_travis', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForCoverallsAccount = function() {
  if (this.configs.quickMode || !this.config.get('control_coveralls')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Coveralls account name?',
          default: this.config.get('control_repository')
            ? this.config.get('account_coveralls')
            : this.config.get('owner_canonical')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('account_coveralls', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForScrutinizerAccount = function() {
  if (this.configs.quickMode || !this.config.get('control_scrutinizer')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your Scrutinizer account name?',
          default: this.config.get('control_repository')
            ? this.config.get('account_scrutinizer')
            : this.config.get('owner_canonical')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('account.scrutinizer', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForStyleciAccount = function() {
  if (this.configs.quickMode || !this.config.get('control_styleci')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'account',
          message: 'What is your StyleCI account number?',
          default: this.config.get('account_styleci')
        }
      ];

  this.prompt(prompts, function(props) {
    var accountStyleci = _.clean(props.account).replace(/\s+/g, '_');
    if (accountStyleci === '') {
      accountStyleci = 'XXXXXXXX';
    }
    this.config.set('account_styleci', accountStyleci);

    done();
  }.bind(this));
};

BarePHP.prototype.askForHomestead = function() {
  if (this.configs.quickMode || !this.config.get('control_homestead')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          type: 'list',
          name: 'format',
          message: 'What Laravel Homestead configuration format you want to use?',
          choices: ['JSON', 'YAML'],
          default: this.config.get('homestead_format').toUpperCase()
        },
        {
          type: 'confirm',
          name: 'usePhpmyadmin',
          message: 'Would you like to install PhpMyAdmin in Laravel Homestead?',
          default: this.config.get('control_phpmyadmin')
        }
      ];

  this.prompt(prompts, function(props) {
    switch (props.format.toLowerCase()) {
      case 'json':
      case 'yaml':
        this.config.set('homestead_format', props.format.toLowerCase());
        break;
    }

    this.config.set('control_phpmyadmin', props.usePhpmyadmin);

    done();
  }.bind(this));
};

BarePHP.prototype.askForChangeDirs = function() {
  var defaultDirs = this.config.get('dir_src')
    + ', ' + this.config.get('dir_tests')
    + ', ' + this.config.get('dir_dist');
  if (this.config.get('control_homestead')) {
    defaultDirs += ', ' + this.config.get('dir_public');
  }

  var done = this.async(),
      prompts = [
        {
          type: 'confirm',
          name: 'changeDirs',
          message: util.format('Would you like to change default directories (%s)?', defaultDirs),
          default: this.config.get('control_dirs')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('control_dirs', props.changeDirs);

    done();
  }.bind(this));
};

BarePHP.prototype.askForCustomDirs = function() {
  if (!this.config.get('control_dirs')) {
    return;
  }

  var done = this.async(),
      prompts = [
        {
          name: 'src',
          message: 'What is the source directory?',
          default: this.config.get('dir_src')
        },
        {
          name: 'tests',
          message: 'What is the tests directory?',
          default: this.config.get('dir_tests')
        },
        {
          name: 'dist',
          message: 'What is the distribution directory?',
          default: this.config.get('dir_dist')
        }
      ];

  if (this.config.get('control_homestead')) {
    prompts.push({
      name: 'public',
      message: 'What is the public directory?',
      default: this.config.get('dir_public')
    });
  }

  this.prompt(prompts, function(props) {
    this.config.set('dir_src', props.src);
    this.config.set('dir_tests', props.tests);
    this.config.set('dir_dist', props.dist);

    if (this.config.get('control_homestead')) {
      this.config.set('dir_public', props.public);
    }

    done();
  }.bind(this));
};

BarePHP.prototype.writing = {
  create: function() {
    this.control = {
      repository: this.config.get('control_repository'),
      dirs: this.config.get('control_dirs'),
      license: this.config.get('control_license'),
      packagist: this.config.get('control_packagist'),
      travis: this.config.get('control_travis'),
      coveralls: this.config.get('control_coveralls'),
      scrutinizer: this.config.get('control_scrutinizer'),
      styleci: this.config.get('control_styleci'),
      homestead: this.config.get('control_homestead'),
      docs: this.config.get('control_docs'),
      phpmyadmin: this.config.get('control_phpmyadmin')
    };

    this.owner = {
      name: this.config.get('owner_name'),
      canonical: this.config.get('owner_canonical'),
      email: this.config.get('owner_email'),
      homepage: this.config.get('owner_homepage')
    };

    this.repository = {
      type: this.config.get('repository_type'),
      homepage: this.config.get('repository_homepage'),
      url: this.config.get('repository_url')
    };

    this.project = {
      name: this.config.get('project_name'),
      description: this.config.get('project_description'),
      type: this.config.get('project_type'),
      keywords: this.config.get('project_keywords'),
      homepage: this.config.get('project_homepage'),
      php_version: this.config.get('project_php_version'),
      test_php_version: this.configs.project.testPhpVersion,
      license: this.config.get('project_license'),
      namespace: this.config.get('project_namespace')
    };

    this.dir = {
      src: this.config.get('dir_src'),
      tests: this.config.get('dir_tests'),
      dist: this.config.get('dir_dist'),
      public: this.config.get('dir_public')
    };

    this.account = {
      repository: this.config.get('account_repository'),
      packagist: this.config.get('account_packagist'),
      travis: this.config.get('account_travis'),
      coveralls: this.config.get('account_coveralls'),
      scrutinizer: this.config.get('account_scrutinizer'),
      styleci: this.config.get('account_styleci')
    };

    this.homestead = {
      format: this.config.get('homestead_format')
    };
  },

  createDirs: function() {
    console.log('\nWriting project files ...\n');

    mkdirp(this.config.get('dir_src'));
    mkdirp(this.config.get('dir_tests') + '/' + _.capitalize(_.camelize(this.config.get('project_name'))));

    if (this.config.get('control_homestead')) {
      mkdirp('.vagrant');
      mkdirp(this.config.get('dir_public'));
    }
  },

  writeFiles: function() {
    this.copy('../../templates/editorconfig', '.editorconfig');
    this.template('../../templates/_gitattributes', '.gitattributes');
    this.template('../../templates/_gitignore', '.gitignore');

    this.template('../../templates/_composer.json', 'composer.json');
    this.template('../../templates/_package.json', 'package.json');
    this.template('../../templates/_Gruntfile.js', 'Gruntfile.js');

    this.template('../../templates/code/_Greeter.php', this.config.get('dir_src') + '/Greeter.php');
    this.template(
      '../../templates/code/_GreeterTest.php',
      this.config.get('dir_tests')
        + '/' + _.capitalize(_.camelize(this.config.get('project_name'))) + '/GreeterTest.php'
    );
    this.template('../../templates/code/_bootstrap.php', this.config.get('dir_tests') + '/bootstrap.php');

    this.template('../../templates/_phpunit.xml', 'phpunit.xml');
  },

  writeXtraFiles: function() {
    if (this.config.get('control_travis')) {
      this.template('../../templates/extra/_travis.yml', '.travis.yml');
    }
    if (this.config.get('control_coveralls')) {
      this.template('../../templates/extra/_coveralls.yml', '.coveralls.yml');
    }
    if (this.config.get('control_scrutinizer')) {
      this.template('../../templates/extra/_scrutinizer.yml', '.scrutinizer.yml');
    }
    if (this.config.get('control_styleci')) {
      this.template('../../templates/extra/styleci.yml', '.styleci.yml');
    }
    if (this.config.get('control_homestead')) {
      this.template('../../templates/extra/_index.php', this.config.get('dir_public') + '/index.php');
      this.template(
        '../../templates/extra/_homestead.' + this.config.get('homestead_format'),
        '.vagrant/homestead.' + this.config.get('homestead_format')
      );
      this.template('../../templates/extra/_after.sh', '.vagrant/after.sh');
      this.copy('../../templates/extra/aliases', '.vagrant/aliases');
      this.copy('../../templates/extra/vagrant_gitignore', '.vagrant/.gitignore');
      this.copy('../../templates/extra/Vagrantfile', 'Vagrantfile');
    }
    if (this.config.get('control_docs')) {
      this.template('../../templates/docs/_CONTRIBUTING.md', 'CONTRIBUTING.md');
      this.template('../../templates/docs/_README.md', 'README.md');
    }
    if (this.config.get('control_license') && this.config.get('project_license') !== 'proprietary') {
      this.template('../../templates/license/' + this.configs.project.licenseFile, 'LICENSE');
    }
  }
};

BarePHP.prototype.install = function () {
  var projectName = this.config.get('project_name');

  this.installDependencies({
    bower: false,
    callback: function() {
      var message = '\nProject ' + chalk.green.bold(projectName) + ' is set up and ready';

      if (!shell.which('composer')) {
        message += '\nRun ' + chalk.yellow.bold('composer install') + ' before starting development';
      } else {
        shell.exec('composer install');
      }

      console.log(message);
    }
  });
};
