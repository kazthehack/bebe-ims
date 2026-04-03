import React from 'react'
import { compose } from 'recompose'
import { withConfirm } from 'components/Modal'
import { withRouter } from 'react-router-dom'

/* eslint-disable react/prop-types */
const withCancelConfirmation = (
  route,
  detailsObj = { title: 'Discard changes?', message: 'Are you sure you want to discard your changes?' },
) => C => props => (
  <C
    {...props}
    onCancel={pristine => (pristine ?
      props.history.push(route) :
      props.confirm(detailsObj).then(
        (confirmed) => {
          if (confirmed) props.history.push(route)
        },
      )
    )}
  />
)

export default (arg1, arg2) => compose(
  withRouter,
  withConfirm(),
  withCancelConfirmation(arg1, arg2),
)
