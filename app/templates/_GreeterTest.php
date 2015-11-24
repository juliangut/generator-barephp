<?php
/**
<% if (project.desc || project.homepage) { -%>
 * <%= project.desc %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

 *
<% } -%>
 * @link https://github.com/<%= owner.account %>/<%= project.name %> for the canonical source repository
<% if (control.license) { -%>
 *
 * @license https://github.com/<%= owner.account %>/<%= project.name %>/blob/master/LICENSE
<% } -%>
 */

namespace <%= project.namespace %>\Tests;

use <%= project.namespace %>\Greeter;

/**
 * @covers \<%= project.namespace %>\Greeter
 */
class GreeterTest extends \PHPUnit_Framework_TestCase
{
    protected $greeter;

    public function setUp()
    {
        $this->greeter = new Greeter;
    }

    /**
     * @covers \<%= project.namespace %>\Greeter::greet
     */
    public function testDefaultGreet()
    {
        $this->assertEquals('Hello Julian', $this->greeter->greet());
    }

    /**
     * @dataProvider greetingsProvider
     *
     * @covers \<%= project.namespace %>\Greeter::greet
     */
    public function testGreet($name)
    {
        $this->assertEquals('Hello ' . $name, $this->greeter->greet($name));
    }

    public function greetingsProvider()
    {
        return [
            ['John'],
            ['Jane'],
        ];
    }
}
