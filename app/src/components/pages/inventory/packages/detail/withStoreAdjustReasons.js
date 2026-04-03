import { graphql } from 'api/operationCompat'
import { fetchStoreAdjustmentReasons } from 'ops'
import { withVenueID } from 'components/Venue'
import { get } from 'lodash'
import { compose } from 'recompose'

// reasons are also included in the withPackageDetails, so this may not be needed anymore
export default compose(
  withVenueID,
  graphql(fetchStoreAdjustmentReasons, {
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    props: ({ data }) => (
      {
        reasons: get(data, 'store.adjustReasons', []),
      }
    ),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)
