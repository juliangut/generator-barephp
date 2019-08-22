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
use <%= projectNamespace %>\Greeter;
use <%= projectNamespace %>\Person;
<% if (projectNamespace < 'PHPUnit\Framework\TestCase') { -%>
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
    public function setUp()
    {
        $this->greeter = new Greeter();
    }

    public function testGreet()
    {
        $person = static::getMockBuilder(Person::class)->disableOriginalConstructor()->getMock();
        $person->expects(static::once())->method('getName')->will(static::returnValue('John Doe'));

        static::assertEquals('Hello John Doe', $this->greeter->greet($person));
    }
}
