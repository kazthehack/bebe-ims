# syntax=docker/dockerfile:1.0.0-experimental

FROM node:12.18-slim as nightwatch-base

RUN mkdir /app
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
ENV PORTAL_HOST_PORT=portal:80
RUN apt-get update \
  && apt-get -yq install curl apt-transport-https wait-for-it

#### build sub-image
FROM nightwatch-base as nightwatch

COPY package.json .
RUN yarn install
COPY . .

CMD wait-for-it "${PORTAL_HOST_PORT}" -t 20 && ./node_modules/.bin/nightwatch
