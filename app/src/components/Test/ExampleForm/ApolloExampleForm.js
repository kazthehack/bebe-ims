//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form } from 'react-final-form'
import Subheader from 'components/common/display/Subheader'
import Button from 'components/common/input/Button'
import { FormTextField } from 'components/common/input/TextField'
import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { fetchVenueSettings, updateStore } from 'ops'
import { renderWhileLoading } from 'utils/hoc'
import { withVenueID } from 'components/Venue'
import { withConfirm } from 'components/Modal'
import { withNotifications } from 'components/Notifications'
import Spinner from 'components/common/display/Spinner'
import { get } from 'lodash'
import { createSelector } from 'reselect'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'

const STORE_ID = 'U3RvcmU6Mg=='

const StyledForm = styled.form`
  padding: 16px 0 16px 32px;
`

const ApolloForm = ({ onSubmit, data }) => {
  const store = get(data, 'store', {})
  // Here we define a variable that contains the initalValues for the form. We define a default,
  // and then spread the data from the server (here in 'store') after, so that if data is included,
  // it will overwrite the default. The data prop is provided by the 'graphql' HOC.
  const initalValues = {
    name: '',
    ...store,
  }

  return (
    <Fragment>
      {/*     APOLLO EXAMPLE FORM

        This is an example form that is fully Apollo integrated with a query and mutation. It
        fetches and mutates the store name of the store hard-coded below. I couldn't use the
        normal dynamic venueID because it isn't set in the test routes. A loading spinner displays
        during the query AND during the mutation. */}
      <Form
        // debug={console.log}
        onSubmit={onSubmit}
        initialValues={initalValues}
        render={({ handleSubmit, submitting, form }) => (
          <StyledForm onSubmit={handleSubmit}>
            {/* This submitting prop is true while the mutation is yet to complete, displaying the
              loading spinner. */}
            {submitting && <Spinner wrapStyle={{ paddingTop: '48px', position: 'absolute' }} />}
            <Subheader>Apollo Form Example</Subheader>
            <p>Warning: this will actually change the name of the store.</p>
            <FormTextField name="name" type="text" width="320px" placeholder="Store Name" />
            <Button onClick={() => { form.reset() }} style={{ marginRight: '24px' }} >Cancel</Button>
            <Button primary disabled={submitting} type="submit">Submit</Button>
            <pre>{JSON.stringify(store, null, 2)}</pre>
          </StyledForm>
        )}
      />
    </Fragment>
  )
}

ApolloForm.propTypes = {
  onSubmit: PropTypes.func,
  data: PropTypes.object,
}

const ApolloFormHOC = compose(
  withVenueID,
  withConfirm(),
  withNotifications,
  graphql(fetchVenueSettings, {
    options: () => ({
      variables: {
        storeID: STORE_ID, // Hardcoding this just for this example
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '200px' }} />),
  withQueryErrorPageOnError('data', false),
  graphql(updateStore, {
    props: createSelector(
      ({ ownProps }) => ownProps.addNotification,
      ({ ownProps }) => ownProps.confirm,
      ({ mutate }) => mutate,
      (notify, confirm, mutate) => ({
        // This is where the onSubmit prop is defined
        onSubmit: ({ name }) => confirm({
          title: 'Are you sure?',
          message: `This will change the name of the store w/ storeId=${STORE_ID} to "${name}"`,
        }).then((confirmed) => {
          // example using confirm prop via `withConfirm` hoc
          if (!confirmed) return Promise.resolve()
          return mutate({
            variables: {
              input: { storeId: STORE_ID, name },
            },
          }).then(() => {
            // examples using `addNotification` prop via `withNotifications` hoc
            notify({ level: 'success', message: 'store settings have been updated' })
          }).catch((error) => {
            notify({ level: 'error', message: 'error occured while updating store settings' })
            return error
          })
        }),
      }),
    ),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(ApolloForm)

export default ApolloFormHOC
