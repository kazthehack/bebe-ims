#!/bin/bash

# Pass through arguments
OPTS="$*"

# Warnings should be errors on CI
if [ -n "$CI" ]; then
  OPTS="$OPTS --max-warnings 0"
fi

# Change to script's parent directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR}/..

./node_modules/.bin/eslint $OPTS src
JS_LINT_CODE=$?

./node_modules/.bin/stylelint "src/**/*.js, **/*.css, !**/docker/**"
CSS_LINT_CODE=$?

! (( $JS_LINT_CODE | $CSS_LINT_CODE ))
