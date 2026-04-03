//  Copyright (c) 2018 First Foundry Inc. All rights reserved.
import React from 'react'
import PropTypes from 'prop-types'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import styled from 'styled-components'
import ReactGA from 'react-ga'
import Button from 'components/common/input/Button'
import { get } from 'lodash'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import colors from 'styles/colors'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import { SectionContainer, InputContainer, StyledFormGroup, StyledSubHeader } from './PackageStyledComponents'
import withPackageDetailsMetrcSync from './withPackageDetailsMetrcSync'

const SubsectionBtnContainer = styled.div`
  text-align: right;
  button {
    margin-left: 17px;
    height: 40px;
    width: 208px;
  }
`

const MetrcDetailsPure = ({
  userPermissions,
  packageId,
  syncPackage,
  selectedVenueId,
}) => (
  <SectionContainer>
    <StyledSubHeader>Metrc Details</StyledSubHeader>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <InputContainer>
        <StyledFormGroup label="METRC ID" name="providerInfo.metrcPackageId" disabled />
        <StyledFormGroup label="METRC label" name="providerInfo.tag" disabled />
        <StyledFormGroup label="METRC item" name="providerInfo.metrcProduct.name" disabled />
      </InputContainer>
      <InputContainer>
        <StyledFormGroup label="Category" name="providerInfo.metrcProduct.category" disabled />
        <StyledFormGroup label="Last synced" name="providerLastSync" disabled />
        {get(userPermissions, 'write', false) &&
        <SubsectionBtnContainer>
          <Button
            primary
            onClick={() => {
              ReactGA.event({
                category: GATypes.eventCategories.package,
                action: GATypes.eventActions.synced,
                label: packageId,
              })
              syncPackage(selectedVenueId, packageId)
            }}
          >
            SYNC WITH METRC
            <TooltipWithIcon text="Metrc Sync (TBD)" iconColor={colors.white} />
          </Button>
        </SubsectionBtnContainer>
        }
      </InputContainer>
    </div>
  </SectionContainer>
)

MetrcDetailsPure.propTypes = {
  userPermissions: UserPermissionsPropType,
  packageId: PropTypes.string,
  syncPackage: PropTypes.func,
  selectedVenueId: PropTypes.string,
}

export default withPackageDetailsMetrcSync()(MetrcDetailsPure)
