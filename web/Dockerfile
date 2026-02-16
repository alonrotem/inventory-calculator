# Angular client app for Romtech
# docker build -f Dockerfile -t romtech_web .
# docker rm romtech_web; docker run -p 4200:4200 --name romtech_web -ti romtech_web
FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    software-properties-common \
    wget \
    nano \
    curl

RUN mkdir /web
COPY . /web
WORKDIR /web

# ===============
# Set environment variables
ENV NVM_DIR=/root/.nvm \
    NODE_VERSION=20.19.0

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

RUN rm -rf node_modules
RUN rm -rf ./package-lock.json
RUN npm install -g @angular/cli@latest
RUN npm config set legacy-peer-deps true
RUN npm install --force
# RUN ng analytics off

CMD ["ng", "serve", "--host", "0.0.0.0", "--configuration=production"]