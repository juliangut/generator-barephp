<?php
/**
<% if (project.desc || project.homepage) { -%>
 * <%= project.desc %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

 *
<% } -%>
 * @link https://github.com/<%= owner.account %>/<%= project.name %> for the canonical source repository
<% if (control.license) { -%>
 *
 * @license https://github.com/<%= owner.account %>/<%= project.name %>/blob/master/LICENSE
<% } -%>
 */

namespace <%= project.namespace %>;

class Greeter
{
    /**
     * Greeter.
     *
     * @param  string $name
     *
     * @return string
     */
    public function greet($name = 'Julian')
    {
        return 'Hello ' . $name;
    }
}
