[![Latest Version](https://img.shields.io/packagist/vpre/<%= owner.account %>/<%= project.name %>.svg?style=flat-square)](https://packagist.org/packages/<%= owner.account %>/<%= project.name %>)
<% if (control.license) { -%>
[![License](https://img.shields.io/github/license/<%= owner.account %>/<%= project.name %>.svg?style=flat-square)](https://github.com/<%= owner.account %>/<%= project.name %>/blob/master/LICENSE)
<% } -%>

<% if (control.travis) { -%>
[![Build status](https://img.shields.io/travis/<%= owner.account %>/<%= project.name %>.svg?style=flat-square)](https://travis-ci.org/<%= owner.account %>/<%= project.name %>)
<% } -%>
<% if (control.styleci) { -%>
[![Style](https://styleci.io/repos/{xxxxx}/shield)](https://styleci.io/repos/{xxxxx})
<% } -%>
<% if (control.scrutinizer) { -%>
[![Code Quality](https://img.shields.io/scrutinizer/g/<%= owner.account %>/<%= project.name %>.svg?style=flat-square)](https://scrutinizer-ci.com/g/<%= owner.account %>/<%= project.name %>)
<% } -%>
<% if (control.coveralls) { -%>
[![Code Coverage](https://img.shields.io/coveralls/<%= owner.account %>/<%= project.name %>.svg?style=flat-square)](https://coveralls.io/github/<%= owner.account %>/<%= project.name %>)
<% } -%>
[![Total Downloads](https://img.shields.io/packagist/dt/<%= owner.account %>/<%= project.name %>.svg?style=flat-square)](https://packagist.org/packages/<%= owner.account %>/<%= project.name %>)

<% if (control.styleci) { -%>
> Remember to assign StyleCI repository id to the badge above

<% } -%>
# <%= project.name %>
<% if (project.desc) { -%>

<%= project.desc %>
<% } -%>

## Installation

Install using Composer:

```
composer require <%= owner.account %>/<%= project.name %>
```

Then require_once the autoload file:

```php
require_once './vendor/autoload.php';
```

## Usage

Usage intructions go here

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/<%= owner.account %>/<%= project.name %>/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/<%= owner.account %>/<%= project.name %>/blob/master/CONTRIBUTING.md)
<% if (control.license) { -%>
## License

See file [LICENSE](https://github.com/<%= owner.account %>/<%= project.name %>/blob/master/LICENSE) included with the source code for a copy of the license terms.
<% } -%>
