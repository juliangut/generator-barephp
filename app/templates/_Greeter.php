<?php
/**
<% if (project.desc || project.homepage) { -%>
 * <%= project.desc %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

 *
<% } -%>
 * @link https://github.com/<%= project.name %> for the canonical source repository
<% if (control.license) { -%>
 * @license https://github.com/<%= project.name %>/blob/master/LICENSE
<% } -%>
 */

namespace Jgut\Generator\BarePHP;

class Greeter
{
    public function greet($name = 'Julian')
    {
        return 'Hello ' . $name;
    }
}
