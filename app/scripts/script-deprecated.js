#! /usr/bin/env node
const scriptName = process.argv[2] || 'unknown command'
console.warn(`
  !!! NPM script deprecation warning !!!
  "${scriptName}" is deprecated and will be removed in a future version of bloom-portal.
`)
