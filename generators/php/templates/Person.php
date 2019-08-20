<?php

/*
 * <%= projectName %><% if (projectHomepage) { -%> (<%= projectHomepage %>)<% } -%>.
<% if (projectDescription !== '') { -%>
 * <%= projectDescription %>.
<% } -%>
 *
<% if (projectLicense !== 'none') { -%>
 * @license <%= projectLicense %>
<% }
if (projectHomepage) { -%>
 * @link <%= projectHomepage %>
<% } -%>
 * @author <%= ownerName %><% if (ownerEmail) { -%> <<%= ownerEmail %>><% } -%>

 */

declare(strict_types=1);

namespace <%= projectNamespace %>;

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
    public function setName(string $name)<% if (projectPhpVersion >= 7.1) { -%>: void<% } -%>

    {
        if (trim($name) === '') {
            throw new \InvalidArgumentException(sprintf('"%s" is not a valid name', $name));
        }

        $this->name = trim($name);
    }
}
