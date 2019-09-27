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
use <%= projectNamespace %>\Greeter;
use <%= projectNamespace %>\Person;
<% if (projectNamespace[0] < 'P') { -%>
use PHPUnit\Framework\TestCase;
<% } -%>

/**
 * Greeter tests example.
 */
class GreeterTest extends TestCase
{
    /**
     * @var Greeter
     */
    protected $greeter;

    /**
     * {@inheritdoc}
     */
    public function setUp()<% if (projectPhpVersion >= 7.1) { -%>: void<% } -%>

    {
        $this->greeter = new Greeter();
    }

    public function testGreet()<% if (projectPhpVersion >= 7.1) { -%>: void<% } -%>

    {
        $person = static::getMockBuilder(Person::class)->disableOriginalConstructor()->getMock();
        $person->expects(static::once())->method('getName')->will(static::returnValue('John Doe'));

        static::assertEquals('Hello John Doe', $this->greeter->greet($person));
    }
}
