// Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { addManagedInventoryEvent, getProduct } from 'ops'
import { getNotification } from 'components/Notifications'
import { format } from 'date-fns'

const successNotif = (message = 'Inventory successfully adjusted') => getNotification('success', 'Success:', message)
const errorNotif = (message = 'Error adjusting inventory') => getNotification('error', 'Error', message)

const withAdjustInventory = C =>
  graphql(addManagedInventoryEvent, {
    props: ({ mutate, ownProps: { addNotification } }) => ({
      adjustInventory: ({ queuedAdjustment: {
        modalDate,
        modalReport,
        modalAmount,
      }, id }) => {
        const input = {
          input: {
            productId: id,
            event: {
              eventDate: `${format(modalDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')}`,
              eventType: modalReport,
              quantity: modalAmount,
              notes: '',
            },
          },
        }
        return mutate({
          variables: input,
          refetchQueries: [{
            query: getProduct,
            variables: {
              productID: id,
            },
          }],
        }).then(() => { // success
          addNotification(successNotif())
        }, (error) => { // error
          addNotification(errorNotif(error.message))
        })
      },
    }),
  })(C)

export default withAdjustInventory
