# node
# Node server app for Romtech
# docker build -f Dockerfile -t romtech_server .
# docker rm romtech_server; docker run -ti -p 3000:3000 --name romtech_server romtech_server
FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm \
    wget \
    nano

RUN mkdir /server
COPY . /server
WORKDIR /server

RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

RUN npm install -g @angular/cli@latest
RUN npm install --force

CMD ["node", "index.js", "0.0.0.0"]