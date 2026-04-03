#! /usr/bin/env node
const fs = require('fs')

// Expects to be run at root checkout folder to operate on webpack output.

const testRouteFiles = [
  'testroutes.js',
  'testroutes.js.map'
]

const ASSET_MANIFEST_PATH = './build/asset-manifest.json'

console.log('Removing testroute bundles for production build...')

const assetManifestJson = fs.readFileSync(ASSET_MANIFEST_PATH)
const assetManifest = JSON.parse(assetManifestJson)

testRouteFiles.forEach(key => {
  console.log(`Deleting file for asset-manifest key: ${key}`)
  try {
    fs.unlinkSync(`./build/${assetManifest[key]}`)
  } catch (e) {
    console.log('Testroute file could not be deleted!')
    console.log(`file - ${assetManifest[key]}`)
  }
  delete assetManifest[key]
})

fs.writeFileSync(ASSET_MANIFEST_PATH, JSON.stringify(assetManifest, null, 2))

console.log('Testroutes bundles removed! Asset manifest has been updated.')


