import React from 'react'
import { compose } from 'recompose'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import NavigationBar from 'components/common/navigation/NavigationBar'
import { withVenueID } from 'components/Venue'
import { withStoreEnableDareMode } from 'components/pages/settings/venue/withEnableDareMode'

const links = enableDareMode => [
  { to: '/settings', content: `${enableDareMode ? 'General Settings' : 'Dispensary'}`, exact: true },
  { to: '/settings/taxes', content: 'Taxes' },
  { to: '/settings/compliance', content: 'Compliance', hide: enableDareMode },
  { to: '/settings/thirdparty', content: '3rd Party integrations', hide: enableDareMode },
  { to: '/settings/hardware', content: 'POS hardware' },
]

const SettingsNavigationBar = ({ venueSettings }) => (
  <NavigationBar
    links={links(get(venueSettings, 'store.settings.enableDareMode'))}
  />
)

SettingsNavigationBar.propTypes = {
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
)(SettingsNavigationBar)

