import { connect } from 'react-redux'
import { push, pop, replace, clear, remove } from 'store/modules/modals'

export default C =>
  connect(null, {
    pushModal: push,
    popModal: pop,
    replaceModal: replace,
    clearModals: clear,
    removeModals: remove,
  })(C)
