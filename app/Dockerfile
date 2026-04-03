# syntax=docker/dockerfile:1.0.0-experimental

#############################################################################
#### source image
FROM node:12.18-slim as portal-base

#############################################################################
#### build sub-image base
FROM portal-base as portal-build-base

ENV NODE_PATH=src
ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app
# install a few build tools, curl, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    curl
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

#############################################################################
#### build sub-image build-dev
FROM portal-build-base as portal-build-dev

ARG BUILD_VERSION=unknown
ARG GIT_COMMIT=unknown
ARG GIT_DESCRIBE=unknown

ARG ARG_REACT_DEFAULT_API_ENDPOINT=https://api.bloomup.co/graphql
ARG ARG_REACT_DEFAULT_PUBLIC_DEMO_MODE="__zzz_demo_mode_zzz__"
ENV REACT_DEFAULT_API_ENDPOINT="$ARG_REACT_DEFAULT_API_ENDPOINT"
ENV REACT_DEFAULT_PUBLIC_DEMO_MODE="$ARG_REACT_DEFAULT_PUBLIC_DEMO_MODE"

ENV NODE_PATH=src
ENV NODE_ENV=development
# use REACT_APP_TEST env var until state/prod environment is ready, we
# only want this set to true for "dev" environment(s).
ENV REACT_APP_TEST=true
ENV REACT_APP_ENABLE_PUBLIC_DEMO_MODE=false
ENV REACT_APP_VERSION="$BUILD_VERSION"
ENV REACT_APP_API_ENDPOINT="$REACT_DEFAULT_API_ENDPOINT"
ENV REACT_APP_ENABLE_PUBLIC_DEMO_MODE="$REACT_DEFAULT_PUBLIC_DEMO_MODE"

COPY . .
RUN yarn build


#############################################################################
#### build sub-image build-prod
FROM portal-build-base as portal-build-prod

ARG BUILD_VERSION=unknown
ARG GIT_COMMIT=unknown
ARG GIT_DESCRIBE=unknown

ARG ARG_REACT_DEFAULT_API_ENDPOINT=https://api.bloomup.co/graphql
ARG ARG_REACT_DEFAULT_PUBLIC_DEMO_MODE="__zzz_demo_mode_zzz__"
ENV REACT_DEFAULT_API_ENDPOINT="$ARG_REACT_DEFAULT_API_ENDPOINT"
ENV REACT_DEFAULT_PUBLIC_DEMO_MODE="$ARG_REACT_DEFAULT_PUBLIC_DEMO_MODE"


ENV NODE_PATH=src
ENV NODE_ENV=production
# use REACT_APP_TEST env var until state/prod environment is ready, we
# only want this set to true for "dev" environment(s).
ENV NODE_PATH=src
ENV REACT_APP_TEST=
ENV REACT_APP_ENABLE_PUBLIC_DEMO_MODE=
ENV REACT_APP_VERSION="$BUILD_VERSION"
ENV REACT_APP_API_ENDPOINT="$REACT_DEFAULT_API_ENDPOINT"
ENV REACT_APP_ENABLE_PUBLIC_DEMO_MODE="$REACT_DEFAULT_PUBLIC_DEMO_MODE"

COPY . .
RUN yarn build; yarn remove-test-bundles

#############################################################################
#### build run image
FROM nginx:stable-alpine

RUN mkdir -p /app; rm -rf /usr/share/nginx/html;

ARG ARG_REACT_DEFAULT_API_ENDPOINT=https://api.bloomup.co/graphql
ARG ARG_REACT_DEFAULT_PUBLIC_DEMO_MODE="__zzz_demo_mode_zzz__"
ENV REACT_DEFAULT_API_ENDPOINT="$ARG_REACT_DEFAULT_API_ENDPOINT"
ENV REACT_DEFAULT_PUBLIC_DEMO_MODE="$ARG_REACT_DEFAULT_PUBLIC_DEMO_MODE"

ENV NODE_ENV=production
ENV REACT_APP_API_ENDPOINT="$REACT_DEFAULT_API_ENDPOINT"
ENV REACT_APP_ENABLE_PUBLIC_DEMO_MODE="$REACT_DEFAULT_PUBLIC_DEMO_MODE"

WORKDIR /app
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/entrypoint.sh /app/entrypoint.sh
COPY --from=portal-build-prod /app/build /app/build-prod
COPY --from=portal-build-dev /app/build /app/build-dev

ENTRYPOINT ["/app/entrypoint.sh"]
CMD [ "run" ]

ARG BUILD_VERSION=unknown
ARG GIT_COMMIT=unknown
ARG GIT_DESCRIBE=unknown
LABEL name=bloom-portal
LABEL vendor=bloom
LABEL license=proprietary
LABEL version=$BUILD_VERSION
LABEL bloom.build.version=$BUILD_VERSION
LABEL bloom.build.git-commit=$GIT_COMMIT
LABEL bloom.build.git-describe=$GIT_DESCRIBE
