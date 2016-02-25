'use strict';

var yeoman = require('yeoman-generator');
var util = require('util');
var path = require('path');
var yosay = require('yosay');
var chalk = require('chalk');
var validator = require('validator');
var _ = require('underscore.string');
var mkdirp = require('mkdirp');
var shell = require('shelljs');
var fs = require('fs');

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

var BarePHP = module.exports = function BarePHP() {
  yeoman.generators.Base.apply(this, arguments);

  this.defaults = {
    controlRepository: true,
    controlDirs: false,
    controlLicense: true,
    controlPackagist: true,
    controlTravis: true,
    controlCoveralls: true,
    controlScrutinizer: true,
    controlStyleci: true,
    controlHomestead: true,
    controlDocs: true,
    controlPhpmyadmin: false,

    ownerName: null,
    ownerCanonical: null,
    ownerEmail: null,
    ownerHomepage: null,

    repositoryType: 'Github',
    repositoryHomepage: null,
    repositoryUrl: null,

    projectName: null,
    projectDescription: null,
    projectType: 'library',
    projectKeywords: [],
    projectHomepage: null,
    projectPhpVersion: 5.5,
    projectLicense: 'BSD-3-Clause',
    projectNamespace: null,

    dirSrc: 'src',
    dirTests: 'tests',
    dirDist: 'dist',
    dirPublic: 'public',

    accountRepository: null,
    accountPackagist: null,
    accountTravis: null,
    accountCoveralls: null,
    accountScrutinizer: null,
    accountStyleci: null,

    homesteadFormat: 'json'
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
    this.defaults.ownerName = _.clean(getUserHome().split(path.sep).pop());
  } else {
    this.defaults.ownerName = _.clean(shell.exec('git config --global user.name', {silent: true}).output, '\n');
    this.defaults.ownerEmail = _.clean(shell.exec('git config --global user.email', {silent: true}).output, '\n');
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

BarePHP.prototype.welcome = function() {
  this.log(
    yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Travis, Grunt, and many, many more integrations!')
  );
};

BarePHP.prototype.askForMode = function() {
  var done = this.async();
  var prompts = [
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

BarePHP.prototype.askForOwner = function() {
  var done = this.async();
  var prompts = [
        {
          name: 'name',
          message: 'What is your name?',
          default: this.config.get('ownerName')
        },
        {
          name: 'email',
          message: 'What is your email?',
          default: this.config.get('ownerEmail')
        },
        {
          name: 'homepage',
          message: 'What is your homepage?',
          default: this.config.get('ownerHomepage')
        }
      ];

  this.prompt(prompts, function(props) {
    this.config.set('ownerName', _.clean(props.name));
    this.config.set('ownerCanonical', _.cleanDiacritics(_.clean(props.name)).replace(/\s+/g, '_').toLowerCase());
    this.config.set('ownerHomepage', _.clean(props.homepage).split(' ').shift());

    var ownerEmail = _.clean(props.email).split(' ').shift();
    if (!validator.isEmail(ownerEmail)) {
      throw new Error(util.format('"%s" is not a valid email', ownerEmail));
    }
    this.config.set('ownerEmail', ownerEmail);

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepositoryUse = function() {
  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'useRepository',
      message: 'Would you like to assign a public repository (Github/Bitbucket)?',
      default: this.config.get('controlRepository')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('controlRepository', props.useRepository);

    done();
  }.bind(this));
};

BarePHP.prototype.askForRepository = function() {
  if (!this.config.get('controlRepository')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'type',
      message: 'What repository is the project hosted on?',
      choices: ['Github', 'Bitbucket'],
      default: this.config.get('repositoryType')
    },
    {
      name: 'account',
      message: 'What is your repository account name?',
      default: this.config.get('accountRepository') ?
        this.config.get('accountRepository') :
        this.config.get('ownerCanonical')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('repositoryType', props.type);

    var accountRepository = _.cleanDiacritics(_.clean(props.account)).replace(/\s+/g, '_');

    this.config.set('accountPackagist', accountRepository);
    this.config.set('accountTravis', accountRepository);
    this.config.set('accountCoveralls', accountRepository);
    this.config.set('accountScrutinizer', accountRepository);
    this.config.set('accountStyleci', 'XXXXXXXX');

    switch (this.config.get('repositoryType')) {
      case 'Github':
        this.config.set('repositoryHomepage', 'https://github.com/' + accountRepository + '/');
        this.config.set('repositoryUrl', 'git@github.com:' + accountRepository + '/');
        break;
      case 'Bitbucket':
        this.config.set('repositoryHomepage', 'https://bitbucket.org/' + accountRepository + '/');
        this.config.set('repositoryUrl', 'git@bitbucket.org:' + accountRepository + '/');
        break;
    }

    this.config.set('accountRepository', accountRepository);

    done();
  }.bind(this));
};

BarePHP.prototype.askForProject = function() {
  var done = this.async();
  var prompts = [
    {
      name: 'name',
      message: 'What is the project name?',
      default: this.config.get('projectName') ?
        this.config.get('projectName') :
        _.camelize(process.cwd().split(path.sep).pop())
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('projectName', _.clean(props.name).replace(/\s+/g, '_'));

    if (!this.config.get('projectNamespace')) {
      this.config.set('projectNamespace', _.capitalize(_.camelize(_.trim(props.name))));
    }

    if (this.config.get('controlRepository')) {
      this.config.set(
        'repositoryHomepage',
        this.config.get('repositoryHomepage') + this.config.get('projectName')
      );
      this.config.set(
        'repositoryUrl',
        this.config.get('repositoryUrl') + this.config.get('projectName') + '.git');
    }

    done();
  }.bind(this));
};

BarePHP.prototype.askForProjectContinue = function() {
  if (this.configs.quickMode) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'description',
      message: 'What is the project description?',
      default: this.config.get('projectDescription')
    },
    {
      type: 'list',
      name: 'type',
      message: 'What type is the project?',
      choices: ['library', 'project', 'metapackage', 'composer-plugin'],
      default: this.config.get('projectType')
    },
    {
      name: 'keywords',
      message: 'What are the project keywords?'  +
        (this.config.get('projectKeywords').length ? '' : ' (comma separated)'),
      default: this.config.get('projectKeywords').join(', ')
    },
    {
      name: 'homepage',
      message: 'What is the project homepage?',
      default: this.config.get('projectHomepage') ?
        this.config.get('projectHomepage') :
        (this.config.get('controlRepository') ? this.config.get('repositoryHomepage') : '')
    }
  ];

  this.prompt(prompts, function(props) {
    props.keywords = _.clean(props.keywords);

    this.config.set('projectDescription', _.trim(props.description));
    this.config.set('projectType', props.type.toLowerCase());
    this.config.set(
      'projectKeywords',
      props.keywords.length ? props.keywords.replace(/(\s+)?,\s+?/g, ',').replace(/,$/, '').split(',') : []
    );

    var projectHomepage  = _.trim(props.homepage).split(' ').shift();
    if (projectHomepage !== '' && !validator.isURL(projectHomepage)) {
      throw new Error(util.format('"%s" is not a valid URL', projectHomepage));
    }
    this.config.set('projectHomepage', projectHomepage);

    done();
  }.bind(this));
};

BarePHP.prototype.askForProjectContinue2 = function() {
  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'phpVersion',
      message: 'What is the minimum supported PHP version for the project?',
      choices: ['5.5', '5.6', '7.0'],
      default: this.config.get('projectPhpVersion').toString()
    },
    {
      name: 'namespace',
      message: 'What is the base namespace of the project?',
      default: this.config.get('projectNamespace')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('projectNamespace', this.config.get('projectNamespace'));

    var phpVersion = parseFloat(props.phpVersion);
    if (phpVersion > this.configs.project.testPhpVersion) {
      this.configs.project.testPhpVersion = phpVersion;
    }
    this.config.set('projectPhpVersion', phpVersion);

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicenseUse = function() {
  if (this.configs.quickMode) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'useLicense',
      message: 'Would you like to assign a license?',
      default: this.config.get('controlLicense')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('controlLicense', props.useLicense);

    done();
  }.bind(this));
};

BarePHP.prototype.askForLicense = function() {
  if (this.configs.quickMode || !this.config.get('controlLicense')) {
    return;
  }

  var done = this.async();
  var prompts = [
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
      default: this.config.get('projectLicense')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('projectLicense', props.license);

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
        this.config.set('projectLicense', 'proprietary');
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

  var done = this.async();
  var prompts = [
    {
      type: 'checkbox',
      name: 'xtras',
      message: 'Which of this extra tools would you like to include?',
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
          value: 'homestead',
          name: 'Laravel Homestead',
          checked: this.config.get('controlHomestead')
        },
        {
          value: 'docs',
          name: 'Basic documentation',
          checked: this.config.get('controlDocs')
        }
      ]
    }
  ];

  this.prompt(prompts, function(props) {
    var hasMod = function(mod) { return props.xtras.indexOf(mod) !== -1; };

    this.config.set('controlPackagist', hasMod('packagist'));
    this.config.set('controlTravis', hasMod('travis'));
    this.config.set('controlCoveralls', hasMod('coveralls'));
    this.config.set('controlScrutinizer', hasMod('scrutinizer'));
    this.config.set('controlStyleci', hasMod('styleci'));
    this.config.set('controlHomestead', hasMod('homestead'));
    if (!hasMod('homestead')) {
      this.config.set('control_mysql', false);
    }
    this.config.set('controlDocs', hasMod('docs'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForPackagistAccount = function() {
  if (this.configs.quickMode || !this.config.get('controlPackagist')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Packagist account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountPackagist') :
        this.config.get('ownerCanonical')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountPackagist', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForTravisAccount = function() {
  if (this.configs.quickMode || !this.config.get('controlTravis')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Travis account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountTravis') :
        this.config.get('ownerCanonical')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountTravis', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForCoverallsAccount = function() {
  if (this.configs.quickMode || !this.config.get('controlCoveralls')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Coveralls account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountCoveralls') :
        this.config.get('ownerCanonical')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('accountCoveralls', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForScrutinizerAccount = function() {
  if (this.configs.quickMode || !this.config.get('controlScrutinizer')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your Scrutinizer account name?',
      default: this.config.get('controlRepository') ?
        this.config.get('accountScrutinizer') :
        this.config.get('ownerCanonical')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('account.scrutinizer', _.clean(props.account).replace(/\s+/g, '_'));

    done();
  }.bind(this));
};

BarePHP.prototype.askForStyleciAccount = function() {
  if (this.configs.quickMode || !this.config.get('controlStyleci')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      name: 'account',
      message: 'What is your StyleCI account number?',
      default: this.config.get('accountStyleci')
    }
  ];

  this.prompt(prompts, function(props) {
    var accountStyleci = _.clean(props.account).replace(/\s+/g, '_');
    if (accountStyleci === '') {
      accountStyleci = 'XXXXXXXX';
    }
    this.config.set('accountStyleci', accountStyleci);

    done();
  }.bind(this));
};

BarePHP.prototype.askForHomestead = function() {
  if (this.configs.quickMode || !this.config.get('controlHomestead')) {
    return;
  }

  var done = this.async();
  var prompts = [
    {
      type: 'list',
      name: 'format',
      message: 'What Laravel Homestead configuration format you want to use?',
      choices: ['JSON', 'YAML'],
      default: this.config.get('homesteadFormat').toUpperCase()
    },
    {
      type: 'confirm',
      name: 'usePhpmyadmin',
      message: 'Would you like to install PhpMyAdmin in Laravel Homestead?',
      default: this.config.get('controlPhpmyadmin')
    }
  ];

  this.prompt(prompts, function(props) {
    switch (props.format.toLowerCase()) {
      case 'json':
      case 'yaml':
        this.config.set('homesteadFormat', props.format.toLowerCase());
        break;
    }

    this.config.set('controlPhpmyadmin', props.usePhpmyadmin);

    done();
  }.bind(this));
};

BarePHP.prototype.askForChangeDirs = function() {
  var defaultDirs = this.config.get('dirSrc') +
    ', ' + this.config.get('dirTests') +
    ', ' + this.config.get('dirDist');
  if (this.config.get('controlHomestead')) {
    defaultDirs += ', ' + this.config.get('dirPublic');
  }

  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'changeDirs',
      message: util.format('Would you like to change default directories (%s)?', defaultDirs),
      default: this.config.get('controlDirs')
    }
  ];

  this.prompt(prompts, function(props) {
    this.config.set('controlDirs', props.changeDirs);

    done();
  }.bind(this));
};

BarePHP.prototype.askForCustomDirs = function() {
  if (!this.config.get('controlDirs')) {
    return;
  }

  var done = this.async();
  var prompts = [
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
      name: 'dist',
      message: 'What is the distribution directory?',
      default: this.config.get('dirDist')
    }
  ];

  if (this.config.get('controlHomestead')) {
    prompts.push({
      name: 'public',
      message: 'What is the public directory?',
      default: this.config.get('dirPublic')
    });
  }

  this.prompt(prompts, function(props) {
    this.config.set('dirSrc', props.src);
    this.config.set('dirTests', props.tests);
    this.config.set('dirDist', props.dist);

    if (this.config.get('controlHomestead')) {
      this.config.set('dirPublic', props.public);
    }

    done();
  }.bind(this));
};

BarePHP.prototype.writing = {
  createViewParameters: function() {
    this.underscoreString = _;

    this.control = {
      repository: this.config.get('controlRepository'),
      dirs: this.config.get('controlDirs'),
      license: this.config.get('controlLicense'),
      packagist: this.config.get('controlPackagist'),
      travis: this.config.get('controlTravis'),
      coveralls: this.config.get('controlCoveralls'),
      scrutinizer: this.config.get('controlScrutinizer'),
      styleci: this.config.get('controlStyleci'),
      homestead: this.config.get('controlHomestead'),
      docs: this.config.get('controlDocs'),
      phpmyadmin: this.config.get('controlPhpmyadmin')
    };

    this.owner = {
      name: this.config.get('ownerName'),
      canonical: this.config.get('ownerCanonical'),
      email: this.config.get('ownerEmail'),
      homepage: this.config.get('ownerHomepage')
    };

    this.repository = {
      type: this.config.get('repositoryType'),
      homepage: this.config.get('repositoryHomepage'),
      url: this.config.get('repositoryUrl')
    };

    this.project = {
      name: this.config.get('projectName'),
      description: this.config.get('projectDescription'),
      type: this.config.get('projectType'),
      keywords: this.config.get('projectKeywords'),
      homepage: this.config.get('projectHomepage'),
      phpVersion: this.config.get('projectPhpVersion'),
      testPhpVersion: this.configs.project.testPhpVersion,
      license: this.config.get('projectLicense'),
      namespace: this.config.get('projectNamespace')
    };

    this.dir = {
      src: this.config.get('dirSrc'),
      tests: this.config.get('dirTests'),
      dist: this.config.get('dirDist'),
      public: this.config.get('dirPublic')
    };

    this.account = {
      repository: this.config.get('accountRepository'),
      packagist: this.config.get('accountPackagist'),
      travis: this.config.get('accountTravis'),
      coveralls: this.config.get('accountCoveralls'),
      scrutinizer: this.config.get('accountScrutinizer'),
      styleci: this.config.get('accountStyleci')
    };

    this.homestead = {
      format: this.config.get('homesteadFormat')
    };
  },

  createDirs: function() {
    console.log('\nWriting project files ...\n');

    mkdirp(this.config.get('dirSrc'));
    mkdirp(this.config.get('dirTests') + '/' + _.capitalize(_.camelize(this.config.get('projectName'))));

    if (this.config.get('controlHomestead')) {
      mkdirp('.vagrant');
      mkdirp(this.config.get('dirPublic'));
    }
  },

  writeFiles: function() {
    this.copy('../../templates/editorconfig', '.editorconfig');
    this.template('../../templates/_gitattributes', '.gitattributes');
    this.template('../../templates/_gitignore', '.gitignore');

    this.template('../../templates/_composer.json', 'composer.json');
    this.template('../../templates/_package.json', 'package.json');
    this.template('../../templates/_Gruntfile.js', 'Gruntfile.js');

    this.template('../../templates/code/_Greeter.php', this.config.get('dirSrc') + '/Greeter.php');
    this.template(
      '../../templates/code/_GreeterTest.php',
      this.config.get('dirTests') + '/' +
        _.capitalize(_.camelize(this.config.get('projectName'))) + '/GreeterTest.php'
    );
    this.template('../../templates/code/_bootstrap.php', this.config.get('dirTests') + '/bootstrap.php');

    this.template('../../templates/_phpunit.xml', 'phpunit.xml');
  },

  writeXtraFiles: function() {
    if (this.config.get('controlTravis')) {
      this.template('../../templates/extra/_travis.yml', '.travis.yml');
    }
    if (this.config.get('controlCoveralls')) {
      this.template('../../templates/extra/_coveralls.yml', '.coveralls.yml');
    }
    if (this.config.get('controlScrutinizer')) {
      this.template('../../templates/extra/_scrutinizer.yml', '.scrutinizer.yml');
    }
    if (this.config.get('controlStyleci')) {
      this.template('../../templates/extra/styleci.yml', '.styleci.yml');
    }
    if (this.config.get('controlHomestead')) {
      this.template('../../templates/extra/_index.php', this.config.get('dirPublic') + '/index.php');
      this.template(
        '../../templates/extra/_homestead.' + this.config.get('homesteadFormat'),
        '.vagrant/homestead.' + this.config.get('homesteadFormat')
      );
      this.template('../../templates/extra/_after.sh', '.vagrant/after.sh');
      this.copy('../../templates/extra/aliases', '.vagrant/aliases');
      this.copy('../../templates/extra/vagrant_gitignore', '.vagrant/.gitignore');
      this.copy('../../templates/extra/Vagrantfile', 'Vagrantfile');
    }
    if (this.config.get('controlDocs')) {
      this.template('../../templates/docs/_CONTRIBUTING.md', 'CONTRIBUTING.md');
      this.template('../../templates/docs/_README.md', 'README.md');
    }
    if (this.config.get('controlLicense') && this.config.get('projectLicense') !== 'proprietary') {
      this.template('../../templates/license/' + this.configs.project.licenseFile, 'LICENSE');
    }
  }
};

BarePHP.prototype.install = function() {
  var projectName = this.config.get('projectName');

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
