import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { withRouter } from 'react-router'
import { finishPackage, getPackage } from 'ops'
import { withNotifications, getNotification } from 'components/Notifications'
import { withModals } from 'components/Modal'
import { withVenueID } from 'components/Venue'
import { format } from 'date-fns'
import { get } from 'lodash'

const successFinish = () => getNotification('success', 'Success:', 'The request was sent to Metrc and is pending approval. You will receive a notification when it\'s finished.')
const errorFinish = message => getNotification('error', 'Error', message)
const withFinishPackage = C => compose(
  withNotifications,
  withModals,
  withRouter,
  withVenueID,
  graphql(finishPackage, {
    props: ({ mutate, ownProps: {
      packageId,
      metrcReadOnly,
      addNotification,
      popModal,
      selectedVenueId,
      match,
    } }) => ({
      finishPackage: () => {
        const variables = {
          input: {
            packageId,
            when: format(new Date(), 'YYYY-MM-DD'),
          },
        }
        // Safeguard against allowing metrc mutation on a readOnly store. Should never be reached.
        if (metrcReadOnly) {
          addNotification(errorFinish('Operation not allowed in METRC Read Only Mode.'))
          return false
        }

        return mutate({
          variables,
          refetchQueries: [{
            query: getPackage,
            variables: {
              packageID: get(match, 'params.id'),
              storeID: selectedVenueId,
            },
          }],
        }).then(() => { // success
          addNotification(successFinish())
          popModal()
        }, (error) => { // error
          addNotification(errorFinish(error.message))
          return error
        })
      },
    }),
  }),
)(C)

export default withFinishPackage
