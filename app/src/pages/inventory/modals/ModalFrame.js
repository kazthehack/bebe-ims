import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(23, 33, 45, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`

const Panel = styled.div`
  width: 520px;
  border: 1px solid #d6e0eb;
  border-radius: 4px;
  background: #f8fafc;
  padding: 14px;
`

const ModalFrame = ({ title, children, onClose }) => (
  <Overlay onClick={onClose}>
    <Panel onClick={(event) => event.stopPropagation()}>
      <h3>{title}</h3>
      {children}
    </Panel>
  </Overlay>
)

ModalFrame.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ModalFrame
