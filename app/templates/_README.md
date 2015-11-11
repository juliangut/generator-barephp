[![Latest Version](https://img.shields.io/packagist/vpre/<%= project.name %>.svg?style=flat-square)](https://packagist.org/packages/<%= project.name %>)
<% if (control.license) { -%>
[![License](https://img.shields.io/github/license/<%= project.name %>.svg?style=flat-square)](https://github.com/<%= project.name %>/blob/master/LICENSE)
<% } -%>

<% if (control.travis) { -%>
[![Build status](https://img.shields.io/travis/<%= project.name %>.svg?style=flat-square)](https://travis-ci.org/<%= project.name %>)
<% } -%>
<% if (control.scrutinuzer) { -%>
[![Code Quality](https://img.shields.io/scrutinizer/g/<%= project.name %>.svg?style=flat-square)](https://scrutinizer-ci.com/g/<%= project.name %>)
<% } -%>
<% if (control.coveralls) { -%>
[![Code Coverage](https://img.shields.io/coveralls/<%= project.name %>.svg?style=flat-square)](https://coveralls.io/github/<%= project.name %>)
<% } -%>
[![Total Downloads](https://img.shields.io/packagist/dt/<%= project.name %>.svg?style=flat-square)](https://packagist.org/packages/<%= project.name %>)

# <%= project.name %>
<% if (project.desc) { -%>

<%= project.desc %>
<% } -%>

## Installation

Install using Composer:

```
composer require <%= project.name %>
```

Then require_once the autoload file:

```php
require_once './vendor/autoload.php';
```

## Usage

Usage intructions go here

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/<%= project.name %>/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/<%= project.name %>/blob/master/CONTRIBUTING.md)
<% if (control.license) { -%>
## License

See file [LICENSE](https://github.com/<%= project.name %>/blob/master/LICENSE) included with the source code for a copy of the license terms.
<% } -%>
