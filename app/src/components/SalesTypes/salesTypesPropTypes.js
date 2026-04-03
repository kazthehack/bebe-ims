//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'

export const salesTypePropTypes =
  PropTypes.shape({
    category: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    liquid: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    portalTag: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    __typename: PropTypes.string.isRequired,
  }).isRequired

export const salesTypesPropTypes =
  PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.name,
      salesTypes: PropTypes.arrayOf(
        salesTypePropTypes,
      ),
    }),
  ).isRequired

export const salesTypeDataPropTypes =
  PropTypes.shape({
    salesTypes: salesTypesPropTypes,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
  })
