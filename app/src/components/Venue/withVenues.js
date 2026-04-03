//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Spinner from 'components/common/display/Spinner'
import { QueryErrorPage } from 'components/pages/ErrorPage'
import { getStores } from 'api/imsBridge'
import {
  setList,
  select,
  getSelectedVenueId,
  getSelectedVenue,
  getVenueList,
} from 'store/modules/venues'

const mapStateVenueIdToProps = state => ({
  selectedVenueId: getSelectedVenueId(state),
})

const mapStateToProps = state => ({
  selectedVenue: getSelectedVenue(state),
  venueList: getVenueList(state),
})

export const withAllVenues = connect(mapStateToProps, {})

export const withVenueID = connect(mapStateVenueIdToProps, {})

export const withVenues = C => {
  const Inner = ({ setList: setVenueList, select: selectVenue, selectedVenueId, ...props }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
      let cancelled = false

      setLoading(true)
      getStores()
        .then((stores) => {
          if (cancelled) return

          const list = stores
            .map(node => ({ node }))
            .sort((a, b) => `${a.node.name || ''}`.localeCompare(`${b.node.name || ''}`))

          setVenueList(list)
          const selectedExists = selectedVenueId && list.some(item => `${item.node.id}` === `${selectedVenueId}`)
          if (!selectedExists) {
            selectVenue(list.length ? list[0].node.id : null)
          }
          setLoading(false)
        })
        .catch((err) => {
          if (cancelled) return
          setError(err)
          setLoading(false)
        })

      return () => {
        cancelled = true
      }
    }, [setVenueList, selectVenue])

    if (loading) {
      return <div style={{ height: '64px' }}><Spinner size={3} interval={2} /></div>
    }

    if (error) {
      return <QueryErrorPage nav={false} data={{ error }} history={props.history} />
    }

    return <C {...props} />
  }

  return connect(mapStateVenueIdToProps, { setList, select })(Inner)
}
