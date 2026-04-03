//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { withVenueID } from 'components/Venue'
import { getComplianceList, archiveCompliance } from 'ops'
import { withNotifications, getNotification } from 'components/Notifications'
import { withConfirm } from 'components/Modal'

const deleteComplianceSuccessToast = name => getNotification('success', 'Compliance deleted', name)
const deleteComplianceErrorToast = (message = 'Error deleting compliance limit') => getNotification('error', 'Error', message)

const withDeleteCompliance = compose(
  withVenueID,
  withRouter,
  withNotifications,
  withConfirm(),
  graphql(archiveCompliance, {
    props: ({ mutate, ownProps }) => ({
      deleteCompliance: (id, name) => {
        const { history, selectedVenueId } = ownProps
        const input = {
          complianceLimitId: id,
        }
        return ownProps.confirm({
          title: 'Delete Compliance Limit?',
          message: 'Are you sure you want to delete this compliance limit?',
        }).then((confirmed) => {
          if (!confirmed) return undefined
          return mutate({
            variables: { input },
            refetchQueries: [{ // TODO: manually update the query instead of refetching
              query: getComplianceList,
              variables: {
                storeID: selectedVenueId,
              },
            }],
          }).then(() => {
            history.push('/settings/compliance') // Redirects to compliance list page
            ownProps.addNotification(deleteComplianceSuccessToast(name))
          }, (error) => { // Called if there's an error.
            ownProps.addNotification(deleteComplianceErrorToast(error.message))
          })
        })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export default withDeleteCompliance
