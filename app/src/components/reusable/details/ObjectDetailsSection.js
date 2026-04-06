import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Section = styled.section`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #fff;
  padding: 14px;
  margin-bottom: 10px;
`

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  color: #243648;
  font-size: 16px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
`

const Item = styled.div`
  min-height: 50px;
`

const Label = styled.div`
  color: #607589;
  font-size: 12px;
  margin-bottom: 4px;
`

const Value = styled.div`
  color: #243648;
  font-size: 14px;
  font-weight: 600;
`

const DescriptionBlock = styled.div`
  margin-top: 10px;
`

const DescriptionValue = styled.div`
  color: #243648;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
`

const ObjectDetailsSection = ({ title, leftLabel, leftValue, rightLabel, rightValue, description }) => (
  <Section>
    {title && <SectionTitle>{title}</SectionTitle>}
    <Grid>
      <Item>
        <Label>{leftLabel}</Label>
        <Value>{leftValue}</Value>
      </Item>
      <Item>
        <Label>{rightLabel}</Label>
        <Value>{rightValue}</Value>
      </Item>
    </Grid>
    <DescriptionBlock>
      <Label>Description</Label>
      <DescriptionValue>{description}</DescriptionValue>
    </DescriptionBlock>
  </Section>
)

ObjectDetailsSection.propTypes = {
  title: PropTypes.string,
  leftLabel: PropTypes.string,
  leftValue: PropTypes.string,
  rightLabel: PropTypes.string,
  rightValue: PropTypes.string,
  description: PropTypes.string,
}

ObjectDetailsSection.defaultProps = {
  title: '',
  leftLabel: 'ID',
  leftValue: 'N/A',
  rightLabel: 'Name',
  rightValue: 'N/A',
  description: 'N/A',
}

export default ObjectDetailsSection
