# syntax=docker/dockerfile:experimental

# Build stage: Install yarn dependencies
# ===
FROM node:14 AS yarn-dependencies
WORKDIR /srv
COPY . .
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn CYPRESS_INSTALL_BINARY=0 yarn install

# Build stage: Run "yarn build"
# ===
FROM yarn-dependencies AS build-js
RUN yarn run build-all


# Build the production image
# ===
# FROM ubuntu:focal

# # Set up environment
# ENV LANG C.UTF-8
# WORKDIR /srv

# RUN apt-get update && apt-get install --no-install-recommends --yes python3 yarn

# Import code, build assets and mirror list
# ADD . .
# RUN rm -rf yarn.lock
# COPY --from=build-js /srv/build /srv/build

# Setup commands to run server
CMD yarn run serve-static-demo
