import React from 'react'
import styled from 'styled-components'

const ChanceThe = styled.div`
  width: 1100px;
  height: 100%;
  position: relative;
`

const withFixedPageWidth = C => ({ ...props }) => (
  <ChanceThe>
    <C {...props} />
  </ChanceThe>
)

export default withFixedPageWidth
