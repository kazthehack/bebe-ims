import { graphql } from 'api/operationCompat'
import { get } from 'lodash'
import { withProps, compose } from 'recompose'
import { APP_ENABLE_PUBLIC_DEMO_MODE } from 'environment'
import { fetchDemoStoreStatus } from 'ops/demo'
import { CHECK_DEMO_STATUS_POLL_INVERVAL } from 'constants/Settings'

export default compose(
  graphql(fetchDemoStoreStatus, {
    name: 'demoStoreStatus',
    options: () => ({
      pollInterval: CHECK_DEMO_STATUS_POLL_INVERVAL,
    }),
    skip: () => !APP_ENABLE_PUBLIC_DEMO_MODE,
  }),
  withProps(({ demoStoreStatus, ...props }) => ({
    demoStoreStatus: get(demoStoreStatus, 'demoStoreStatus'),
    ...props,
  })),
)
