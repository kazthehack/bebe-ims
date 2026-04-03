// Copyright (c) 2020 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { compose, branch } from 'recompose'
import Title from 'components/common/display/Title'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { FormTextField } from 'components/common/input/TextField'
import Spinner from 'components/common/display/Spinner'
import { Form } from 'react-final-form'
import { withRouter } from 'react-router-dom'
import { ProductIcon } from 'components/common/display/ProductIcon'
import Subheader from 'components/common/display/Subheader'
import { focusOnError } from 'components/common/form/decorators'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import { Table } from 'components/Table'
import { withModals } from 'components/Modal'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import StatBox from 'components/pages/home/partials/StatBox'
import { get, isEmpty, map, trimStart } from 'lodash'
import moment from 'moment-timezone'
import {
  combineValidators,
  required,
  sanitizedStringValidator,
  emailValidator,
  phoneNumberValidator,
} from 'utils/validators'
import { DATE_FORMAT, DATE_TIME_12_FORMAT } from 'constants/Settings'
import { withNotifications } from 'components/Notifications'
import formatPhoneNumber from 'utils/phoneNumber'
import { withVenueSettings } from 'components/Venue'
import { renderWhileLoading } from 'utils/hoc'
import withUpdateCustomer from './withUpdateCustomer'
import AdjustCustomerPointsModal from './AdjustCustomerPointsModal'
import withCustomerDetails from './withCustomerDetails'
import withPointsAdjustments from './withPointsAdjustments'
import { PageNotFound } from '../../ErrorPage'

const StyledPointsProductIcon = styled(ProductIcon)`
  font-size: 18px;
`

const columns = timezone => [{
  Header: 'Employee',
  accessor: 'employee.name',
}, {
  Header: 'Points added/removed',
  accessor: 'points',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => {
    if (value > 0) return <><StyledPointsProductIcon type="plus-circle" /> {value} </>
    return <><StyledPointsProductIcon type="circle-minus" /> {value * -1} </>
  },
}, {
  Header: 'reason',
  accessor: 'reason',
}, {
  Header: 'date',
  accessor: 'createdAt',
  Cell: ({ value }) => moment.utc(value).tz(timezone).format(DATE_TIME_12_FORMAT),
}]

const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  flex: 2.5 0 25%;
  font-size: 16px;
  max-width: 135px;
`

const InputContainer = styled.div`
  padding-right: 48px;
  & > * {
    margin-bottom: 32px;
  }
`

const StyledFormGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 456px;
  height: 40px;
`

const StyledInputWrapper = styled.div`
  width: 320px;
`

export const StyledFormGroup = styled(({ label, tooltip, ...props }) => (
  <StyledFormGroupWrapper className="FormGroupWrapper">
    <StyledLabel>{label}{tooltip && <TooltipWithIcon text={tooltip} />}</StyledLabel>
    <StyledInputWrapper>
      <FormTextField {...props} />
    </StyledInputWrapper>
  </StyledFormGroupWrapper>
))``

const StyledUUID = styled(StyledFormGroup)`
  input {
    font-size: 15px;
  }
`

const StatsWrap = styled.div`
  margin-bottom: unset;
  display: flex;
  flex-direction: row;
`

const StatzBox = styled(StatBox)`
  display: inline-block;
  position: relative;
  margin-right: 9px;
  margin-top: 9px;
  flex: 1 1 0px;
  & div {
    height: unset !important;
    width: unset !important;
  }
  & div > div {
    margin: .5rem !important;
  }
`

