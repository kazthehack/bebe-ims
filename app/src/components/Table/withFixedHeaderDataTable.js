//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import styled from 'styled-components'

const StyledTable = styled.div`
  @media only screen and (min-width : 500px) {
    .fixed-header-data-table-wrapper.active .rt-thead {
      position: fixed;
      background-color: white;
      top: 0;
      width: ${props => props.fixedHeaderWidth};
      min-width: 400px;
      left: ${props => props.leftOffset}
    }
    @media only screen and (max-width : 979px) {
      .fixed-header-data-table-wrapper.active .rt-thead {
        width: ${props => props.fixedHeaderWidthS};
      }
    }
  }
`

// TODO: convert to factory that accepts `headerCompensation` & `boundingOffset` values
// and returns the HOC, using configured values internally to account for custom layout.
// needs further investigation.
// TODO: consider converting to Component (instead of HOC). would require refactor
// but could work similarly and maybe be a bit simpler, needs investigation.
export default (offsetTop = 220, options = {}) => (C) => {
  const {
    width = 'calc(100% - 304px)',
    widthS = 'calc(100% - 104px)',
  } = options

  class FixedHeaderDataTable extends Component {
    static defaultProps = {
      headerCompensation: 59,
      fixedHeaderWidth: width,
      fixedHeaderWidthS: widthS,
    }

    constructor(props) {
      super(props)
      this.state = { headerShouldBeFixed: false }
      this.onPageScroll = this.onPageScroll.bind(this)
      this.onPageResize = this.onPageResize.bind(this)
    }
    componentDidMount() {
      this.onPageScroll()
      window.addEventListener('scroll', this.onPageScroll)
      window.addEventListener('resize', this.onPageResize)
    }
    componentWillUnmount() {
      window.removeEventListener('scroll', this.onPageScroll)
      window.removeEventListener('resize', this.onPageResize)
    }

    onPageScroll() {
      const { dataTableWrapper } = this
      const { boundingOffsetTop = offsetTop } = this.props
      if (!dataTableWrapper) return

      const boundingClientRect = dataTableWrapper.getBoundingClientRect()
      const boundingTop = boundingClientRect.top + boundingOffsetTop
      const boundingBottom = boundingClientRect.bottom
      const headerShouldBeFixed = boundingTop < 0 && boundingBottom > 0
      if (headerShouldBeFixed !== this.state.headerShouldBeFixed) {
        this.setState({
          headerShouldBeFixed,
        })
      }
      this.setState({
        leftOffset: `${boundingClientRect.left}px`,
      })
    }

    onPageResize() {
      const { dataTableWrapper } = this
      this.setState({
        leftOffset: `${dataTableWrapper.getBoundingClientRect().left}px`,
      })
    }

    render() {
      const {
        headerCompensation,
        fixedHeaderWidth,
        fixedHeaderWidthS,
        ...rest
      } = this.props
      return (
        <StyledTable
          fixedHeaderWidth={fixedHeaderWidth}
          fixedHeaderWidthS={fixedHeaderWidthS}
          leftOffset={this.state.leftOffset}
        >
          <div
            ref={(wrapper) => { this.dataTableWrapper = wrapper }}
            className={`fixed-header-data-table-wrapper ${this.state.headerShouldBeFixed && 'active'}`}
            style={{
              paddingTop: this.state.headerShouldBeFixed && headerCompensation,
            }}
          >
            <C {...rest} />
          </div>
        </StyledTable>
      )
    }
  }

  FixedHeaderDataTable.propTypes = {
    headerCompensation: PropTypes.number,
    boundingOffsetTop: PropTypes.number,
    fixedHeaderWidth: PropTypes.string,
    fixedHeaderWidthS: PropTypes.string,
  }

  return FixedHeaderDataTable
}
