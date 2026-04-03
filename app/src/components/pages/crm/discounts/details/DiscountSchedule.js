import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { some } from 'lodash'
import { DAYS } from 'utils/dayToWeekMatcher'

import { FormCheckbox } from 'components/common/input/Checkbox'
import { FormTimeField } from 'components/common/input/DatePicker'
import { RadioButtonGroup, FormRadioButton } from 'components/common/input/RadioButton'
import { TooltipWithIcon } from 'components/common/display/Tooltip'

const DiscountScheduleBox = styled.div`
  width: 406;
  border-radius: 4px;
  background: ${colors.grayLight2};
  padding: 24px 24px 24px 24px;
  h5 {
    color: #5e5e5e;
    margin: 5px 0 10px;
    font-size: 143x;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }
`

const ScheduleContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`

const InlineBox = styled.div`
  display: inline-block;
`

const Centered = styled.div`
  text-align: center;
`

const StyledHeader = styled.div`
  font-size: 14px;
  text-transform: capitalize;
  color: ${colors.grayDark2};
  letter-spacing: 1px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-left: 5px;
`

const StyledLabel = styled.div`
  font-size: 16px;
  text-transform: capitalize;
  color: ${colors.grayDark2};
`

const CenteredCheckbox = styled.div`
  position: relative;
  left: 90%;
  transform: translateX(calc(-50% - 4px));
`

const RadioContainer = styled.div`
  margin-top: 16px;
  margin-left: 24px;
`

const TimeframeContainer = styled.div`
  margin-top: 24px;
  margin-left: 68px;
`

const Spacer = styled.div`
  margin-left: 14px;
  margin-right: 14px;
  color: ${colors.grayDark2};
  font-size: 14px;
  display: inline-block;
`

const DiscountSchedule = ({ values, disabled, hidden }) => {
  const { allDaySelected } = values
  const anyDay = some(DAYS, v => !!values[v])
  return (
    <div style={{ display: hidden ? 'none' : 'inherit' }}> {/* BLOOM-1864 */}
      <StyledHeader>
        AUTO APPLYING SCHEDULE
        <TooltipWithIcon
          text={
            <div>
              The schedule will determine when the discount will be auto-applied during a sale.
              <br /><br />Note, if there are more than one discount
              with an overlapping schedule that could apply to an item or receipt,
              only one will be applied arbitrary during the sale.
            </div>
          }
        />
      </StyledHeader>
      <DiscountScheduleBox >
        <h5>DAYS OF THE WEEK</h5>
        <ScheduleContainer>
          <Centered>
            {DAYS.map(d => (
              <InlineBox key={d}>
                <StyledLabel>{d[0]}</StyledLabel>
                <CenteredCheckbox>
                  <FormCheckbox key={d} name={d} disabled={disabled} />
                </CenteredCheckbox>
              </InlineBox>
            ))}
          </Centered>
        </ScheduleContainer>
        <h5 style={{ marginBottom: '20px' }} >LENGTH OF TIME</h5>
        <RadioContainer>
          <RadioButtonGroup>
            <FormRadioButton disabled={disabled || !anyDay} name="allDaySelected" label="All day" value="allday" />
            <FormRadioButton disabled={disabled || !anyDay} name="allDaySelected" label="Partial day" value="partialday" />
          </RadioButtonGroup>
        </RadioContainer>
        <div style={{ visibility: (hidden || allDaySelected === 'allday') ? 'hidden' : 'visible' }}>  {/* BLOOM-1864 */}
          <TimeframeContainer>
            <InlineBox style={{ width: '140px' }}>
              <FormTimeField
                disabled={disabled || !anyDay}
                name="start"
                placeholder="Start time"
                style={{ fontSize: '14px' }}
              />
            </InlineBox>
            <Spacer>Until</Spacer>
            <InlineBox style={{ width: '140px' }}>
              <FormTimeField
                disabled={disabled || !anyDay}
                name="end"
                placeholder="End time"
                style={{ fontSize: '14px' }}
              />
            </InlineBox>
          </TimeframeContainer>
        </div>
      </DiscountScheduleBox>
    </div>
  )
}

DiscountSchedule.propTypes = {
  values: PropTypes.object,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
}

export default DiscountSchedule
