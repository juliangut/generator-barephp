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

/**
 * Example test class
 */
class GreeterTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var <%= project.namespace %>\Greeter $greeter
     */
    protected $greeter;

    public function setUp()
    {
        $this->greeter = new Greeter;
    }

    public function testGreetDefaults()
    {
        self::assertEquals('Hello Julian', $this->greeter->greet());
    }

    /**
     * @dataProvider greetingsProvider
     */
    public function testGreet($name)
    {
        self::assertEquals('Hello ' . $name, $this->greeter->greet($name));
    }

    /**
     * Greeter names provider.
     *
     * @return array
     */
    public function greetingsProvider()
    {
        return [
            ['John'],
            ['Jane'],
        ];
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage " " is not a valid name
     */
    public function testGreetInvalidArgument()
    {
        $this->greeter->greet(' ');
    }
}
