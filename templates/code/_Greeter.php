<?php

/*
 * <%= project.name %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>.
<% if (project.description) { -%>
 * <%= project.description %>.
<% } -%>
 *
<% if (control.license) { -%>
 * @license <%= project.license %>
<% }
if (project.homepage) { -%>
 * @link <%= project.homepage %>
<% } -%>
 * @author <%= owner.name %><% if (owner.email) { -%> <<%= owner.email %>><% } -%>

 */

declare(strict_types=1);

namespace <%= project.namespace %>;

/**
 * Example class.
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
    public function greet(Person $person): string
    {
        return 'Hello ' . $person->getName();
    }
}
