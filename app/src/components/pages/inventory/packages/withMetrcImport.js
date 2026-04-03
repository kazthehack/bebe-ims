// Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { importPackages, getPackages, fetchVenueSettings } from 'ops'
import { getNotification } from 'components/Notifications'
import { get, set, isEmpty } from 'lodash'

const successNotif = (message = 'Successfully imported packages') => getNotification('success', 'Success:', message)
const errorNotif = (message = 'Error importing packages') => getNotification('error', 'Error', message)

const withMetrcImport = C =>
  graphql(importPackages, {
    props: ({ mutate, ownProps: { addNotification, selectedVenueId } }) => ({
      metrcImport: (setSyncLoading) => {
        const input = {
          input: {
            storeId: selectedVenueId,
          },
        }
        setSyncLoading(true)
        return mutate({
          variables: input,
          // Update the cache once new packages are imported
          update: (cache, { data: { importPackages: { packages } } }) => {
            if (!isEmpty(packages)) {
              // Query variables
              const variables = {
                storeID: selectedVenueId,
                archived: false,
              }

              // Read packages data from cache
              const cachedData = cache.readQuery({
                query: getPackages,
                variables,
              })
              // Add new packages to the cached data
              const importedPackages = packages.map(pack => ({
                node: pack,
                __typename: 'PackageEdge',
              }))
              const cachedPackages = get(cachedData, 'store.packages.edges', [])
              const newPackagesData = {
                store: {
                  id: selectedVenueId,
                  __typename: 'Store',
                  packages: {
                    edges: [...cachedPackages, ...importedPackages],
                    __typename: 'PackageConnection',
                  },
                },
              }
              // Update the cache with the new packages data
              cache.writeQuery({
                query: getPackages,
                variables,
                data: newPackagesData,
              })

              // Read the venue settings from the cache
              const cachedSettings = cache.readQuery({
                query: fetchVenueSettings,
                variables,
              })
              // Set the last sync time to the current time
              set(cachedSettings, 'store.packagesLastImportedAt', new Date().toISOString())
              // Update the cache with the new last sync time
              cache.writeQuery({
                query: fetchVenueSettings,
                variables,
                data: cachedSettings,
              })
            }
          },
        })
          .then((response) => { // success
            setSyncLoading(false)
            addNotification(successNotif(`Imported ${get(response, 'data.importPackages.packages.length', 0)} packages successfully`))
          }, (error) => { // error
            setSyncLoading(false)
            addNotification(errorNotif(error.message))
          })
      },
    }),
  })(C)

export default withMetrcImport
