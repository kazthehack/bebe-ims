//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'api/operationCompat'
import { compose, branch } from 'recompose'
import { renderWhileLoading } from 'utils/hoc'
import { withRouter } from 'react-router-dom'
import { withVenueID } from 'components/Venue'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { addCompliance, updateCompliance, getComplianceLimit, getComplianceList } from 'ops'
import { forIn, isEmpty } from 'lodash'
import { withNotifications, getNotification } from 'components/Notifications'
import Spinner from 'components/common/display/Spinner'
import { withCancelConfirmation } from 'components/Modal'
import { withSalesTypes, defaultGroupings } from 'components/SalesTypes'
import { withQueryErrorPageOnError, PageNotFound } from 'components/pages/ErrorPage'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

import ComplianceDetailsPure from './ComplianceDetails'
import withDeleteCompliance from './withDeleteCompliance'

const addComplianceSuccessToast = name => getNotification('success', 'Compliance created', name)
const updateComplianceSuccessToast = name => getNotification('success', 'Compliance saved', name)
const addComplianceErrorToast = (message = 'Error creating compliance limit') => getNotification('error', 'Error', message)
const updateComplianceErrorToast = (message = 'Error saving compliance limit') => getNotification('error', 'Error', message)

export const NewRecreationalCompliance = () => <NewCompliance defaultCustomerType="RECREATIONAL" />
export const NewMedicalCompliance = () => <NewCompliance defaultCustomerType="MEDICAL" />

// TODO: this could be a common and reusable hocs for route id params
const withComplianceId = (C) => {
  const WithComplianceId = ({ match }) => <C complianceID={match.params.id} />

  WithComplianceId.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }

  return WithComplianceId
}

export const NewCompliance = compose(
  withVenueID,
  withRouter,
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withSalesTypes(defaultGroupings), // salesTypeData
  withNotifications,
  withCancelConfirmation('/settings/compliance', { title: 'Discard record', message: 'Discard this new compliance limit record?' }),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '512px' }} />, 'salesTypeData'),
  withQueryErrorPageOnError('salesTypeData', true),
  graphql(addCompliance, {
    props: ({ mutate, ownProps }) => ({
      onSubmit: ({ salesTypes, name, limitQuantity, customerType, unit, timeframe }) => {
        const { history, selectedVenueId } = ownProps
        const newSalesTypes = []
        forIn(salesTypes, (grouping) => {
          forIn(grouping, (value, key) => {
            if (value) newSalesTypes.push(key)
          })
        })
        const input = {
          storeId: selectedVenueId,
          complianceLimit: {
            name,
            limitQuantity,
            customerType,
            unit,
            salesTypes: newSalesTypes,
            timeframe,
          },
        }

        mutate({
          variables: { input },
          refetchQueries: [{ // TODO: manually update the query instead of refetching
            query: getComplianceList,
            variables: {
              storeID: selectedVenueId,
            },
          }],
        }).then(() => {
          history.push('/settings/compliance') // Redirects to compliance list page
          ownProps.addNotification(addComplianceSuccessToast(name))
        }, (error) => { // Called if there's an error.
          ownProps.addNotification(addComplianceErrorToast(error.message))
        })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(ComplianceDetailsPure)

export const EditCompliance = compose(
  withVenueID,
  withRouter,
  withComplianceId,
  withSalesTypes(defaultGroupings),
  withNotifications,
  withDeleteCompliance,
  withCancelConfirmation('/settings/compliance', { title: 'Discard changes', message: 'Discard changes made to this compliance limit record?' }),
  graphql(getComplianceLimit, { // TODO: create reusable HOC for getComplianceLimit
    name: 'complianceLimitData',
    options: ({ complianceID }) => ({
      variables: {
        complianceID,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '512px' }} />, ['complianceLimitData', 'salesTypeData']),
  withQueryErrorPageOnError(['complianceLimitData', 'salesTypeData'], true),
  branch(
    ({ complianceLimitData }) => isEmpty(complianceLimitData.complianceLimit),
    () => PageNotFound(true),
  ),
  graphql(updateCompliance, {
    props: ({ mutate, ownProps }) => ({
      onSubmit: ({ salesTypes, name, limitQuantity, customerType, unit, timeframe }) => {
        const { history, complianceID, selectedVenueId } = ownProps
        const newSalesTypes = []
        forIn(salesTypes, (grouping) => {
          forIn(grouping, (value, key) => {
            if (value) newSalesTypes.push(key)
          })
        })
        const input = {
          complianceLimitId: complianceID,
          complianceLimit: {
            name,
            limitQuantity,
            customerType,
            unit,
            salesTypes: newSalesTypes,
            timeframe,
          },
        }

        mutate({
          variables: { input },
          refetchQueries: [{ // TODO: manually update the query instead of refetching
            query: getComplianceList,
            variables: {
              storeID: selectedVenueId,
            },
          }],
        }).then(() => {
          history.push('/settings/compliance') // Redirects to compliance list page
          ownProps.addNotification(updateComplianceSuccessToast(name))
        }, (error) => { // Called if there's an error.
          ownProps.addNotification(updateComplianceErrorToast(error.message))
        })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(ComplianceDetailsPure)
