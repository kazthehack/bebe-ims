// Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { updateScreen, getScreens } from 'ops'
import { compose, withState } from 'recompose'
import { withVenueID } from 'components/Venue'
import { withConfirm } from 'components/Modal'
import { withNotifications, getNotification } from 'components/Notifications'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { isEqual } from 'lodash'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import PosCategories from './PosCategories'

const updateCategoriesSuccessToast = categories => getNotification('success', 'POS categories saved', categories)
const updateCategoriesErrorToast = (message = 'Error saving categories') => getNotification('error', 'Error', message)

export const withUpdateScreen = C =>
  graphql(updateScreen, {
    props: ({ mutate, ownProps: { screenData, setEditing, addNotification } }) => ({
      onSubmit: (arg) => {
        const promises = []
        screenData.store.screens.forEach((screen) => {
          const newScreen = arg[screen.name]
          if (!isEqual(screen, newScreen)) {
            const variables = {
              input: {
                screenId: screen.id,
                screen: {
                  active: newScreen.active,
                  name: screen.name,
                  iconName: screen.iconName,
                  salesTypes: screen.salesTypes.map(type => type.id),
                },
              },
            }
            promises.push(mutate({
              variables,
            }))
          }
        })
        Promise.all(promises).then((response) => {
          const categoriesNames = response.map(eachResponse =>
            eachResponse.data.updateScreen.screen.name)
          setEditing(false)
          addNotification(updateCategoriesSuccessToast(categoriesNames.join('/')))
        }, (error) => {
          addNotification(updateCategoriesErrorToast(error.message))
        })
      },
    }),
  })(C)

export const withScreens = C =>
  graphql(getScreens, {
    name: 'screenData',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)

export const POSCategoriesHOC = compose(
  withVenueID,
  withNotifications,
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  withScreens,
  withState('editing', 'setEditing', false),
  withUpdateScreen,
  withConfirm(),
  withQueryErrorPageOnError('screenData', true),
)(PosCategories)
