import React from 'react'
import { compose } from 'recompose'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import NavigationBar from 'components/common/navigation/NavigationBar'
import { withVenueID } from 'components/Venue'
import { withStoreEnableDareMode } from 'components/pages/settings/venue/withEnableDareMode'

const links = enableDareMode => [
  { to: '/inventory/products', content: 'Products' },
  { to: '/inventory/packages', content: 'Packages', hide: enableDareMode },
  { to: '/inventory/price-groups', content: 'Price groups', hide: enableDareMode },
  { to: '/inventory/pos-categories', content: 'POS categories', hide: enableDareMode },
]

const InventoryNavigationBar = ({ venueSettings }) => (
  <NavigationBar
    links={links(get(venueSettings, 'store.settings.enableDareMode'))}
  />
)

InventoryNavigationBar.propTypes = {
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        enableDareMode: PropTypes.bool,
      }),
    }),
  }),
}

export default compose(
  withVenueID,
  withStoreEnableDareMode,
)(InventoryNavigationBar)
