# mysql
# docker build -f Dockerfile -t romtech_db .
# docker rm romtech_db; docker run -p 3306:3306 -v $PWD/mysql:/var/lib/mysql --name romtech_db -ti romtech_db
# 
# Connect: docker exec -ti romtech-db-1 /bin/bash
# Run queries:
# mysql -u root -p12345678
# use inventory
# select * from raw_materials;

FROM mysql:latest
# FROM mysql:8.0.37 # dev env

#RUN apt-install update && apt-install -y mysql-client
ENV MYSQL_USER=youruser
ENV MYSQL_ROOT_PASSWORD=12345678
ENV MYSQL_DATABASE=inventory

# This is a version of Fedora with a reduced version of dnf
RUN microdnf install -y nano

# placing the script in /docker-entrypoint-initdb.d/ should make it run automatially
COPY *.sql /docker-entrypoint-initdb.d/

# Overriding unicode configuration for helping non-latin letters in the database
COPY *.cnf /etc/mysql/conf.d/

RUN mkdir /db
COPY . /db
WORKDIR /db

# CMD /bin/bash -c 'mysql -u root -p12345678 < /docker-entrypoint-initdb.d/create_db.sql'


# /var/lib/mysql