//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { fetchHardware, deleteTerminal as gqlDeleteTerminal } from 'ops/hardware'
import { withNotifications, getNotification } from 'components/Notifications'
import { withConfirm, withModals, withCancelConfirmation } from 'components/Modal'
import { get, set, findIndex } from 'lodash'
import { withRouter } from 'react-router-dom'
import { withVenueID } from 'components/Venue'

const successRemoved = (name = 'Hardware') => getNotification('success', 'Success:', `${name} removed`)
const errorAssign = (message = '') => getNotification('error', 'Error', message)

export default () => compose(
  withRouter,
  withVenueID,
  withNotifications,
  withConfirm(),
  withCancelConfirmation(),
  withModals,
  graphql(gqlDeleteTerminal, {
    props: ({ mutate, ownProps }) => ({
      deleteTerminal: () => {
        const input = {
          input: {
            id: ownProps.terminalId,
          },
        }
        mutate({
          variables: input,
          update: (cache) => {
            const variables = { storeID: ownProps.selectedVenueId }
            const data = cache.readQuery({ query: fetchHardware, variables })
            const prevTerminalList = get(data, 'store.terminals.edges') || []
            prevTerminalList.splice(findIndex(prevTerminalList, elt => get(elt, 'node.id') === ownProps.terminalId), 1)
            const nextTerminalList = prevTerminalList
            set(data, 'store.terminals.edges', nextTerminalList)
            return cache.writeQuery({
              query: fetchHardware,
              variables,
              data,
            })
          },
        })
          .then(() => { // After the promise is resolved. Is not called if there's an error.
            ownProps.addNotification(successRemoved())
            // history.pushState('/settings/hardware')
          }, (error) => {
            ownProps.addNotification(errorAssign(error.message))
            return error
          })
      },
    }),
  }),
)

