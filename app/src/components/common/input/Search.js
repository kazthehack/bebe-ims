import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
// import debounce from 'debounce'
import colors from 'styles/colors'
import SanitizedString from 'utils/parsers'
import { noop } from 'lodash'
import { Field } from 'react-final-form'

import { ProductIcon } from 'components/common/display/ProductIcon'

const StyledIcon = styled(ProductIcon)`
  color: ${({ meta }) => {
    if (meta) {
      if (meta.active) return colors.blue
    }
    return colors.gray
  }};
  font-weight: bold;
`

// eslint-disable-next-line react/prop-types
const Search = ({ className, disabled, onSearch, meta = {}, style }) => (
  <div style={style} className={className}>
    <StyledIcon meta={meta} disabled={disabled} type="search" />
    <input
      type="text"
      placeholder="Search"
      onKeyUp={e => onSearch(e.target.value)}
      disabled={disabled}
      meta={meta}
    />
  </div>
)


Search.propTypes = {
  className: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  meta: PropTypes.object,
}

const ErrorSpan = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
  margin-top: 8px;
  margin-left: 24px;
`

export const FormSearch = ({
  name,
  validate,
  onChange = noop,
  parse = SanitizedString,
  ...props
}) => (
  <Field
    name={name}
    type="text"
    validate={validate}
    parse={parse}
    render={({ input, meta }) => (
      <Fragment>
        <StyledSearchInput
          {...input}
          {...props}
          meta={meta}
          onChange={(e) => { input.onChange(e); onChange(e) }}
        />
        {meta.error && meta.touched && <ErrorSpan>{meta.error}</ErrorSpan>}
      </Fragment>
    )}
  />
)

FormSearch.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.func,
  onChange: PropTypes.func,
  parse: PropTypes.func,
}

// TODO: refactor this-- no reason to nest styles with one styled component like this when the input
// is also accessible in this file
const StyledSearchInput = styled(Search)`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${colors.grayDark};
  border-color: ${({ meta }) => {
    if (meta) {
      if (meta.active) return colors.blue
    }
    return colors.grayDark
  }};
  border-radius: 2px;
  background-color: ${({ disabled }) => (disabled ? colors.grayDark : colors.white)};
  min-width: 208px;
  height: 48px;
  box-sizing: border-box;
  padding-left: 15px;

  input {
    color: ${colors.grayDark2};
    border: 0;
    outline: none;
    padding: 0;
    margin-left: 15px;
    font: 16px 'Roboto', sans-serif !important;
    max-width: 80%;
    background-color: ${({ disabled }) => (disabled ? colors.grayDark : colors.white)};
    cursor: ${props => (props.disabled ? 'not-allowed' : 'inherit')};
  }

  input::placeholder {
    color: ${colors.gray};
  }
`

export default StyledSearchInput
