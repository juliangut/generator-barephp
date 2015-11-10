<?php
<% if (project.src || project.homepage) { -%>
/**
 * <%= project.desc %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

<% if (project.src) { -%>
 *
 * @link <%= project.src %> for the canonical source repository
<% } -%>
 */
<% } -%>

namespace Jgut\Generator\BarePHP;

class Greeter
{
    public function greet($name = 'Julian')
    {
        return 'Hello ' . $name;
    }
}
