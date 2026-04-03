import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { APP_ENABLE_PUBLIC_DEMO_MODE } from 'environment'
import { DemoStoreStatus } from 'constants/Demo'
import { withNotifications, getNotification } from 'components/Notifications'
import withCreatingDemoStore from './withCreatingDemoStore'

let toastId = null
const CheckStoreCreation = compose(
  withCreatingDemoStore,
  withNotifications,
)(({ demoStoreStatus, addNotification, removeNotification }) => {
  const toastMessage = getNotification('success', 'Populating your store with data!', null, 'loading', 0, 'none')

  if (APP_ENABLE_PUBLIC_DEMO_MODE && !toastId && (
    demoStoreStatus === DemoStoreStatus.started
    || demoStoreStatus === DemoStoreStatus.pending
    || demoStoreStatus === DemoStoreStatus.failure
  )) {
    toastId = addNotification(toastMessage)
  } else if (toastId) {
    removeNotification(toastId)
  }

  return null
})

CheckStoreCreation.propTypes = {
  demoStoreStatus: PropTypes.string,
  addNotification: PropTypes.func,
  removeNotification: PropTypes.func,
}

export default CheckStoreCreation
