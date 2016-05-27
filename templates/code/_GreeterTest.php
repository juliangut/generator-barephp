<?php
/**
 * <%= project.name %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

<% if (project.description) { -%>
 * <%= project.description %>
<% } -%>
 *
<% if (control.license && project.license !== 'proprietary') { -%>
 * @license <%= project.license %>
<% }
if (control.repository && repository.homepage !== project.homepage) { -%>
 * @link <%= repository.homepage %>
<% } -%>
 * @author <%= owner.name %><% if (owner.email) { -%> <<%= owner.email %>><% } -%>

 */

namespace <%= project.namespace %>\Tests;

use <%= project.namespace %>\Greeter;
use <%= project.namespace %>\Person;

/**
 * Greeter tests example
 */
class GreeterTest extends \PHPUnit_Framework_TestCase
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
