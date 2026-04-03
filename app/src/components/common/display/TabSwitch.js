import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { withStateHandlers } from 'recompose'
import { get, noop } from 'lodash'
import { TooltipWithIcon } from 'components/common/display/Tooltip'

const TabRow = styled.div`
  height: 34px;
  width: 100%;
  border-bottom: 1px solid ${colors.grayDark};
  display: flex;
`

const Tab = styled.div`
  height: 34px;
  min-width: 82px;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: ${props => (props.selected ? colors.blue : '#616161')};
  border-bottom: ${props => (props.selected ? `1px solid ${colors.blue}` : 'none')};
  padding: 0 16px 0 16px;
  cursor: pointer;
`

const DisplayDiv = styled.div`
  padding: 24px 16px 0 16px
`

const TabSwitch = withStateHandlers(
  { selected: 0 },
  { select: () => x => ({ selected: x }) },
)(({ tabs, selected, select, tooltip }) => (
  <Fragment>
    <TabRow>
      {tabs.map((obj, i) => (
        <Tab
          selected={selected === i}
          key={obj.text}
          onClick={(e) => {
            const onSelect = get(obj, 'onSelect', noop)
            onSelect(e)
            select(Number(e.target.getAttribute('data-value')))
          }}
          data-value={i}
        >
          {obj.text.toUpperCase()}
          {tooltip && (obj.text === 'Price Group') &&
            <TooltipWithIcon text={tooltip} />
          }
        </Tab>
      ))}
    </TabRow>
    <DisplayDiv>
      {get(tabs[selected], 'comp') || select(0)}
    </DisplayDiv>
  </Fragment>
))

TabSwitch.propTypes = {
  selected: PropTypes.number,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default TabSwitch
