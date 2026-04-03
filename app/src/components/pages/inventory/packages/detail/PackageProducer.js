//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { capitalize, map, get, join, split, isEmpty } from 'lodash'
import Button from 'components/common/input/Button'
import PropTypes from 'prop-types'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { sourceProducer } from 'constants/TooltipMessages'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { futureDateValidator } from 'utils/validators'
import {
  SectionContainer,
  InputContainer,
  StyledFormGroup,
  SmallStyledFormGroup,
  StyledFormDatePicker,
  StyledSubHeader,
  StyledFormSelectField,
} from './PackageStyledComponents'

const ViewAllButton = styled(Button)`
  width: 149px;
  height: 40px;
`

const FormGroupAndButtonDiv = styled.div`
  display: flex;
  width: 456px;
  height: 40px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0px;
`

const StyledCapitalizedField = styled(StyledFormSelectField)`
  text-transform: capitalize;
`

const PackageSourcePure = ({
  userPermissions,
  values,
  storeBrands,
  viewHarvestModal,
  mandatoryFieldStyles,
  venueSettings,
}) => (
  <SectionContainer>
    <StyledSubHeader>Producer</StyledSubHeader>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <InputContainer>
        <FormCheckbox
          name="sourceIsProducer"
          label="The source is the same as the producer"
          tooltip={sourceProducer}
          labelStyle={{ color: colors.grayDark2 }}
          style={{ marginLeft: -2 }} // checkbox has white padding making it hard to align
        />
        {values.sourceIsProducer &&
          <Fragment>
            <StyledFormGroup
              label="Producer name"
              name="producerNameSameAsSource"
              disabled
              value={values.facilityName || ''}
            />
            <StyledFormGroup
              label="Producer ID"
              name="producerNameSameAsSource"
              disabled
              value={values.facilityLicense || ''}
            />
          </Fragment>
        }
        {!values.sourceIsProducer &&
        <Fragment>
          <StyledFormGroup
            style={mandatoryFieldStyles && isEmpty(get(values, 'producerName')) ? mandatoryFieldStyles : undefined}
            label="Producer name"
            name="producerName"
            disabled={!get(userPermissions, 'write', false) || values.sourceIsProducer}
          />
          <StyledFormGroup
            style={mandatoryFieldStyles && isEmpty(get(values, 'producerLicense')) ? mandatoryFieldStyles : undefined}
            label="Producer ID"
            name="producerLicense"
            disabled={!get(userPermissions, 'write', false) || values.sourceIsProducer}
          />
        </Fragment>
        }
      </InputContainer>
      <InputContainer>
        <FormGroupAndButtonDiv>
          <SmallStyledFormGroup label="Harvest names" name="source" disabled />
          <ViewAllButton
            disabled={!get(values, 'source')}
            primary
            onClick={() => { viewHarvestModal(values.source) }}
          >
            VIEW ALL
          </ViewAllButton>
        </FormGroupAndButtonDiv>
        <StyledFormDatePicker
          suffix={<ProductIcon type="calendar" />}
          label="Harvest date"
          name="harvestDate"
          disabled={!get(userPermissions, 'write', false)}
          validate={futureDateValidator(get(venueSettings, 'store.timezone'))}
          errorText
        />
        {/* TODO: this is type of drop down needed in package filters */}
        <StyledCapitalizedField
          comboBox
          placeholder="Bloom"
          label="Brand"
          name="brandName"
          disabled={!get(userPermissions, 'write', false)}
          options={storeBrands.map(brand => ({
                      value: join(map(split(get(brand, 'name'), ' '), capitalize), ' '),
                  }))}
        />
      </InputContainer>
    </div>
  </SectionContainer>
)

PackageSourcePure.propTypes = {
  viewHarvestModal: PropTypes.func,
  userPermissions: UserPermissionsPropType,
  values: PropTypes.shape({
    sourceIsProducer: PropTypes.bool,
  }),
  storeBrands: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  mandatoryFieldStyles: PropTypes.object,
  venueSettings: PropTypes.object,
}

export default PackageSourcePure
