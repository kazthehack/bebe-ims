//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/29/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { FormRadioButton, RadioButtonGroup } from 'components/common/input/RadioButton'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { pricingScheme } from 'constants/TooltipMessages'
import DynamicPricingExampleImage from 'assets/images/dynamic_pricing_example.png'
import SplitPricingExampleImage from 'assets/images/split_pricing_example.png'
import COLORS from 'styles/colors'
import SectionHeader from './SectionHeader'
import OptionalSettings from './OptionalSettings'

const StyledCheckbox = styled.div`
  margin-bottom: 20px;
`
const StyledPricingSetting = styled.div`
  display: flex;
  flex-direction: row;
`
const StyledExampleImage = styled.img`
  height: 176px;
  width: 320px;
  margin-top: -10px;
`

const StyledSubheader = styled.div`
  color: ${COLORS.blueishGray};
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
`

const StyledOptionsRightSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

const StyledExampleSubtext = styled.div`
  margin-top: ${props => props.marginTop || 20}px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${COLORS.grayDark2};
`

const StyledBreakdownValue = styled.div`
  font-weight: bold;
  color: ${COLORS.blue};
`

const PriceBreakDown = ({
  label = '',
  value = '',
  ...rest
}) => (
  <span {...rest}>
    <StyledExampleSubtext marginTop={'0'}>{label}</StyledExampleSubtext>
    <StyledBreakdownValue>: {value}</StyledBreakdownValue>
  </span>
)

const StyledPriceBreakDown = styled(PriceBreakDown)`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`

PriceBreakDown.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

const PricingStructureExample = ({ useSplitPricing, ...rest }) => {
  const isUsingSplitPricing = JSON.parse(useSplitPricing || false)
  return (
    <div {...rest}>
      <StyledSubheader>
        {isUsingSplitPricing ? 'Split' : 'Dynamic'} Pricing Example:
      </StyledSubheader>
      <StyledExampleImage
        src={isUsingSplitPricing ?
          SplitPricingExampleImage
          : DynamicPricingExampleImage
        }
        alt="Pricing Structure Example"
      />
      {isUsingSplitPricing ?
        (
          <StyledExampleSubtext>
            A sale of 10g would charge for a quarter-ounce <br />
            plus 3g at the higher 1g rate.
            <br />
            <br />
            <StyledPriceBreakDown label="Order Total" value="10g" />
            <StyledPriceBreakDown label="Base Gram Price" value="$5" />
            <StyledPriceBreakDown label="Total Price" value="$44.75" />
          </StyledExampleSubtext>
        ) : (
          <StyledExampleSubtext>
            A sale of 10g would charge all <br />
            10g at the quarter-ounce rate.
            <br />
            <br />
            <StyledPriceBreakDown label="Order Total" value="10g" />
            <StyledPriceBreakDown label="Base Gram Price" value="$5" />
            <StyledPriceBreakDown label="Total Price" value="$42.50" />
          </StyledExampleSubtext>
        )
      }
    </div>
  )
}

PricingStructureExample.propTypes = {
  useSplitPricing: PropTypes.bool.isRequired,
}

const StyledPricingStructureExample = styled(PricingStructureExample)`
  margin-top: 16px;
  margin-bottom: 24px;
`

const PosSettings = ({ disabled, values = {}, changeValue }) => (
  <div>
    <SectionHeader>POS Settings</SectionHeader>
    <StyledSubheader>
      Post sale flow
      <TooltipWithIcon text="Post sale flow defines what happens after a sale." />
    </StyledSubheader>
    <RadioButtonGroup style={{ marginLeft: '40px' }} name="logoutAfterSale" defaultValue="false">
      <FormRadioButton
        name="logoutAfterSale"
        value="false"
        label="Return to menu after a sale"
        disabled={disabled}
      />
      <FormRadioButton
        name="logoutAfterSale"
        value="true"
        label="Return to pin-in screen after a sale"
        disabled={disabled}
      />
    </RadioButtonGroup>
    <StyledSubheader>
      Label Print Timing
    </StyledSubheader>
    <RadioButtonGroup style={{ marginLeft: '40px' }} name="labelPrintTiming">
      <FormRadioButton
        name="labelPrintTiming"
        value="ON_WEIGH"
        label="Print label when added to cart"
        disabled={disabled}
      />
      <FormRadioButton
        name="labelPrintTiming"
        value="ON_SALE"
        label="Print label when sale is complete"
        disabled={disabled}
      />
    </RadioButtonGroup>
    <StyledSubheader>
      Pricing Scheme
      <TooltipWithIcon
        text={pricingScheme}
      />
    </StyledSubheader>
    <RadioButtonGroup style={{ marginLeft: '40px' }} name="pricingScheme">
      <FormRadioButton
        name="pricingScheme"
        value="PRE_TAX"
        label="I want to set the pre-tax price"
        disabled={disabled}
      />
      <FormRadioButton
        name="pricingScheme"
        value="POST_TAX"
        label="I want to set the final price"
        disabled={disabled}
      />
    </RadioButtonGroup>
    <StyledPricingSetting>
      <StyledSubheader>
        Price Structure:
      </StyledSubheader>
      <StyledOptionsRightSection>
        <RadioButtonGroup name="useSplitPricing">
          <FormRadioButton
            name="useSplitPricing"
            value="false"
            label="Dynamic Pricing"
            disabled
            checked={!!values.useSplitPricing && values.pricingScheme === 'PRE_TAX'}
            onChangeValue={() => {
              changeValue('useSplitPricing', 'false')
            }}
          />
          <FormRadioButton
            name="useSplitPricing"
            value="true"
            label="Split Pricing"
            disabled
            checked={!!values.useSplitPricing && values.pricingScheme !== 'PRE_TAX'}
            onChangeValue={() => {
              changeValue('useSplitPricing', 'true')
            }}
          />
        </RadioButtonGroup>
        <StyledPricingStructureExample useSplitPricing={!!values.useSplitPricing && values.pricingScheme !== 'PRE_TAX'} />
        <StyledCheckbox>
          <FormCheckbox
            label="Combine price breaks for products in the same price group"
            name="combinePriceGroups"
            disabled
            checked={values.pricingScheme === 'PRE_TAX'}
          />
        </StyledCheckbox>
      </StyledOptionsRightSection>
    </StyledPricingSetting>
    <StyledSubheader>Optional settings</StyledSubheader>
    <OptionalSettings disabled={disabled} values={values} />
  </div>
)

PosSettings.propTypes = {
  disabled: PropTypes.bool,
  values: PropTypes.object,
  changeValue: PropTypes.func,
}

export default PosSettings
