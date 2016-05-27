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
     * Greet a person.
     *
     * @param Person $person
     *
     * @return string
     */
    public function greet(Person $person)
    {
        return 'Hello ' . $person->getName();
    }
}
