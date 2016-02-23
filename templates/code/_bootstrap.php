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

session_start();

require dirname(__DIR__) . '/vendor/autoload.php';
