//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 01/23/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import { Component } from 'react'
import { withRouter } from 'react-router-dom'

// Needed to ensure page navigations take you to the top of the page
// For more information see: https://reacttraining.com/react-router/web/guides/scroll-restoration
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

ScrollToTop.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
}

export default withRouter(ScrollToTop)
