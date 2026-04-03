//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { updateDashboardSelection as gqlDashboardSelection } from 'ops/venues/mutations'

const withUpdateDashboardSelection = () => compose(
  graphql(gqlDashboardSelection, {
    props: ({ mutate, ownProps }) => ({
      updateDashboardSelection: (enableNewDashboard) => {
        const input = {
          storeId: ownProps.selectedVenueId,
          settings: {
            enableNewDashboard,
          },
        }
        return mutate({
          variables: { input },
        })
          .then(() => {
            // ownProps.addNotification(successNote())
          }, error =>
            // ownProps.addNotification(errorNote())
            error)
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export default withUpdateDashboardSelection
