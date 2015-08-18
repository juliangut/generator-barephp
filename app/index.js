'use strict';

var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var ini = require('ini');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('underscore.string');
var mkdirp = require('mkdirp');

function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

module.exports = yeoman.Base.extend({
    dirs: {
        source: 'src',
        tests: 'tests',
        build: 'dist'
    },
    project: {
        name: '',
        description: '',
        keywords: 'php',
        homepage: '',
        license: 'BSD-3-clause'
    },
    owner: {
        name: '',
        email: '',
        homepage: ''
    },

    initializing: function () {
        this.underscoreString = _;

        this.ownerName = getUserHome().split(path.sep).pop();

        var gitconfigFile = getUserHome() + '/.gitconfig';
        if (fs.lstatSync(gitconfigFile)) {
            var gitconfig = ini.parse(fs.readFileSync(gitconfigFile, 'utf-8'))

            this.owner.name = gitconfig.user.name || getUserHome().split(path.sep).pop();
            this.owner.email = gitconfig.user.email || '';
        }
    },

    askFor: function() {
        var done = this.async();

        this.log(yosay('\'Allo \'allo!\nOut of the box I include GIT, Composer, Travis, Grunt, and many more integrations'));

        var prompts = [
            {
                name: 'projectName',
                message: 'What is the name of your project?',
                default: path.join(getUserHome().split(path.sep).pop(), '/', _.slugify(process.cwd().split(path.sep).pop()))
            },
            {
                name: 'projectDescription',
                message: 'Add a project description'
            },
            {
                name: 'projectKeywords',
                message: 'What are the project keywords?',
                default: this.project.keywords
            },
            {
                name: 'projectHomepage',
                message: 'What is the project homepage?'
            },
            {
                type: 'list',
                name: 'projectLicense',
                message: 'What is the license you want to use?',
                choices: ['none', 'BSD-3-clause', 'BSD-2-clause', 'MIT', 'GPL', 'LGPL', 'Apache'],
                default: this.project.license
            },
            {
                name: 'ownerName',
                message: 'What is your name?',
                default: this.owner.name
            },
            {
                name: 'ownerEmail',
                message: 'What is your email?',
                default: this.owner.email
            },
            {
                name: 'ownerHomepage',
                message: 'What is your homepage?'
            },
            {
                type: 'confirm',
                name: 'changeDirs',
                message: 'Whould you like to change default directories?',
                default: false
            }
        ];

        this.prompt(prompts, function (answers) {
            this.project.name = answers.projectName;
            this.project.description = answers.projectDescription || this.project.name;
            this.project.keywords = answers.projectKeywords.split(' ') || '';
            this.project.homepage = answers.projectHomepage;
            this.project.license = answers.projectLicense;

            this.owner.name = answers.ownerName;
            this.owner.email = answers.ownerEmail;
            this.owner.homepage = answers.ownerHomepage;

            if (answers.changeDirs) {
                this.prompt(
                    [
                        {
                            name: 'sourceDir',
                            message: 'What is the source code directory?',
                            default: this.dirs.source
                        },
                        {
                            name: 'testsDir',
                            message: 'What is the tests directory?',
                            default: this.dirs.tests
                        },
                        {
                            name: 'buildDir',
                            message: 'What is the build directory?',
                            default: this.dirs.build
                        },
                    ],
                    function(answers) {
                        this.dirs.source = answers.sourceDir;
                        this.dirs.tests = answers.testsDir;
                        this.dirs.build = answers.buildDir;

                        done();
                    }.bind(this)
                );
            } else {
                done();
            }
        }.bind(this));
    },

    writing: {
        license: function() {
            if (this.project.license == 'none') {
                return;
            }

            var licenseFile = 'LICENSE-newbsd';

            switch (this.project.license) {
                case 'BSD-3-clause':
                    break;
                case 'BSD-2-clause':
                    licenseFile = 'LICENSE-freebsd';
                    break;
                case 'MIT':
                    licenseFile = 'LICENSE-mit';
                    break;
                case 'GPL':
                    licenseFile = 'LICENSE-gpl';
                    break;
                case 'LGPL':
                    licenseFile = 'LICENSE-lgpl';
                    break;
                case 'Apache':
                    licenseFile = 'LICENSE-apache';
                    break;
            }

            this.template(licenseFile, 'LICENSE');
        },

        writefiles: function() {
            this.copy('gitignore', '.gitignore');
            this.copy('gitattributes', '.gitattributes');
            this.copy('editorconfig', '.editorconfig');
            this.template('composer.json', 'composer.json');
            this.template('package.json', 'package.json');
            this.template('Gruntfile.js', 'Gruntfile.js');
            this.template('travis.yaml', '.travis.yaml');
            this.template('scrutinizer.yaml', '.scrutinizer.yaml');
            this.template('CONTRIBUTING.md', 'CONTRIBUTING.md');
            this.template('README.md', 'README.md');

            this.template('bootstrap.php', this.dirs.tests + '/bootstrap.php');
            this.template('phpcs.xml.dist', 'phpcs.xml.dist');
            this.template('phpmd.xml.dist', 'phpmd.xml.dist');
            this.template('phpunit.xml.dist', 'phpunit.xml.dist');
        },

        createDirs: function() {
            mkdirp('./' + this.dirs.source);
            mkdirp('./' + this.dirs.tests);
        }
    },

    end: function () {
        var message = '\n' + chalk.green(this.project.name) + ' project is set up and ready' +
            '\nRemember to run ' +
            chalk.yellow.bold('npm install & composer install') + ' before starting development';

        this.log(message);
    }
});
