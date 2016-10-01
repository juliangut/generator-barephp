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

namespace <%= project.namespace %>\Tests;

use <%= project.namespace %>\Person;

/**
 * Person tests example.
 */
class PersonTest extends \PHPUnit_Framework_TestCase
{
    public function testGreetDefaults()
    {
        $person = new Person();

        self::assertEquals('No one', $person->getName());
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage " " is not a valid name
     */
    public function testInvalidName()
    {
        new Person(' ');
    }

    /**
     * @dataProvider namesProvider
     *
     * @param string $name
     */
    public function testName($name)
    {
        $person = new Person($name);

        self::assertEquals($name, $person->getName());
    }

    /**
     * Names provider.
     *
     * @return array
     */
    public function namesProvider()
    {
        return [
            ['John Doe'],
            ['Jane Doe'],
        ];
    }
}
