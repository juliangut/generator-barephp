[![Latest Version](https://img.shields.io/npm/v/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![License](https://img.shields.io/github/license/juliangut/generator-barephp.svg?style=flat-square)](https://github.com/juliangut/generator-barephp/blob/master/LICENSE)

[![Build status](https://img.shields.io/travis/juliangut/generator-barephp.svg?style=flat-square)](https://travis-ci.org/juliangut/generator-barephp)
[![Total Downloads](https://img.shields.io/npm/dt/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)

# Generator-BarePHP

When you start a new PHP project there are many configuration files to be created in order to set the project ready to start developing. Normally you'd just copy/paste them from another project but this is error prone, you'll forget to copy some files and many times you'll forget to change names or routes on those files.

If you're fed up scaffolding your projects with the same files once and again and feel you're wasting your time allow Yeoman do the heavy lifting and get your project scaffolded and ready to start developing in a breeze with this generator, it will prepare a barebones PHP project structure ready to develop for you, seat and focus on the actual code.

### Features

* Git by default
* Integration into Github or Bitbucket
* Composer ready (php >=5.5)
* Compatibility and general purpose packages included
* Project ready to be included into Packagist
* Laravel Homestead integration (PhpMyAdmin integrated)
* Integration with Vagrant hostupdater plugin
* Awesome Grunt integration
* Already configured Travis integration (PHP 5.5, 5.6, 7 and HHVM)
* Coveralls integration (triggered by Travis)
* Scrutinizer integration
* StyleCI integration
* Editorconfig file
* PHPUnit testing environment already set up and integrated into Grunt
* QA utilities (Linting, PHPCS, PHPMD, PHPCPD, Climb, Security-checker) configured and integrated into Grunt
* Basic annotated kickoff files
* Basic documentation structure in Markdown
* License selection

> And many more to come

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a PHP application.

To install `generator-barephp` from npm, run:

```
npm install -g generator-barephp
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

## Usage

Once the generator is installed (see previous points) you can start using it by initiating the generator and answering his questions:

```
yo barephp
```

### Post run configuration

`barephp` generator comes with many preconfigured services ready to be used but some of them need extra setup

* [Packagist](https://packagist.org). Your package must be [submit](https://packagist.org/packages/submit)
* [Travis](https://travis-ci.org). You need to activate the repository in your profile page
* [Coveralls](https://coveralls.io). Activate [here](https://coveralls.io/repos/new) the repository
* [Scrutinizer](https://scrutinizer-ci.com). The repository has to be added to Scrutinizer
* [StyleCI](https://styleci.io). Enable the repo on your [account](https://styleci.io/account).

If you install Laravel Homestead then Vagrant will be automatically configured to serve your project from "`project_name`.app" url.

If you installed PhpMyAdmin within Laravel Homested it will be available at "phpmyadmin-`project_name`.app" url.

If you have installed Vagrant plugin [vagrant_hostupdater](https://github.com/cogitatio/vagrant-hostsupdater) then `./etc/hosts` will be automatically updated every time you start Vagrant, otherwise you should include the referenced IP yourself.

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/generator-barephp/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/juliangut/generator-barephp/blob/master/CONTRIBUTING.md)

## License

See file [LICENSE](https://github.com/juliangut/generator-barephp/blob/master/LICENSE) included with the source code for a copy of the license terms.
