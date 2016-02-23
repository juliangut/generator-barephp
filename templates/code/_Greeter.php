<?php
/**
 * <%= project.name %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

<% if (project.description) { -%>
 * <%= project.description %>
<% } -%>
 *
<% if (control.license && project.license !== 'proprietary') { -%>
 * @license <%= project.license %>
<% }
if (control.repository && repository.homepage !== project.homepage) { -%>
 * @link <%= repository.homepage %>
<% } -%>
 * @author <%= owner.name %><% if (owner.email) { -%> <<%= owner.email %>><% } -%>

 */

namespace <%= project.namespace %>;

/**
 * Example class
 */
class Greeter
{
    /**
     * Greeter.
     *
     * @param string $name
     *
     * @return string
     *
     * @throws \InvalidArgumentException
     */
    public function greet($name = 'Julian')
    {
        if (trim($name) === '') {
            throw new \InvalidArgumentException(sprintf('"%s" is not a valid name', $name));
        }

        return 'Hello ' . $name;
    }
}
