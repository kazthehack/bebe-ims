//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import { get } from 'lodash'
import { compose, withPropsOnChange } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getTaxList } from 'ops/tax'
import { withVenueID } from 'components/Venue'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

import { TaxModel } from './propTypes'

export default ({
  name = 'taxListData',
  includeTaxArchives = false,
  ...config
} = {}) => C => compose(
  withVenueID,
  graphql(getTaxList, {
    name,
    ...config,
    // TODO: handle merging `config.options` if ever necessary?
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
        includeTaxArchives, // true if you want to retrieve archived records too
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withPropsOnChange([name], props => ({
    taxList: (get(props, `${name}.store.taxes.edges`) || []).map(({ node }) => node) || [],
  })),
)(C)

export const TaxListPropTypes = {
  selectedVenueId: PropTypes.string,
  taxListData: PropTypes.shape({
    store: PropTypes.shape({
      taxes: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: TaxModel,
          }),
        ),
      }),
    }),
  }),
  taxList: PropTypes.arrayOf(TaxModel),
}
