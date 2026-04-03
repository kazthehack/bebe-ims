import React, { Fragment } from 'react'
import { compose, withState, withHandlers } from 'recompose'
import Button from 'components/common/input/Button'
import {
  notifyApiError,
  notifyApiResponse,
} from 'components/Notifications'
import withTax from 'components/pages/settings/taxes/withTax'

// Example documentative use-case

const withApiNotificationTest = compose(
  withTax,
  notifyApiError('taxData'),
  notifyApiResponse('taxData', { message: 'sanity restored' }),
)

const ConnectedContent = withApiNotificationTest(({
  taxData = {},
}) => (
  <Fragment>
    <pre>{JSON.stringify(taxData, null, 2)}</pre>
  </Fragment>
))

const withRenderToggle = compose(
  withState('active', 'toggleRender', true),
  withHandlers({
    toggle: ({ toggleRender }) => () => toggleRender(val => !val),
  }),
)

const ApiNotificationsExample = withRenderToggle(({ toggle, active }) => (
  <Fragment>
    <h3>Apollo Api Notification Example(s) & Playground</h3>
    <p>
      This reference example is setup to allow for experimentation with our
      API Response Notifications System.
    </p>
    <p>
      This example is currently using the
      single model GET query for a Tax Model, but we may need to change
      this in future if the schema changes.
    </p>
    <p>
      Each time you click the TOGGLE RENDER button, the Apollo-Connected
      component will either be removed, or (re)rendered, so we can simulate
      cache behavior and other real-world situations.
    </p>
    <p>
      To test a SUCESS (green) notification, change the `ConnectedContent`
      `taxId` prop to a string, which shouild succesfully fetch, even if it
      only tells us that a model does not exist with that ID.
    </p>
    <Button onClick={toggle}>Toggle Render</Button>
    {active && <ConnectedContent taxId={undefined} />
    }
  </Fragment>
))

// TODO: tests/examples with apollo and other async errors

export default ApiNotificationsExample
