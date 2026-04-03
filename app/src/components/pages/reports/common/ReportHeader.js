import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from 'components/common/input/Button'

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
`

const DateInput = styled.input`
  height: 36px;
  padding: 0 8px;
`

const toDateInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const ReportHeader = ({
  startTime,
  endTime,
  leftArrowClick,
  rightArrowClick,
  disabled,
  comboField,
  comboList,
}) => (
  <HeaderRow>
    {comboList && comboField ? (
      <select
        value={comboField}
        onChange={(event) => comboList.onChange && comboList.onChange(event.target.value)}
      >
        {(comboList.options || []).map(option => (
          <option key={option.value || option.label} value={option.value || option.label}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    ) : null}

    <Button type="button" onClick={() => leftArrowClick && leftArrowClick('startTime')}>
      {'<'}
    </Button>
    <DateInput name="startTime" type="date" defaultValue={toDateInputValue(startTime)} />
    <DateInput name="endTime" type="date" defaultValue={toDateInputValue(endTime)} />
    <Button type="button" onClick={() => rightArrowClick && rightArrowClick('endTime')}>
      {'>'}
    </Button>
    <Button type="submit" disabled={disabled}>Apply</Button>
  </HeaderRow>
)

ReportHeader.propTypes = {
  startTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  endTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  leftArrowClick: PropTypes.func,
  rightArrowClick: PropTypes.func,
  disabled: PropTypes.bool,
  comboField: PropTypes.string,
  comboList: PropTypes.shape({
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ),
  }),
}

ReportHeader.defaultProps = {
  startTime: null,
  endTime: null,
  leftArrowClick: null,
  rightArrowClick: null,
  disabled: false,
  comboField: '',
  comboList: null,
}

export default ReportHeader
