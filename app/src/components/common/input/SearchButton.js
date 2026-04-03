//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 02/08/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Search from 'components/common/input/Search'
import Button from './Button'

const SearchButton = ({ className, onSearch, buttonLabel, buttonLink, searchProps }) => (
  <div className={className}>
    <Search onSearch={onSearch} {...searchProps} />
    <Link to={buttonLink}>
      <Button primary>{buttonLabel}</Button>
    </Link>
  </div>
)

SearchButton.propTypes = {
  className: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  buttonLink: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  searchProps: PropTypes.object,
}

export default styled(SearchButton)`
  position: absolute;
  top: 0;
  right: 0;
  text-align: right;
  height: 48px;

  button {
    width: 208px;
    height: 100% !important;
    vertical-align: top;
    margin: 0 0 0 8px;
  }

  button span {
    font-size: 15px !important;
    font-weight: 500 !important;
  }
`
