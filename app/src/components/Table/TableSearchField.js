//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React, { useState, useEffect } from 'react'
import TextField from 'components/common/input/TextField'
import Button from 'components/common/input/Button'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import { ProductIcon } from 'components/common/display/ProductIcon'

const Wrapper = styled.div`
  display: inline-flex;
`

const SearchButton = styled(Button)`
  height: 40px;
  width: 44px;
  backgroundColor: white;
  box-shadow: none;
  font-size: 18px;
  :hover, :focus, :active {
    box-shadow: none;
  }
`

const DeleteButton = styled(Button)`
  height: 40px;
  width: 44px;
  backgroundColor: white;
  box-shadow: none;
  font-size: 18px;
  :hover, :focus, :active {
    box-shadow: none;
  }
`

const StyledIcon = styled(ProductIcon)`
  color: ${colors.grayDark2};
  border: 1px solid ${colors.white};
  border-radius: 15px;
  padding: 5px;
  :hover {
    color: ${colors.white};
    background-color: ${colors.blue};
    border-color: ${colors.blue};
  }
`

const borderStyles = {
  borderLeft: 'none',
  borderRight: 'none',
  borderWidth: '1px',
  borderRadius: 0,
  borderColor: colors.grayLight2,
}

const TableSearchField = ({ onSearch, searchTerm, placeholder = 'Search', wrapperStyle, ...rest }) => {
  const [searchFlags, setSearchFlags] = useState({ text: searchTerm })

  useEffect(() => {
    setSearchFlags({ text: searchTerm })
  }, [searchTerm])
  const component = (
    <Wrapper style={wrapperStyle}>
      <SearchButton
        white
        style={{ ...borderStyles, borderLeft: `1px solid ${colors.grayLight2}` }}
        onClick={() => onSearch(searchFlags.text)}
      >
        <StyledIcon type="search" />
      </SearchButton>
      <TextField
        style={{
          ...borderStyles,
          borderRight: searchFlags.text ? 'none' : `1px solid ${colors.grayLight2}`,
          paddingRight: '39.5px',
        }}
        placeholder={placeholder}
        value={searchFlags.text}
        onChange={(e) => {
          e.preventDefault()
          setSearchFlags({ text: e.target.value })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()

            if (!e.target.value) {
              onSearch('')
              setSearchFlags({ text: '' })
            }

            onSearch(e.target.value)
            setSearchFlags({ text: `${e.target.value}` })
          }
        }}
        {...rest}
      />
      {!!searchFlags.text && (
        <DeleteButton
          white
          style={{ ...borderStyles, borderRight: `1px solid ${colors.grayLight2}` }}
          onClick={() => {
            onSearch('')
            setSearchFlags({ text: '' })
          }}
        >
          <StyledIcon type="cross" />
        </DeleteButton>
      )}
    </Wrapper>
  )

  return component
}

TableSearchField.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  wrapperStyle: PropTypes.object,
}

export default TableSearchField
