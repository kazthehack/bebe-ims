import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ButtonModal from 'components/Modal/ButtonModal'
import Button from 'components/common/input/Button'
import { connectModal, withConfirm, withModals } from 'components/Modal'
import colors from 'styles/colors'
import { Form } from 'react-final-form'
import { get, isEmpty, map, range } from 'lodash'
import { withRouter } from 'react-router'
import { compose } from 'recompose'
import { combineValidators, emailValidator } from 'utils/validators'
import withStoreRoles from './employees/details/withStoreRoles'
import { TooltipWithIcon } from '../common/display'
import { FormTextField } from '../common/input/TextField'
import { FormSelectField } from '../common/input/SelectField'
import withInviteDemoEmployee from './employees/withInviteDemoEmployee'
import withAuthenticatedEmployee from '../common/display/withAuthenticatedEmployee'
import { withNotifications } from '../Notifications'
import { withVenueID } from '../Venue'

const StyledTextField = styled(FormTextField)`
  width: 320px;
`

const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  flex: 2.5 0 25%;
  font-size: 16px;
  max-width: 135px;
`

const StyledFormGroup = styled(({ children, className, label, tooltip, ...props }) => (
  <div className={className}>
    <StyledLabel>{label}{tooltip && <TooltipWithIcon text={tooltip} />}</StyledLabel>
    <div style={{ width: '100%' }}>
      {children || <StyledTextField {...props} type="text" />}
    </div>
  </div>
))`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px;
`

const StyledButton = styled(Button)`
  margin-top: 6px;
  margin-right: 12px;
`

const StyledSelectField = styled(FormSelectField)`
  width: 220px;
`

const StyledContent = styled.div`
  display: flex;
  margin: 8px;
`

const ConnectedButtonModal = connectModal('ShareStoreModal')(ButtonModal)

const NewEmployeeForm = ({ employee, portalRoles, posRoles, changeEmployee, index }) => (
  <StyledContent>
    <StyledFormGroup
      label="Email"
      name={`email-${index}`}
      placeholder="user@example.com"
      validate={combineValidators(
        email => (isEmpty(email) ? null : emailValidator(email)),
      )}
      onBlur={event =>
        changeEmployee({
          ...employee,
          email: event.target.value,
        })
      }
    />
    <StyledFormGroup label="Portal role">
      <StyledSelectField
        name="portalRoleId"
        options={portalRoles}
        value={employee.portalRoleId}
        onChange={event => changeEmployee({
          ...employee,
          portalRoleId: event.target.value,
        })}
      />
    </StyledFormGroup>
    <StyledFormGroup label="POS role">
      <StyledSelectField
        name="posRoleId"
        options={posRoles}
        value={employee.posRoleId}
        onChange={event => changeEmployee({
          ...employee,
          posRoleId: event.target.value,
        })}
      />
    </StyledFormGroup>
  </StyledContent>
)

NewEmployeeForm.propTypes = {
  changeEmployee: PropTypes.func,
  posRoles: PropTypes.arrayOf(PropTypes.object),
  portalRoles: PropTypes.arrayOf(PropTypes.object),
  employee: PropTypes.object,
  index: PropTypes.number,
}

const ShareStoreModal = ({
  pushModal,
  popModal,
  sendInvite,
  posRoles,
  portalRoles,
  authenticatedUserData,
}) => {
  const userPortalRole = get(authenticatedUserData, 'viewer.portalRoles.0')
  const userPOSRole = get(authenticatedUserData, 'viewer.posRoles.0')
  const initialEmployeeState = map(range(5), (a, index) => ({
    id: index,
    email: '',
    portalRoleId: get(userPortalRole, 'id'),
    posRoleId: get(userPOSRole, 'id'),
  }))
  const [employees, setEmployees] = useState(initialEmployeeState)
  const changeEmployee = (employee) => {
    employees[employee.id] = employee
    setEmployees(employees)
  }
  return (<Form
    onSubmit={(...args) => {
      sendInvite(...args)
      setEmployees(initialEmployeeState)
    }}
    initialValues={{
      employees,
    }}
    render={({ handleSubmit, form, errors }) => (
      <Fragment>
        <StyledButton white type="button" onClick={() => pushModal('ShareStoreModal')}>Share Store</StyledButton>
        <ConnectedButtonModal
          title="Share store"
          header="Share store"
          primaryButton={{
            onClick: () => {
              handleSubmit()
              popModal()
            },
            text: 'send',
            disabled: isEmpty(employees.filter(e => !isEmpty(e.email))) || !isEmpty(errors),
          }}
          secondaryButton={{
            text: 'cancel',
            onClick: () => {
              form.reset()
              popModal()
            },
          }}
        >
          {
            employees.map((employee, index) => (
              <NewEmployeeForm
                key={`employee-${employee.id}`}
                employee={employee}
                portalRoles={portalRoles}
                posRoles={posRoles}
                changeEmployee={changeEmployee}
                index={index}
              />
            ))
          }
        </ConnectedButtonModal>
      </Fragment>
  )}
  />
  )
}

ShareStoreModal.propTypes = {
  pushModal: PropTypes.func.isRequired,
  popModal: PropTypes.func.isRequired,
  sendInvite: PropTypes.func,
  posRoles: PropTypes.arrayOf(PropTypes.object),
  portalRoles: PropTypes.arrayOf(PropTypes.object),
  authenticatedUserData: PropTypes.object,
}

const ShareStoreModalHOC = C => compose(
  withConfirm(),
  withModals,
  withVenueID,
  withRouter,
  withStoreRoles(),
  withNotifications,
  withAuthenticatedEmployee,
  withInviteDemoEmployee,
)(C)

export default ShareStoreModalHOC(ShareStoreModal)
