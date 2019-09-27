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

<% if (projectNamespace[0] > 'P') { -%>
use PHPUnit\Framework\TestCase;
<% } -%>
use <%= projectNamespace %>\Person;
<% if (projectNamespace[0] < 'P') { -%>
use PHPUnit\Framework\TestCase;
<% } -%>

/**
 * Person tests example.
 */
class PersonTest extends TestCase
{
    public function testGreetDefaults()<% if (projectPhpVersion >= 7.1) { -%>: void<% } -%>

    {
        $person = new Person();

        static::assertEquals('No one', $person->getName());
    }

    public function testInvalidName()<% if (projectPhpVersion >= 7.1) { -%>: void<% } -%>

    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('" " is not a valid name');

        new Person(' ');
    }

    /**
     * @dataProvider namesProvider
     *
     * @param string $name
     */
    public function testName(string $name)<% if (projectPhpVersion >= 7.1) { -%>: void<% } -%>

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
