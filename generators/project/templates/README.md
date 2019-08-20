[![PHP version](https://img.shields.io/badge/PHP-%3E%3D<%= projectPhpVersion %>-8892BF.svg?style=flat-square)](http://php.net)
<% if (accountPackagist !== 'none') { -%>
[![Latest Version](https://img.shields.io/packagist/v/<%= accountPackagist %>/<%= projectName %>.svg?style=flat-square)](https://packagist.org/packages/<%= accountPackagist %>/<%= projectName %>)
<% }
if (projectLicense !== 'none' && repositoryType === 'github') { -%>
[![License](https://img.shields.io/github/license/<%= accountRepository %>/<%= projectName %>.svg?style=flat-square)](https://github.com/<%= accountRepository %>/<%= projectName %>/blob/master/LICENSE)
<% } else if (projectLicense !== 'none' && accountPackagist !== 'none') { -%>
![License](https://img.shields.io/packagist/l/<%= accountPackagist %>/<%= projectName %>.svg?style=flat-square)
<% } -%>

<% if (accountTravis !== 'none') { -%>
[![Build Status](https://img.shields.io/travis/<%= accountTravis %>/<%= projectName %>.svg?style=flat-square)](https://travis-ci.org/<%= accountTravis %>/<%= projectName %>)
<% }
if (accountStyleci !== null) { -%>
[![Style Check](https://styleci.io/repos/<%= accountStyleci %>/shield)](https://styleci.io/repos/<%= accountStyleci %>)
<% }
if (accountScrutinizer !== null) { -%>
[![Code Quality](https://img.shields.io/scrutinizer/g/<%= accountScrutinizer %>/<%= projectName %>.svg?style=flat-square)](https://scrutinizer-ci.com/g/<%= accountScrutinizer %>/<%= projectName %>)
<% }
if (accountCoveralls !== null) { -%>
[![Code Coverage](https://img.shields.io/coveralls/<%= accountCoveralls %>/<%= projectName %>.svg?style=flat-square)](https://coveralls.io/github/<%= accountCoveralls %>/<%= projectName %>)
<% } -%>

<% if (accountPackagist !== 'none') { -%>
[![Total Downloads](https://img.shields.io/packagist/dt/<%= accountPackagist %>/<%= projectName %>.svg?style=flat-square)](https://packagist.org/packages/<%= accountPackagist %>/<%= projectName %>/stats)
[![Monthly Downloads](https://img.shields.io/packagist/dm/<%= accountPackagist %>/<%= projectName %>.svg?style=flat-square)](https://packagist.org/packages/<%= accountPackagist %>/<%= projectName %>/stats)
<% } -%>

# <%= projectName %>
<% if (projectDescription !== '') { -%>

<%= projectDescription %>
<% } -%>

<% if (accountPackagist !== 'none') { -%>
## Installation

### Composer

```
composer require <%= accountPackagist %>/<%= projectName %>
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

Found a bug or have a feature request? [Please open a new issue](<%= repositoryHomepage %>/issues). Have a look at existing issues before.

<% if (repositoryType === 'github') { -%>
See file [CONTRIBUTING.md](<%= repositoryHomepage %>/blob/master/CONTRIBUTING.md)
<% }
if (repositoryType == 'bitbucket') { -%>
See file [CONTRIBUTING.md](./CONTRIBUTING.md)
<% } -%>
<% if (projectLicense !== 'none') { -%>

## License

<% if (repositoryType === 'github') { -%>
See file [LICENSE](<%= repositoryHomepage %>/blob/master/LICENSE) included with the source code for a copy of the license terms.
<% }
if (repositoryType === 'bitbucket') { -%>
See file [LICENSE](./LICENSE) included with the source code for a copy of the license terms.
<% } -%>
<% } -%>
