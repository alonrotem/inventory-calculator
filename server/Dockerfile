# node
# Node server app for Romtech
# docker build -f Dockerfile -t romtech_server .
# docker rm romtech_server; docker run -ti -p 3000:3000 --name romtech_server romtech_server
FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    software-properties-common \
    wget \
    nano \
    curl

RUN mkdir /server
COPY . /server
WORKDIR /server

# ===============
# Set environment variables
ENV NVM_DIR=/root/.nvm \
    NODE_VERSION=22.0.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Add NVM to PATH
ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH"

# Verify installation
RUN node --version && npm --version
# ===============

#RUN npm install -g @angular/cli@latest
RUN npm install --force

CMD ["node", "index.js", "0.0.0.0"]