// Copyright (c) 2017-2019 First Foundry Inc. All rights reserved.

export const DATE_FORMAT = 'MM/DD/YYYY'
export const GA_DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss'
export const DATE_INPUT_FORMAT = 'YYYY-MM-DD'
export const TIME_FORMAT = 'h:mm A'
export const DEFAULT_TIMEZONE = 'America/Los_Angeles'
export const DATE_TIME_12_FORMAT = `${DATE_FORMAT}, ${TIME_FORMAT}`
export const QUERY_ERROR_MESSAGE = `Failed to fetch your data. Please check your connection
  and try reloading the page. If the problem persists please contact support@bloomup.co`


export const PAGE_POLL_INTERVAL = (process.env.NODE_ENV === 'development') ? 300000 : 300000 // 5 minutes in milliseconds
export const ALERTS_POLL_INTERVAL = (process.env.NODE_ENV === 'development') ? 300000 : 300000 // 5 minutes in milliseconds
export const FINISH_PACKAGE_POLL_INTERVAL = (process.env.NODE_ENV === 'development') ? 300000 : 300000 // 5 minutes in milliseconds
export const REPORTS_POLL_INTERVAL = (process.env.NODE_ENV === 'development') ? 30000 : 30000 // 30 seconds in milliseconds
export const CHECK_DEMO_STATUS_POLL_INVERVAL = 60000 // 1 minute in milliseconds
