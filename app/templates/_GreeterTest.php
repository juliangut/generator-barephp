<?php
/**
<% if (project.desc || project.homepage) { -%>
 * <%= project.desc %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

 *
<% } -%>
 * @link https://github.com/<%= project.name %> for the canonical source repository
<% if (control.license) { -%>
 * @license https://github.com/<%= project.name %>/blob/master/LICENSE
<% } -%>
 */

namespace Jgut\Generator\BarePHP\Tests;

use Jgut\Generator\BarePHP\Greeter;

/**
 * @covers \Jgut\Generator\BarePHP\Greeter
 */
class GreeterTest extends \PHPUnit_Framework_TestCase
{
    protected $greeter;

    public function setUp()
    {
        $this->greeter = new Greeter;
    }

    /**
     * @covers \Jgut\Generator\BarePHP\Greeter::greet
     */
    public function testDefaultGreet()
    {
        $this->assertEquals('Hello Julian', $this->greeter->greet());
    }

    /**
     * @covers \Jgut\Generator\BarePHP\Greeter::greet
     * @dataProvider greetingsProvider
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
