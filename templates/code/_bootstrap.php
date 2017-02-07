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

session_start();

require __DIR__ . '/../vendor/autoload.php';
