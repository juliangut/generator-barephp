<?php

/*
 * <%= project.name %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>.

<% if (project.description) { -%>
 * <%= project.description %>.
<% } -%>
 *
<% if (control.license && project.license !== 'proprietary') { -%>
 * @license <%= project.license %>
<% }
if (project.homepage) { -%>
 * @link <%= project.homepage %>
<% } -%>
 * @author <%= owner.name %><% if (owner.email) { -%> <<%= owner.email %>><% } -%>

 */

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
    public function __construct($name = 'No one')
    {
        $this->setName($name);
    }

    /**
     * Return person name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set person name.
     *
     * @param string $name
     *
     * @throws \InvalidArgumentException
     *
     * @return $this
     */
    public function setName($name)
    {
        if (trim($name) === '') {
            throw new \InvalidArgumentException(sprintf('"%s" is not a valid name', $name));
        }

        $this->name = trim($name);

        return $this;
    }
}
