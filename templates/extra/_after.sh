#!/bin/bash

# Packages update
if [ ! -f "apt-get-update" ]; then
    date --date='1 month ago' +%Y%m%d > apt-get-update
fi
if [ `cat apt-get-update` -le `date --date='7 day ago' +%Y%m%d` ]; then
    echo ">>> Updating packages"

    apt-get update -y

    date +%Y%m%d > apt-get-update
fi
<% if (control.phpmyadmin) { %>
# Install PhpMyAdmin
if [ ! -d "/var/www/html/phpmyadmin" ]; then
    echo '>>> Installing PhpMyAdmin 4.5.1'

    wget https://files.phpmyadmin.net/phpMyAdmin/4.5.1/phpMyAdmin-4.5.1-english.tar.gz -O phpmyadmin.tar.gz

    mkdir /var/www/html/phpmyadmin && tar xf phpmyadmin.tar.gz -C /var/www/html/phpmyadmin --strip-components 1
    rm phpmyadmin.tar.gz
fi
<% } -%>
