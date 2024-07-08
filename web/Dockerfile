# Angular client app for Romtech
# docker build -f Dockerfile -t romtech_web .
# docker rm romtech_web; docker run -ti -p 4200:4200 --name romtech_web romtech_web
FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm \
    wget \
    nano

RUN mkdir /web
COPY . /web
WORKDIR /web

RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

RUN npm install -g @angular/cli@latest
RUN npm install --force
RUN ng analytics off

CMD ["ng", "serve", "--host", "0.0.0.0"]