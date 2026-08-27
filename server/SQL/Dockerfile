FROM mysql:8.0.37

# This is a version of Fedora with a reduced version of dnf
RUN microdnf install -y nano

# placing the script in /docker-entrypoint-initdb.d/ should make it run automatically (for first-time init)
COPY *.sql /docker-entrypoint-initdb.d/

# Copy migration script and custom entrypoint
COPY ./docker-entrypoint-custom.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint-custom.sh

# Overriding unicode configuration for helping non-latin letters in the database
COPY *.cnf /etc/mysql/conf.d/

RUN mkdir /db
COPY . /db
WORKDIR /db

ENTRYPOINT ["/usr/local/bin/docker-entrypoint-custom.sh"]
