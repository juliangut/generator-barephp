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

namespace <%= project.namespace %>\Tests;

use <%= project.namespace %>\Greeter;
use <%= project.namespace %>\Person;
use PHPUnit\Framework\TestCase;

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
        $this->greeter = new Greeter;
    }

    public function testGreet()
    {
        $person = self::getMockBuilder(Person::class)->disableOriginalConstructor()->getMock();
        $person->expects(self::once())->method('getName')->will(self::returnValue('John Doe'));

        self::assertEquals('Hello John Doe', $this->greeter->greet($person));
    }
}
