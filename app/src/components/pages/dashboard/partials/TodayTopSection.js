import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { get, head, isEmpty } from 'lodash'
import colors from 'styles/colors'
import TodayTopCategoriesGraph from './TodayTopCategoriesGraph'
import TodayTopBudtendersGraph from './TodayTopBudtendersGraph'
import StatBox from './DashboardBox'
import { StyledTitle, StyledColumn } from '../DashboardPagePure'

const StyledSection = styled.div`
  background: ${colors.white}
  width: 408px;
  height: auto;
  min-height: 328px;
  box-sizing: border-box;
  margin-bottom: 20px;
`

const TodayTopSection = ({ todaysTopBudtenders, todaysTopCategories }) => (
  <>
    <StyledColumn style={{ paddingRight: 8 }}>
      <StyledTitle>Today&apos;s top budtenders</StyledTitle>
      <StyledSection>
        <StatBox
          label="Today"
          value={get(head(todaysTopBudtenders), 'budtender', '')}
          borderless
          stacked
        />
        {!isEmpty(todaysTopBudtenders) &&
          <TodayTopBudtendersGraph todaysTopBudtenders={todaysTopBudtenders} />
        }
      </StyledSection>
    </StyledColumn>
    <StyledColumn>
      <StyledTitle>Today&apos;s top categories</StyledTitle>
      <StyledSection>
        <StatBox
          label="Today"
          value={get(head(todaysTopCategories), 'category', '')}
          borderless
          stacked
        />
        {!isEmpty(todaysTopCategories) &&
          <TodayTopCategoriesGraph todaysTopCategories={todaysTopCategories} />
        }
      </StyledSection>
    </StyledColumn>
  </>
)

TodayTopSection.propTypes = {
  todaysTopBudtenders: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    sales: PropTypes.string,
  })),
  todaysTopCategories: PropTypes.arrayOf(PropTypes.shape({
    budtender: PropTypes.string,
    sales: PropTypes.string,
  })),
}

export default TodayTopSection