const CustomerDetailPure = ({
  history,
  updateCustomer,
  match,
  customerDetails,
  pointAdjustments,
  userPermissions,
  venueSettings,
}) => {
  const customerData = get(customerDetails, 'node')
  const timezone = get(venueSettings, 'store.timezone')
  const dateJoined = moment.tz(get(customerData, 'joinedDate'), timezone).format(DATE_FORMAT)
  const pointAdjustmentsData = map(get(pointAdjustments, 'node.pointAdjustments.edges', []), adjustment => adjustment.node)
  const pointsData = get(customerData, 'points')
  const refetchPointAdjustments = () => {
    pointAdjustments.refetch()
    customerDetails.refetch()
  }

  return (
    <Form
      initialValues={customerData}
      onSubmit={(values) => {
        updateCustomer({
          memberId: match.params.id,
          memberData: {
            phoneNumber: get(values, 'phoneNumber'),
            email: get(values, 'email'),
          },
        })
      }}
      keepDirtyOnReinitialize
      decorators={[focusOnError]}
      render={({ handleSubmit, values, submitting, pristine }) => (
        <Fragment>
          {submitting && <Spinner wrapStyle={{ position: 'absolute' }} />}
          <form onSubmit={handleSubmit}>
            <Title>Customer details</Title>

            <SingleItemGrid>
              <InputContainer>
                <StyledFormGroup
                  suffix={<ProductIcon type="envelope" />}
                  label="Email"
                  name="email"
                  placeholder="user@example.com"
                  validate={combineValidators(
                    required,
                    emailValidator,
                  )}
                />
                <StyledFormGroup
                  suffix={<ProductIcon type="telephone" />}
                  label="Phone number"
                  name="phoneNumber"
                  value={formatPhoneNumber(values.phoneNumber)}
                  placeholder="(000) 000-0000"
                  validate={combineValidators(
                    required,
                    () => phoneNumberValidator(trimStart(get(customerData, 'phoneNumber'), '+1')),
                    sanitizedStringValidator,
                  )}
                />
                <StyledUUID
                  label="UUID"
                  name="uuid"
                  disabled
                />
                <StyledFormGroup
                  suffix={<ProductIcon type="calendar" />}
                  label="Date joined"
                  name="joinedDate"
                  value={dateJoined}
                  disabled
                />

                <Subheader
                  textSizeOption={2}
                  color={colors.blueishGray}
                >
                  MANAGE POINTS
                </Subheader>

                <StatsWrap>
                  <StatzBox label="Current points" value={get(pointsData, 'current', 0)} isMoney={false} />
                  <StatzBox label="Points earned" value={get(pointsData, 'earned', 0)} isMoney={false} />
                  <StatzBox label="Points used" value={get(pointsData, 'used', 0)} isMoney={false} />
                  <StatzBox label="Points added" value={get(pointsData, 'added', 0)} isMoney={false} />
                  <StatzBox label="Points removed" value={get(pointsData, 'removed', 0)} isMoney={false} />
                </StatsWrap>

                <AdjustCustomerPointsModal
                  initialValues={customerData}
                  refetchData={refetchPointAdjustments}
                />
                <Subheader
                  textSizeOption={2}
                  color={colors.blueishGray}
                >
                  PAST POINT ADJUSTMENTS
                </Subheader>
                <Table
                  noHover
                  data={pointAdjustmentsData || []}
                  columns={columns(timezone)}
                  NoDataComponent={() => <div className="rt-noData">There are no past point adjustments available</div>}
                />
              </InputContainer>
            </SingleItemGrid>
            <FixedFooterContainer
              showCancel
              onCancel={() => history.push('/crm')}
              showSave
              saveButtonType="Save"
              saveDisabled={
                pristine
                || submitting
                || isEmpty(values.phoneNumber)
                || (!get(userPermissions, 'write', false))
              }
            />
          </form>
        </Fragment>
      )}
    />
  )
}

CustomerDetailPure.propTypes = {
  history: PropTypes.object.isRequired,
  updateCustomer: PropTypes.func,
  match: PropTypes.object,
  customerDetails: PropTypes.object,
  pointAdjustments: PropTypes.object,
  userPermissions: UserPermissionsPropType,
  venueSettings: PropTypes.object,
}

const CustomerDetailPage = compose(
  withModals,
  withRouter,
  withAuthenticatedEmployee,
  withPermissions('BASIC_SETTINGS'),
  withVenueSettings(),
  withCustomerDetails,
  withPointsAdjustments,
  withNotifications,
  withUpdateCustomer(), // requires withNotifications
  renderWhileLoading(() => <Spinner size={2} wrapStyle={{ paddingTop: '40px', paddingRight: '200px' }} />, 'customerDetails'),
  branch(
    ({ customerDetails }) => customerDetails && isEmpty(customerDetails.node),
    () => PageNotFound(true),
  ),
)(CustomerDetailPure)

export default CustomerDetailPage
