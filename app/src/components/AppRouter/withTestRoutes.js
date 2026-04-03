import React, { Component } from 'react'

const withTestRoutes = C => class extends Component {
  state = { TestRoutes: null }
  componentDidMount() {
    import(/* webpackChunkName: "testroutes" */ '../Test').then((mod) => {
      this.setState({ TestRoutes: mod.default })
    })
  }

  render() {
    const { props = {} } = this
    return <C TestRoutes={this.state.TestRoutes} {...props} />
  }
}

export default withTestRoutes
