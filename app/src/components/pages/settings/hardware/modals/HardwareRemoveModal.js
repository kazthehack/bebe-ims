import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ButtonModal from 'components/Modal/ButtonModal'
import colors from 'styles/colors'
import { connectModal } from 'components/Modal'
import withDeleteTerminal from '../withDeleteTerminal'

const styles = {
  contentStyle: {
    content: {
      marginTop: '40px',
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: 'normal',
      color: colors.grayDark2,
      maxWidth: '474px',
      marginBottom: '40px',
    },
  },
}

const connectButtonModal = (id = 'HardwareRemoveModalPure') => connectModal(id)(ButtonModal)
class HardwareRemoveModalPure extends Component {
  constructor(props) {
    super(props)
    this.onClickDelete = this.onClickDelete.bind(this)
  }
  onClickDelete = () => {
    const { terminalId, deleteTerminal } = this.props
    deleteTerminal(terminalId)
  }
  render() {
    const { onRequestClose, name, deleteTerminal } = this.props
    const ConnectedButtonModal = connectButtonModal(`HardwareRemoveModalPure-${name}`)
    return (
      <ConnectedButtonModal
        title="Hardware Remove Modal"
        header="Warning"
        primaryButton={{ text: 'confirm', onClick: deleteTerminal }}
        secondaryButton={{ text: 'cancel', onClick: onRequestClose }}
        contentStyle={styles.contentStyle}
      >
        <div>
        This terminal will no longer function as a point-of-sale and
          all its connected devices will be removed.
          Do you want to proceed?
        </div>
      </ConnectedButtonModal>
    )
  }
}

HardwareRemoveModalPure.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  terminalId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  deleteTerminal: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}
const HardwareRemoveModal = withDeleteTerminal()(HardwareRemoveModalPure)

export default HardwareRemoveModal
