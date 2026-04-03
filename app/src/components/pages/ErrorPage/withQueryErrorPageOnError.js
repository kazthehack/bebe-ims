//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import { renderIfError } from 'utils/hoc'
import { QueryErrorPage } from 'components/pages/ErrorPage'
import { get } from 'lodash'

// propName is the name or names of data prop or props for the targeted query. nav is whether to
// expect the menu and topbar to be showing for the Error page's formatting.
// TODO: propName should be the second argument, not the first
export default (propName = 'data', nav, addPageContent) =>
  renderIfError(
    props => (
      <QueryErrorPage
        nav={nav}
        addPageContent={addPageContent}
        data={// Handling either a string or array of strings
          (typeof propName === 'string') ?
          get(props, propName) :
          get(props, propName.find(p => get(props, `${p}.error`)))
        }
        history={props.history}
      />
    ),
    propName,
  )
