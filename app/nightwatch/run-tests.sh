#!/usr/bin/env bash

# some buildkite vars
export BUILD_ID=${BUILDKITE_BUILD_NUMBER:-0000}
export STEP_KEY=${BUILDKITE_STEP_KEY:-0000}

# some compose vars
export DOCKER_BUILDKIT=1
export COMPOSE_FILE="nightwatch/docker-compose.yml"
export COMPOSE_PROJECT_NAME="bloom-portal-${BUILD_ID}-${STEP_KEY}"
export SELENIUM_CONTAINER_VERSION=67.0.3371.0

# runtime container vars
export TEST_USERNAME=${TEST_USERNAME:-lj@firstfoundry.co}
export TEST_PASSWORD=${TEST_PASSWORD:-password}
export API_ENDPOINT=${REACT_APP_API_ENDPOINT:-https://api.dev0.forge.bloomup.co/graphql}

set -eux

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR}/..

# compose cleanup
cleanup() {
    EX=$?
    docker-compose down
    docker-compose rm -fs
    exit ${EX}
}

trap "cleanup" EXIT

docker-compose build --parallel --pull
docker-compose run nightwatch
