//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'

// Right now, these are for use with the withPriceGroups HOC. In future they can be adapted.
export const priceGroupPropType = PropTypes.shape({
  node: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    portalMedicalSame: PropTypes.bool.isRequired,
    prices: PropTypes.arrayOf(
      PropTypes.shape({
        customerType: PropTypes.string.isRequired,
        portalActive: PropTypes.bool.isRequired,
        price: PropTypes.shape({
          amount: PropTypes.string.isRequired,
          currency: PropTypes.string.isRequired,
        }),
        quantityAmount: PropTypes.number.isRequired,
        quantityUnit: PropTypes.string.isRequired,
        __typename: PropTypes.string.isRequired,
      }),
    ),
    shared: PropTypes.bool.isRequired,
    __typename: PropTypes.string.isRequired,
  }).isRequired,
  __typename: PropTypes.string.isRequired,
})

export const priceGroupsPropType = PropTypes.arrayOf(
  priceGroupPropType,
).isRequired
