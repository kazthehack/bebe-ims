//  Copyright (c) 2019 First Foundry Inc. All rights reserved.
import { createSelector } from 'reselect'
import { get } from 'lodash'

export const getVenues = state => get(state, 'venues') || {}
export const getVenueList = state => get(state, 'venues.list') || []
export const getSelectedVenueId = state => get(state, 'venues.selectedId')

// TODO: When this functionality is needed make sure this works.
export const getSelectedVenue = createSelector(
  getSelectedVenueId,
  getVenueList,
  (id, list) => list.find(m => m.id),
)
