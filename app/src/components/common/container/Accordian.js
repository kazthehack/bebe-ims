import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
`

const ToggleButton = styled.div`
  height: 20px;
  width: 95px;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
`

const ButtonTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${colors.grayDark2};
`

const ArrowLeft = styled.div`
  width: 0; 
  height: 0;
  margin-top: 4px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent; 
  border-right: 5px solid ${colors.blue};
`

const ArrowDown = styled.div`
  width: 0; 
  height: 0; 
  margin-top: 5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent; 
  border-top: 5px solid ${colors.blue};
`

const AccordianContent = styled.div`
  background-color: white;
  transition: max-height 0.6s ease;
  border: 1px solid #e7e7e7;
  overflow: ${({ open }) => (open ? 'initial' : 'auto')};
`

const FormContent = styled.div`
  margin: 14px 36px;
`

const Accordion = ({ label, displayContent, actionButton, renderWhenClosed = true }) => {
  const [open, setOpen] = useState(false)
  const [prefix, setPrefix] = useState('Show')

  const content = useRef(null)

  const toggleAccordion = () => {
    const initialOpen = open
    setOpen(!initialOpen)
    setPrefix(initialOpen ? 'Show' : 'Hide')
  }

  return (
    <>
      <ActionButtons>
        <ToggleButton onClick={toggleAccordion}>
          {open ? <ArrowLeft /> : <ArrowDown />}
          <ButtonTitle>{prefix} {label}</ButtonTitle>
        </ToggleButton>
        {actionButton}
      </ActionButtons>
      <AccordianContent
        ref={content}
        style={{ display: !open ? 'none' : 'block' }}
        open={open}
      >
        <FormContent>
          {(renderWhenClosed || open) && displayContent}
        </FormContent>
      </AccordianContent>
    </>
  )
}

Accordion.propTypes = {
  label: PropTypes.string,
  displayContent: PropTypes.node.isRequired,
  actionButton: PropTypes.node,
  renderWhenClosed: PropTypes.bool,
}

export default Accordion
