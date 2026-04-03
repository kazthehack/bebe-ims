import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Link, withRouter } from 'react-router-dom'
import Modal, { withModals, connectModal } from 'components/Modal'

export const MODAL_TYPES = ['foo', 'bar', 'baz']
const [foo, bar, baz] = MODAL_TYPES

const ConnectedModal1 = connectModal(foo)(Modal)
const ConnectedModal2 = connectModal(bar)(Modal)
const ConnectedModal3 = connectModal(baz)(Modal)

// TODO: port over integration tests for modals from other project

const ModalsTest = ({
  pushModal,
  popModal,
  replaceModal,
  clearModals,
  onModalOpened = (/* modalId */) => () => {
    // no args will be passed to onAfterOpen callback
    // http://reactcommunity.org/react-modal/#usage
    // console.log(`Modal OPENED (modalId = ${modalId})`);
  },
  onModalRequestClose = (/* modalId */) => () => {
    // no args will be passed to onRequestClose callback
    // http://reactcommunity.org/react-modal/#usage
    // console.log(`Modal REQUEST CLOSE (modalId = ${modalId})`);
  },
  onModalClosed = (/* modalId */) => {
    // onClose is passed 1 argument, which is the modalId of the "closed" Modal.
    // console.log(`Modal CLOSED (modalId = ${modalId})`);
  },
  onModalRemoved = (/* modalId */) => {
    // onRemove is passed 1 argument, which is the modalId of the "removed-from-stack" Modal.
    // console.log(`Modal REMOVED (modalId = ${modalId})`);
  },
}) => (
  <div>
    <h3>Modals Test</h3>
    <button className="foo" onClick={() => pushModal(foo)}> push foo </button>
    <ConnectedModal1
      onAfterOpen={onModalOpened(foo)}
      onRequestClose={onModalRequestClose(foo)}
      onClose={onModalClosed}
      onRemove={onModalRemoved}
    >
      <h2>Modal 1 (foo)</h2>
      <button className="foobar" onClick={() => pushModal(bar)}> push bar </button>
      <button className="clear" onClick={() => clearModals()}> clear </button>
      <button className="pop" onClick={() => popModal()}> pop </button>
      <Link to="/"> Home </Link>
    </ConnectedModal1>
    <ConnectedModal2
      onAfterOpen={onModalOpened(bar)}
      onRequestClose={onModalRequestClose(bar)}
      onClose={onModalClosed}
      onRemove={onModalRemoved}
    >
      <h2>Modal 2 (bar)</h2>
      <button className="barbaz" onClick={() => pushModal(baz)}> push baz </button>
      <button className="clear" onClick={() => clearModals()}> clear </button>
      <button className="pop" onClick={() => popModal()}> pop </button>
      <Link to="/"> Home </Link>
    </ConnectedModal2>
    <ConnectedModal3
      onAfterOpen={onModalOpened(baz)}
      onRequestClose={onModalRequestClose(baz)}
      onClose={onModalClosed}
      onRemove={onModalRemoved}
    >
      <h2>Modal 3 (baz)</h2>
      <button className="bazfoo" onClick={() => pushModal(foo)}> push foo </button>
      <button className="clear" onClick={() => clearModals()}> clear </button>
      <button className="pop" onClick={() => popModal()}> pop </button>
      <button className="replace-bazfoo" onClick={() => replaceModal(foo)}> replace foo </button>
    </ConnectedModal3>
    <ul>
      <li><Link to="/test/modals/popups"> Alert Modal Tests </Link></li>
      <li><Link to="/"> Bloom Portal Home </Link></li>
    </ul>
  </div>
)

ModalsTest.propTypes = {
  pushModal: PropTypes.func,
  popModal: PropTypes.func,
  replaceModal: PropTypes.func,
  clearModals: PropTypes.func,
  onModalOpened: PropTypes.func,
  onModalRequestClose: PropTypes.func,
  onModalClosed: PropTypes.func,
  onModalRemoved: PropTypes.func,
}

export default compose(
  withRouter,
  withModals,
)(ModalsTest)
