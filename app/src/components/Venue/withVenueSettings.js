//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { useEffect, useState } from 'react'
import { branch, compose, renderNothing } from 'recompose'
import Spinner from 'components/common/display/Spinner'
import { QueryErrorPage } from 'components/pages/ErrorPage'
import { withVenueID } from 'components/Venue'
import { getStoreSettings } from 'api/imsBridge'

const withVenueSettings = ({ name = 'venueSettings', needsLoading = true } = {}) => C => {
  const WithVenueSettings = ({ selectedVenueId, ...props }) => {
    const [query, setQuery] = useState({ loading: true, error: null, store: null })

    useEffect(() => {
      let cancelled = false
      if (!selectedVenueId) return undefined

      setQuery({ loading: true, error: null, store: null })
      getStoreSettings(selectedVenueId)
        .then((store) => {
          if (cancelled) return
          setQuery({ loading: false, error: null, store })
        })
        .catch((error) => {
          if (cancelled) return
          setQuery({ loading: false, error, store: null })
        })

      return () => {
        cancelled = true
      }
    }, [selectedVenueId])

    if (needsLoading && query.loading) {
      return <Spinner wrapStyle={{ paddingTop: '200px' }} />
    }

    if (query.error) {
      return <QueryErrorPage nav data={query} history={props.history} />
    }

    return <C {...props} selectedVenueId={selectedVenueId} {...{ [name]: query }} />
  }

  return WithVenueSettings
}

export default ({ name = 'venueSettings', ...config } = {}) => C => compose(
  withVenueID,
  branch(
    props => !props.selectedVenueId,
    renderNothing,
    withVenueSettings({ name, ...config }),
  ),
)(C)
