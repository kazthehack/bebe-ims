//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import colors from 'styles/colors'

const ButtonsContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 93%;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: ${({ edit }) => (edit ? 'flex-end' : 'space-between')};
  align-items: center;
  margin-left: -65px;
  background-color: ${colors.white};
  border-top: 1px solid ${colors.grayLight2};
  z-index: 1;
`

const CancelSaveContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-right: 85px;
`

const DeleteContainer = styled.div`
  display: flex;
  text-transform: uppercase;
  margin-left: 40px;
`

const EditButtonContainer = styled.div`
  margin-right: 85px;
`

const StyledButton = styled(Button)`
  margin-right: 20px;
`

const FixedFooterContainer = ({
  showSave,
  saveButtonType,
  saveDisabled,
  onSave,
  showCancel,
  onCancel,
  showEdit,
  onEdit,
  editDisabled,
  showDelete,
  deleteText,
  onDelete,
}) => (
  <ButtonsContainer edit={showEdit}>
    {showEdit ?
      <EditButtonContainer>
        <StyledButton id="editButton" primary onClick={onEdit} disabled={editDisabled}>
          Edit
        </StyledButton>
      </EditButtonContainer>
      :
      <>
        <DeleteContainer>
          {showDelete &&
            <Button onClick={onDelete} plainDelete>
              {deleteText}
            </Button>
          }
        </DeleteContainer>
        <CancelSaveContainer>
          {showCancel &&
            <StyledButton id="cancelButton" onClick={onCancel}>
              Cancel
            </StyledButton>
          }
          {showSave &&
            <StyledButton
              id="saveButton"
              primary
              type={saveButtonType}
              disabled={saveDisabled}
              onClick={onSave}
            >
              Save
            </StyledButton>
          }
        </CancelSaveContainer>
      </>
    }
  </ButtonsContainer>
)

FixedFooterContainer.propTypes = {
  showSave: PropTypes.bool,
  saveButtonType: PropTypes.string,
  saveDisabled: PropTypes.bool,
  onSave: PropTypes.func,
  showCancel: PropTypes.bool,
  onCancel: PropTypes.func,
  showEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  editDisabled: PropTypes.bool,
  showDelete: PropTypes.bool,
  deleteText: PropTypes.string,
  onDelete: PropTypes.func,
}


export default FixedFooterContainer
