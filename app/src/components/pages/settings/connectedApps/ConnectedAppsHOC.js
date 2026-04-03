//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import { renderWhileLoading } from 'utils/hoc'
import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { withVenueID } from 'components/Venue'
import { getIntegrations, updateIntegrations } from 'ops'
import Spinner from 'components/common/display/Spinner'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import AppPanel from './ConnectedAppPanel'

// TODO: When the endpoint works better, possibly implement network-only or refetchQueries
const ConnectedAppsHOC = compose(
  withVenueID,
  graphql(getIntegrations, {
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  renderWhileLoading(() => (
    <Spinner
      size={6}
      interval={2}
      wrapStyle={{
        paddingTop: '48px',
      }}
    />
  )),
  withQueryErrorPageOnError('data', true),
  graphql(updateIntegrations, {
    props: ({ mutate, ownProps }) => ({
      onSubmit: ({ ...values }) => {
        const input = {
          input: {
            storeId: ownProps.selectedVenueId,
            metrc: {
              ...values,
            },
          },
        } // TODO: when this endpoint works correctly investigate the typename
        delete input.__typename // eslint-disable-line no-underscore-dangle
        return mutate({
          variables: input,
        })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(AppPanel)

export default ConnectedAppsHOC
