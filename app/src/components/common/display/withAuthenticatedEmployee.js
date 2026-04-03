import React, { useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import { withVenueID } from 'components/Venue'
import { getAuthenticatedEmployee } from 'api/imsBridge'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { compose, withPropsOnChange } from 'recompose'
import { get } from 'lodash'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import { STORE_PERMISSIONS } from 'utils/permissions'
import PropTypes from 'prop-types'

const withAuthData = C => (props) => {
  const { selectedVenueId } = props
  const [state, setState] = useState({ loading: true, error: null, viewer: null })

  useEffect(() => {
    let cancelled = false
    if (!selectedVenueId) return undefined

    setState({ loading: true, error: null, viewer: null })
    getAuthenticatedEmployee(selectedVenueId)
      .then((result) => {
        if (cancelled) return
        setState({ loading: false, error: null, ...result })
        ReactGA.set({
          [GATypes.customDimensions.employeeId]: get(result, 'viewer.id'),
        })
      })
      .catch((error) => {
        if (cancelled) return
        setState({ loading: false, error, viewer: null })
      })

    return () => {
      cancelled = true
    }
  }, [selectedVenueId])

  const dataProp = useMemo(() => ({
    ...state,
  }), [state])

  return <C {...props} authenticatedUserData={dataProp} />
}

export default C => compose(
  withVenueID,
  withAuthData,
  withQueryErrorPageOnError('authenticatedUserData', false),
)(C)

export const withPermissions = permissionCategory => C => (
  withPropsOnChange(
    ['authenticatedUserData'], ({ authenticatedUserData }) => {
      const permissions = get(authenticatedUserData, 'viewer.portalRoles[0].permissions', [])
      return (
        {
          userPermissions: {
            write: permissions.includes(STORE_PERMISSIONS[`WRITE_${permissionCategory}`]),
            read: permissions.includes(STORE_PERMISSIONS[`READ_${permissionCategory}`]),
          },
        }
      )
    },
  )
)(C)

export const UserPermissionsPropType = PropTypes.shape({
  read: PropTypes.bool,
  write: PropTypes.bool,
})
