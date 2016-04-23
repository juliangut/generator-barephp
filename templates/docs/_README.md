[![PHP version](https://img.shields.io/badge/PHP-%3E%3D<%= project.phpVersion %>-8892BF.svg?style=flat-square)](http://php.net)
<% if (control.packagist) { -%>
[![Latest Version](https://img.shields.io/packagist/vpre/<%= account.packagist %>/<%= project.name %>.svg?style=flat-square)](https://packagist.org/packages/<%= account.packagist %>/<%= project.name %>)
<% }
if (control.license && repository.type === 'github') { -%>
[![License](https://img.shields.io/github/license/<%= account.repository %>/<%= project.name %>.svg?style=flat-square)](https://github.com/<%= owner.account %>/<%= project.name %>/blob/master/LICENSE)
<% } -%>

<% if (control.travis) { -%>
[![Build status](https://img.shields.io/travis/<%= account.travis %>/<%= project.name %>.svg?style=flat-square)](https://travis-ci.org/<%= account.travis %>/<%= project.name %>)
<% }
if (control.styleci) { -%>
[![Style](https://styleci.io/repos/<%= account.styleci %>/shield)](https://styleci.io/repos/<%= account.styleci %>)
<% }
if (control.scrutinizer) { -%>
[![Code Quality](https://img.shields.io/scrutinizer/g/<%= account.scrutinizer %>/<%= project.name %>.svg?style=flat-square)](https://scrutinizer-ci.com/g/<%= account.scrutinizer %>/<%= project.name %>)
<% }
if (control.coveralls) { -%>
[![Code Coverage](https://img.shields.io/coveralls/<%= account.coveralls %>/<%= project.name %>.svg?style=flat-square)](https://coveralls.io/github/<%= account.coveralls %>/<%= project.name %>)
<% }
if (control.packagist) { -%>
[![Total Downloads](https://img.shields.io/packagist/dt/<%= account.packagist %>/<%= project.name %>.svg?style=flat-square)](https://packagist.org/packages/<%= account.packagist %>/<%= project.name %>)
<% } -%>

# <%= project.name %>
<% if (project.description) { -%>

<%= project.description %>
<% } -%>

<% if (control.packagist) { -%>
## Installation

### Composer

```
composer require <%= account.packagist %>/<%= project.name %>
```

## Usage

Require composer autoload file

```php
require './vendor/autoload.php';
```
<% } else { -%>
## Usage
<% } -%>

> Usage instructions go here

## Contributing

Found a bug or have a feature request? [Please open a new issue](<%= repository.homepage %>/issues). Have a look at existing issues before.

<% if (repository.type == 'github') { -%>
See file [CONTRIBUTING.md](<%= repository.homepage %>/blob/master/CONTRIBUTING.md)
<% }
if (repository.type == 'bitbucket') { -%>
See file [CONTRIBUTING.md](./CONTRIBUTING.md)
<% } -%>
<% if (control.license && project.license !== 'proprietary') { -%>

## License

<% if (repository.type === 'github') { -%>
See file [LICENSE](<%= repository.homepage %>/blob/master/LICENSE) included with the source code for a copy of the license terms.
<% }
if (repository.type === 'bitbucket') { -%>
See file [LICENSE](./LICENSE) included with the source code for a copy of the license terms.
<% } -%>
<% } -%>
