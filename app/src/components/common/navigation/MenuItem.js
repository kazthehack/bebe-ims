import styled from 'styled-components'
import colors from 'styles/colors'

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  min-height: 34px;
  margin-bottom: 16px;
  color: ${colors.white};
  :hover{
    background-color: ${colors.white};
    color: ${colors.blue};
  }
`

export default MenuItem
