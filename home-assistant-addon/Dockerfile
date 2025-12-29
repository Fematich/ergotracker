ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest

# Build the frontend assets
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime image for Home Assistant
FROM ${BUILD_FROM}

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN apk add --no-cache nodejs npm sqlite

WORKDIR /opt/ergotracker

# Copy only what the server needs to run
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY home-assistant-addon/rootfs /

ENV PORT=8099 \
    DATABASE_PATH=/data/ergotracker/ergotracker.db

# Drop dev dependencies to keep the runtime image smaller
RUN npm prune --omit=dev || true

EXPOSE 8099

# Use s6-overlay init system provided by the Home Assistant base image
CMD ["/init"]
