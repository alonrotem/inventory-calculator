# mysql
# docker build -f Dockerfile -t romtech_db .
# docker rm romtech_db; docker run -p 3306:3306 -v $PWD/mysql:/var/lib/mysql --name romtech_db -ti romtech_db
# 
# Connect: docker exec -ti romtech_db /bin/bash
# Run queries:
# mysql -u root -p12345678
# use inventory
# select * from raw_materials;

FROM mysql:latest

#RUN apt-install update && apt-install -y mysql-client

ENV MYSQL_ROOT_PASSWORD=12345678
ENV MYSQL_DATABASE=inventory

COPY *.sql /docker-entrypoint-initdb.d/
RUN mkdir /db
COPY . /db
WORKDIR /db

#CMD /bin/bash -c 'mysql -u root -p12345678 </db/create_db.sql'


# /var/lib/mysql