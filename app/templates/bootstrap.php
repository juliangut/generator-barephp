<?php
/**
 * <%= project.description %><% if (project.homepage) { -%> (<%= project.homepage %>)<% } -%>

<% if (project.source) { -%>
 *
 * @link <%= project.source %> for the canonical source repository
<% } -%>
 */

session_start();

require_once dirname(__DIR__) . '/vendor/autoload.php';
