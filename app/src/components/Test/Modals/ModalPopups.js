import React from 'react'
import { Link } from 'react-router-dom'
import { withAlert, withConfirm } from 'components/Modal'

const AlertButton = withAlert('test-alert-1')(({
  alert = () => {},
}) => (
  <button
    onClick={() => alert({ title: 'Alert!', message: 'foobar', primaryText: 'ok ok' })
      .then(() => {
        console.log('alert closed!') // eslint-disable-line no-console
      })
    }
  >
    Render Alert (HOC))
  </button>
))

const ConfirmButton = withConfirm('test-confirm-1')(({
  confirm = () => {},
}) => (
  <button
    onClick={() => confirm({ title: 'Confirm?', message: 'wakawaka', primaryText: ':)', secondaryText: ':(' })
      .then((result) => {
        console.log('confirm closed!', result) // eslint-disable-line no-console
      })
    }
  >
    Render Confirm (HOC))
  </button>
))

const ModalPopups = () => (
  <div>
    <AlertButton />
    <ConfirmButton />
    <ul>
      <li><Link to="/test/modals"> Modals Test Home </Link></li>
      <li><Link to="/"> Bloom Portal Home </Link></li>
    </ul>
  </div>
)

export default ModalPopups
