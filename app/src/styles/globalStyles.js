//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import { createGlobalStyle } from 'styled-components'
import colors from 'styles/colors'

/* eslint no-unused-expressions: 0 */
export default createGlobalStyle`
  html,
  body {
    height: 100vh;
    width: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background-color: #f8f8f8;
    min-height: 100vh;
    overflow-y: scroll;
  }

  textarea {
    margin-top: 3rem;
    min-height: 54px;
    height: 54px;
  }

  div.ff-radio-group > div {
    position: initial;
    display: block;
    margin-top: 0.8rem;
  }

  input[name=selectallcb]:disabled + div {
    opacity: 0
  }

  label {
    white-space: nowrap;
  }

  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Roboto, sans-serif;
  }

  .tableHover {
    border: 1px solid transparent;
    :hover {
      box-shadow: 0 5px 9px 0 ${colors.trans.black05};
      border-radius: 2px;
      border: 1px solid ${colors.blue};
    }
  }

  #root {
    min-height: 100vh;
  }
`
