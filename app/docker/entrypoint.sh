#!/bin/sh

WEB_ROOT=/app/build

if [ "${1}" = "run" ]; then
    if [ -d "$WEB_ROOT" ] && [ ! -L "$WEB_ROOT" ]; then
        rm -rf $WEB_ROOT
    fi

    if [ "$NODE_ENV" = "development" ]; then
        ln -snf /app/build-dev $WEB_ROOT;
    else
        ln -snf /app/build-prod $WEB_ROOT;
    fi

    sed -i "s%${REACT_DEFAULT_API_ENDPOINT}%${REACT_APP_API_ENDPOINT}%g" \
        build/static/js/*;
    sed -i "s%${REACT_DEFAULT_PUBLIC_DEMO_MODE}%${REACT_APP_ENABLE_PUBLIC_DEMO_MODE}%g" \
        build/static/js/*;

    exec nginx -g 'daemon off;'
else
    exec "$@"
fi
