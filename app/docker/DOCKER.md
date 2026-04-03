## Building docker container

From the top level repo directory:

```
$ export DOCKER_BUILDKIT=1
$ docker build --pull --ssh default \
    --build-arg BUILD_VERSION=0.0.0 \
    --build-arg GIT_COMMIT=$(git rev-parse HEAD) \
    --build-arg GIT_DESCRIBE=$(git describe --tags --always --dirty) \
    -t bloom-portal:latest .
```

## Running docker container

First create `env_file` environment file.

To run (default NODE\_ENV=production build):
```
$ docker run -it \
    --rm \
    --name bloom-portal \
    -p 127.0.0.1:8080:80 \
    -e REACT_APP_API_ENDPOINT="https://api.dev0.forge.bloomup.co/graphql" \
    -e NODE_ENV=production \
    bloom-portal:latest
```

To run with the additional NODE\_ENV development build output:
```
$ docker run -it \
    --rm \
    --name bloom-portal \
    -p 127.0.0.1:8080:80 \
    -e REACT_APP_API_ENDPOINT="https://api.dev0.forge.bloomup.co/graphql" \
    -e NODE_ENV=development \
    bloom-portal:latest
```
