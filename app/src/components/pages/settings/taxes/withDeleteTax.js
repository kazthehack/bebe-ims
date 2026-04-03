//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { get, set, filter } from 'lodash'
import { getTaxList, archiveTax as gqlArchiveTax } from 'ops/tax'
import { getNotification } from 'components/Notifications'
import { withAlert } from 'components/Modal'

const ATTEMPT_DELETE_ACTIVE_TITLE = 'Tax is still active'
const ATTEMPT_DELETE_ACTIVE_MESSAGE = 'Active taxes cannot be deleted. Please deactivate the tax, save, and try again.'
const CONFIRM_DELETE_MESSAGE = 'Are you sure you want to delete this tax?'

const deleteTaxSuccessToast = name => getNotification('success', 'Tax deleted', name)
const deleteTaxErrorToast = (message = 'Error deleting tax') => getNotification('error', 'Error', message)

export default () => compose(
  withAlert(),
  graphql(gqlArchiveTax, {
    props: ({ mutate, ownProps }) => {
      const {
        taxData: { tax },
        confirm,
        alert,
        taxId,
        selectedVenueId,
        addNotification,
        history,
      } = ownProps
      return {
        deleteTax: () => {
          if (tax.active) {
            return alert({
              title: ATTEMPT_DELETE_ACTIVE_TITLE,
              message: ATTEMPT_DELETE_ACTIVE_MESSAGE,
            })
          }
          return (
            confirm({ message: CONFIRM_DELETE_MESSAGE }).then((confirmed) => {
              if (!confirmed) return undefined
              return mutate({
                variables: { input: { taxId } },
                update: (cache) => {
                  const variables = { storeID: selectedVenueId }
                  const data = cache.readQuery({ query: getTaxList, variables })
                  const prevTaxList = get(data, 'store.taxes.edges') || []
                  const nextTaxList = filter(
                    prevTaxList,
                    elt => get(elt, 'node.id') !== taxId,
                  )
                  set(data, 'store.taxes.edges', nextTaxList)
                  return cache.writeQuery({
                    query: getTaxList,
                    variables,
                    data,
                  })
                },
              }).then(() => {
                history.push('/settings/taxes') // Redirects to taxes list page
                addNotification(deleteTaxSuccessToast(ownProps.taxData.tax.name))
              }, (error) => { // Called if there's an error.
                addNotification(deleteTaxErrorToast(error.message))
              })
            })
          )
        },
      }
    },
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)
