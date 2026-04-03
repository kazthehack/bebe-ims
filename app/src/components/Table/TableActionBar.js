import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import colors from 'styles/colors'


const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: top;
  min-height: 72px; // 80 minus padding-top
  background-color: ${colors.white};
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  
  button, input {
    height: 40px;
  }
`

const TableActionBar = ({ buttons, search }) => (
  <Wrapper>
    {/* Left Side */}
    <div>
      {search}
    </div>
    {/* Right Side */}
    <div>
      {buttons}
    </div>
  </Wrapper>
)


TableActionBar.propTypes = {
  buttons: PropTypes.node,
  search: PropTypes.node,
}

export default TableActionBar
