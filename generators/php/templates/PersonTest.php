<?php

/*
 * <%= projectName %><% if (projectHomepage !== '') { -%> (<%= projectHomepage %>)<% } -%>.
<% if (projectDescription !== '') { -%>
 * <%= projectDescription %>.
<% } -%>
 *
<% if (projectLicense !== 'none') { -%>
 * @license <%= projectLicense %>
<% }
if (projectHomepage !== '') { -%>
 * @link <%= projectHomepage %>
<% } -%>
 * @author <%= ownerName %><% if (ownerEmail !== '') { -%> <<%= ownerEmail %>><% } -%>

 */

declare(strict_types=1);

namespace <%= projectNamespace %>\Tests;

<% if (projectNamespace > 'PHPUnit\Framework\TestCase') { -%>
use PHPUnit\Framework\TestCase;
<% } -%>
use <%= projectNamespace %>\Person;
<% if (projectNamespace < 'PHPUnit\Framework\TestCase') { -%>
use PHPUnit\Framework\TestCase;
<% } -%>

/**
 * Person tests example.
 */
class PersonTest extends TestCase
{
    public function testGreetDefaults()
    {
        $person = new Person();

        static::assertEquals('No one', $person->getName());
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
    public function testName(string $name)
    {
        $person = new Person($name);

        static::assertEquals($name, $person->getName());
    }

    /**
     * Names provider.
     *
     * @return array
     */
    public function namesProvider(): array
    {
        return [
            ['John Doe'],
            ['Jane Doe'],
        ];
    }
}
