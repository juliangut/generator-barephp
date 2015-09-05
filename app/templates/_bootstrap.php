<?php
/**
 * <%= project.desc %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

<% if (project.src) { -%>
 *
 * @link <%= project.src %> for the canonical source repository
<% } -%>
 */

session_start();

require_once dirname(__DIR__) . '/vendor/autoload.php';
