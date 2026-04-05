import PropTypes from 'prop-types'

export const dashboardEventPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  status: PropTypes.string,
})

export const dashboardNotificationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  level: PropTypes.string,
  timestamp: PropTypes.string,
})

export const siteSalesPropType = PropTypes.shape({
  site: PropTypes.string,
  gross: PropTypes.number,
  rent: PropTypes.number,
  operations: PropTypes.number,
  currency: PropTypes.string,
})

export const dashboardViewPropTypes = {
  calendarMonthLabel: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(dashboardEventPropType).isRequired,
  eventsByDate: PropTypes.objectOf(PropTypes.arrayOf(dashboardEventPropType)).isRequired,
  notifications: PropTypes.arrayOf(dashboardNotificationPropType).isRequired,
  sales: PropTypes.shape({
    site1: siteSalesPropType,
    site2: siteSalesPropType,
    site3: siteSalesPropType,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
}

export const emptyItemPropTypes = {
  children: PropTypes.node.isRequired,
}
