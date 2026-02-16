# --- STAGE 1: Build the Angular Web App ---
FROM node:22.16.0-slim AS web-builder

ENV NODE_ENV=production

WORKDIR /temp_web

# Set npm config to handle dependency conflicts
RUN npm config set legacy-peer-deps true

# Copy only package files first to leverage Docker layer caching
COPY ./web/package*.json ./
RUN npm install --force

# Copy the rest of the web source and build
COPY ./web/ .
# Using npx ensures we use the local @angular-devkit version
RUN npx ng build --configuration=production


# --- STAGE 2: Setup the Node Server ---
FROM node:22.16.0-slim
WORKDIR /server

# Copy server dependency files
COPY ./server/package*.json ./
RUN npm install --production

# Copy server source code
COPY ./server/ .

# Ensure the destination directory exists
RUN mkdir -p /server/web

# THE CRITICAL STEP: 
# Grab the built files from the first stage and put them in /server/web
COPY --from=web-builder /temp_web/dist/inventory-calculator/browser/. /server/web/

EXPOSE 3000
CMD ["node", "index.js", "0.0.0.0"]