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
 * Example Person class.
 */
class Person
{
    /**
     * @var string
     */
    private $name;

    /**
     * Person constructor.
     *
     * @param string $name
     */
    public function __construct(string $name = 'No one')
    {
        $this->setName($name);
    }

    /**
     * Return person name.
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Set person name.
     *
     * @param string $name
     *
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    public function setName(string $name)<% if (project.phpVersion >= 7.1) { -%>: void<% } -%>

    {
        if (trim($name) === '') {
            throw new \InvalidArgumentException(sprintf('"%s" is not a valid name', $name));
        }

        $this->name = trim($name);
    }
}
