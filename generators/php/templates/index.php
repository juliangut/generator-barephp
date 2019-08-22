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

require __DIR__ . '/../vendor/autoload.php';

phpinfo();
