[![Latest Version](https://img.shields.io/npm/v/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)
[![License](https://img.shields.io/github/license/juliangut/generator-barephp.svg?style=flat-square)](https://github.com/juliangut/generator-barephp/blob/master/LICENSE)

[![Build status](https://img.shields.io/travis/juliangut/generator-barephp.svg?style=flat-square)](https://travis-ci.org/juliangut/generator-barephp)
[![Total Downloads](https://img.shields.io/npm/dt/generator-barephp.svg?style=flat-square)](https://npmjs.org/package/generator-barephp)

# Generator-BarePHP

When you start a new PHP project there are many configuration files to be created in order to set the project ready to start developing. Normally you'd just copy/paste them from another project but this is error prone, you'll forget to copy some files and many times you'll forget to change names or routes on those files.

If you're fed up creating the same files once and again every time you start a new PHP project and feel you're wasting your time allow Yeoman do the heavy lifting and get your project scaffolded and ready to start developing in a breeze with this generator, it will prepare a barebones PHP project structure ready to develop for you, seat and focus on the actual code.

### Features

* Git ready
* Composer ready (php >=5.5)
* Prepared for Packagist
* Laravel/Homestead integration
* Awesome Grunt integration
* Already configured Travis integration (PHP 5.5, 5.6, 7 and HHVM)
* Coveralls integration (triggered by Travis)
* Scrutinizer integration
* StyleCI integration
* Editorconfig integration
* Testing environment already set up and integrated with Grunt
* QA utilities (PHP linting, PHPUnit, PHPCS, PHPMD, PHPCPD, Clim, Security-checker) configured and integrated with Grunt
* Basic documentation structure in Markdown
* License selector

> And more to come

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

Once the generator is installed you can start using it by initiating the generator and answering his questions:

```
yo barephp
```

> Be aware that `github account` and `project name` provided to the generator will be used as composer package name AND project namespace. Should you need to change them review composer.json and provided template clases

### Post configuration

`barephp` generator comes with many configured services ready to be used but some of them need extra setup

* [Travis](https://travis-ci.org). You need to activate the repository in your profile page
* [Coveralls](https://coveralls.io). Get [here](https://coveralls.io/repos/new) and activate the repository
* [Scrutinizer](https://scrutinizer-ci.com). The repository has to be added to Scrutinizer
* [StyleCI](https://styleci.io). Enable the repo on your [account](https://styleci.io/account). And assign StyleCI repo id to the badge on README.md file

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/generator-barephp/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/juliangut/generator-barephp/blob/master/CONTRIBUTING.md)

## License

See file [LICENSE](https://github.com/juliangut/generator-barephp/blob/master/LICENSE) included with the source code for a copy of the license terms.
