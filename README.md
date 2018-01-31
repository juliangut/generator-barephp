[![Latest Version](https://img.shields.io/npm/v/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![License](https://img.shields.io/github/license/juliangut/generator-barephp.svg?style=flat-square)](https://github.com/juliangut/generator-barephp/blob/master/LICENSE)

[![Build status](https://img.shields.io/travis/juliangut/generator-barephp.svg?style=flat-square)](https://travis-ci.org/juliangut/generator-barephp)
[![Total Downloads](https://img.shields.io/npm/dt/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![Monthly Downloads](https://img.shields.io/npm/dm/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![Downloads Statistics](https://img.shields.io/badge/downloads-statistics-%23aa000.svg?style=flat-square)](https://npm-stat.com/charts.html?package=generator-barephp)

# Generator-BarePHP

#### PHP project scaffold with lots of integrations

Normally when starting a new PHP project you'd just copy/paste configuration files from another project in order to set the project environment ready as quickly as possible, but you'll forget to copy some files and more often than not you'll forget to change names or routes on those files.

> Scaffolding project environments with the same files once and again is painfully boring, error prone, and leaves a feeling of time waste.

Let Yeoman do the heavy lifting and get your projects scaffold and ready to start developing in a breeze with this generator, it will prepare a shiny and clean PHP project structure ready to develop for you, sit and focus on the actual code.

### Features

* Project complies with [pds/skeleton](https://github.com/php-pds/skeleton) directory structure
* Load existing configuration from composer.json
* Git use is assumed by default (.gitignore and .gitattributes included)
* Integration with Github and Bitbucket accounts
* Composer ready (global/local detection, or local installation)
* Project ready to be added to [Packagist](https://packagist.org)
* Select minimum [supported PHP version](https://secure.php.net/supported-versions.php) (from 5.6 up)
* Symfony polyfills compatibility packages included based on minimum supported PHP version
* [Editorconfig](http://editorconfig.org/) definitions file
* Development environment integration
  * [Docker](https://www.docker.com/) integration (with docker-compose)
  * [Laravel Homestead](https://laravel.com/docs/5.3/homestead) (Vagrant) integration (optionally with PhpMyAdmin)
    * Integration with [Vagrant hostupdater](https://github.com/cogitatio/vagrant-hostsupdater) plugin if installed
* QA utilities configured and integrated into Composer scripts and Travis build
  * PHP syntax linting
  * [PHPUnit](http://phpunit.de/) testing environment
  * [Infection](https://github.com/infection/infection/) mutation testing framework
  * [Editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker.php) for editorconfig adherence
  * [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) for PSR2 coding standard checking
  * [PHP-CS-Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) for automatically fixing coding style
  * [PHPMD](https://github.com/phpmd/phpmd) for [code smell](https://en.wikipedia.org/wiki/Code_smell) detection
  * [PHPMND](https://github.com/povils/phpmnd) for [magic code](https://en.wikipedia.org/wiki/Magic_number_(programming)#Unnamed_numerical_constants) detection
  * [PHPCPD](https://github.com/sebastianbergmann/phpcpd) for copy/paste detection
  * Composer [outdated](https://getcomposer.org/doc/03-cli.md#outdated) for packages updates availability check
* External tools
  * Already configured [Travis CI](https://travis-ci.org) integration (PHP >=5.6, and nightly)
  * [Coveralls](https://coveralls.io) integration (triggered by Travis build)
  * [Scrutinizer](https://scrutinizer-ci.com) integration
  * [StyleCI](https://styleci.io) integration
* Initial documentation structure in [Markdown](https://daringfireball.net/projects/markdown/syntax)
* Basic annotated kickoff code (with tests and coverage report!)
* Common [SPDX FOSS license](http://spdx.org/licenses) selection
  * [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html)
  * [BSD-2-Clause](https://spdx.org/licenses/BSD-2-Clause.html)
  * [BSD-3-Clause](https://spdx.org/licenses/BSD-3-Clause.html)
  * [BSD-4-Clause](https://spdx.org/licenses/BSD-4-Clause.html)
  * [GPL-3.0](https://spdx.org/licenses/GPL-3.0.html)
  * [LGPL-3.0](https://spdx.org/licenses/LGPL-3.0.html)
  * [MIT](https://spdx.org/licenses/MIT.html) (default)

> Would you like to see a tool, library, configuration, ... added to the generator? file an issue with your feature request

#### Quick assistant / fast mode

As the list options and tools configured is quite long a quick/fast mode has been introduced. In fast mode only the basic questions will be asked and then the generator will do its best guessing the rest for you to get the environment ready faster.

## Getting Started

### Install generator

```
npm install -g generator-barephp
```

## Usage

Once the generator and dependencies are installed you can start using it by calling Yeoman

```
yo barephp
```

### Post run configuration

`barephp` generator comes with many pre-configured tools and services ready to be used, anyway some of them need extra setup once generator has finished:

* Packagist: your package must be [submitted](https://packagist.org/packages/submit) to be available
* Travis CI: you need to activate the project repository in your profile page
* Coveralls: the project repository needs to be [activated](https://coveralls.io/repos/new)
* Scrutinizer: rhe repository has to be added to [Scrutinizer](https://scrutinizer-ci.com)
* StyleCI: enable the repo on your [account](https://styleci.io/account), then update StyleCI badge's repository code on README.md file.

If you install Laravel Homestead then nginx will be automatically configured to serve your project from **http://`project-name`.app** url.

If you installed PhpMyAdmin within Laravel Homestead it will be available at **http://phpmyadmin-`project-name`.app** url.

*VirtualBox constraints hostname to only contain letters, numbers, hyphens and dots and so nginx has been configure to serve with those names for consistency*

If you have Vagrant hostupdater plugin installed then host's `/etc/hosts` will be automatically updated every time you start/stop Vagrant (sudo privileges needed), otherwise you should configure hosts file manually.

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/generator-barephp/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/juliangut/generator-barephp/blob/master/CONTRIBUTING.md)

## License

See file [LICENSE](https://github.com/juliangut/generator-barephp/blob/master/LICENSE) included with the source code for a copy of the license terms.
